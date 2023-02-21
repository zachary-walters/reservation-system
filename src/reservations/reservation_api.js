const express = require('express')
const axios = require('axios');
const bodyParser = require('body-parser')
const app = express()
const port = 5552

const service = require('./reservation_service');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const listReservation = async (req, res, next) => {
  await service.listReservations()
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    })
}

const reserve = async (req, res, next) => {
  const { user_id, reservation_time, party_size } = req.body;
  const checkInventoryURL = `http://inventory_microservice:5551/inventory/time/${reservation_time}`
  const updateInventoryURL = `http://inventory_microservice:5551/inventory/update/`
  const createReservationURL = `http://reservation_microservice:5552/reservations/create`
  const deleteReservationURL = `http://reservation_microservice:5552/reservations/delete`

  let resp = await axios.get(checkInventoryURL)
    .catch((e) => {
      console.log(e)
    })

  if (!resp) {
    res.status(400).send(`Cannot find inventory.`)
    return
  }

  let inventory = resp.data;
  if (inventory.length != 1 || inventory[0].availability < 1 || inventory[0].party_size < party_size) {
    console.log(`No reservation(s) available for a max party size of ${party_size} at ${inventory.reservation_time}.`)
    res.status(400).send(`No reservation(s) available for a max party size of ${party_size} at ${reservation_time}.`)
    return
  }

  // CREATE RESERVATION
  resp = await axios.post(createReservationURL, {user_id: user_id, reservation_time: reservation_time, party_size: party_size})
    .catch((e) => {
      console.log(e.message)
    })

  if (!resp) {
    res.status(400).send(`Unable to create reservation`)
    return
  }

  let reservation = resp.data.rows[0];

  // UPDATE INVENTORY
  resp = await axios.post(updateInventoryURL, {id: inventory[0].id, decrease: 'true'})
    .catch((e) => {
      console.log(e)
    })

  if (!resp) {
    await axios.post(deleteReservationURL, {id: reservation.id})
      .then(() => {
        console.log("Rolling back reservation creation.")
      })
      .catch((e) => {
        console.log(e)
      })
    res.status(400).send(`Unable to update inventory`)
    return
  }

  res.status(200).send(`Successfully Created Reservation`);
}

const create = async (req, res, next) => {
  const {user_id, reservation_time, party_size} = req.body;

  await service.createReservation(user_id, reservation_time, party_size)
    .then((r) => {
      res.status(201).send(r)
    })
    .catch((e) => {
      console.log(e.message)
      res.status(500).send(e);
    })
}

const deleteReservation = async (req, res, next) => {
  const {id} = req.body;

  await service.deleteReservationByID(id)
  .then((r) => {
    res.status(201).send(r)
  })
  .catch((e) => {
    console.log(e)
    res.status(500).send(e);
  })
}

app.get('/reservations', (req, res, next) => {
  listReservation(req, res, next);
});
app.post('/reservations/reserve', (req, res, next) => {
  reserve(req, res, next);
});
app.post('/reservations/create', (req, res, next) => {
  create(req, res, next);
});
app.post('/reservations/delete', (req, res, next) => {
  deleteReservation(req, res, next);
});

app.listen(port, () => {
	console.log(`Reservation microservice running on port ${port}`)
});