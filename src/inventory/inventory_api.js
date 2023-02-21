const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5551

const service = require('./inventory_service');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const listInventory = async (req, res, next) => {
  await service.listInventory()
  .then((r) => {
    res.status(200).json(r.rows);
  })
  .catch((e) => {
    res.status(500).send(e.message);
  })
}

const getInventoryByReservationTime = async (req, res, next) => {
  const reservation_time = req.params.reservation_time;

  await service.getInventoryByReservationTime(reservation_time)
    .then((r) => {
      res.status(200).json(r.rows);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e.message);
    })
}

const createInventory = async (req, res, next) => {
  const {availability, party_size, start_time, end_time} = req.body;

  await service.createInventory(availability, party_size, start_time, end_time)
    .then(() => {
      res.status(201).send(`Inventory added for timeframe: ${start_time} - ${end_time}`)
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e.message);
    })
}

const updateInventory = async (req, res, next) => {
  const {id, decrease} = req.body;

  await service.updateInventory(id, decrease, next)
    .then(() => {
      res.status(201).send(`Inventory with id ${id} updated successfully`);
    })
    .catch((e) => {
      console.log(e)
      res.status(500).send(e);
    })
}

app.get('/inventory', (req, res, next) => {
  listInventory(req, res, next);
});
app.get('/inventory/time/:reservation_time', (req, res, next) => {
  getInventoryByReservationTime(req, res, next);
});
app.post('/inventory/create', (req, res, next) => {
  createInventory(req, res, next);
});
app.post('/inventory/update', (req, res, next) => {
  updateInventory(req, res, next);
});

app.listen(port, () => {
	console.log(`Inventory microservice running on port ${port}`)
});