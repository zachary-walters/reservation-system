const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5550

const service = require('./user_service');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const listUsers = async (req, res, next) => {
  await service.listUsers()
  .then((r) => {
    res.status(200).json(r.rows);
  })
  .catch((e) => {
    res.status(500).send(e.message);
  })
}

const createUser = async (req, res, next) => {
  const { first_name, last_name, email, phone } = req.body;

  await service.createUser(first_name, last_name, email, phone)
  .then(() => {
    res.status(200).send(`User successfully created`);
  })
  .catch((e) => {
    res.status(500).send(e.message);
  })
}

app.get('/users', (req, res, next) => {
  listUsers(req, res, next);
});
app.post('/users/create', (req, res, next) => {
  createUser(req, res, next);
});

app.listen(port, () => {
	console.log(`User microservice running on port ${port}`)
})