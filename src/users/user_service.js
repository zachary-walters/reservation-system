const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const listUsers = async () => {
  try {
    return pool.query('select * from users.users');
  } catch(err) {
    throw err;
  }
};

const createUser = async (first_name, last_name, email, phone) => {
  try {
    return pool.query(
      'insert into users.users (id, first_name, last_name, email, phone) values (uuid_generate_v4(), $1, $2, $3, $4) returning *',
      [first_name, last_name, email, phone],
    );
  } catch(err) {
    throw err;
  }
};

module.exports = {
  listUsers,
  createUser, 
}  