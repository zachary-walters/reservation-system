const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const listReservations = async () => {
  try {
    return pool.query('select * from reservations.reservations');
  } catch (err) {
    throw err;
  }
};

const createReservation = async (user_id, reservation_time, party_size) => {
  try {
    const result = await pool.query(
      `
      insert into reservations.reservations (id, user_id, date, time, party_size)
      values(
        uuid_generate_v4(),
        $1,
        $2::date,
        $3::time,
        $4
      )
      returning *;`,
      [user_id, reservation_time, reservation_time, party_size]
    );
    return result;
  } catch(err) {
    throw err;
  }
}

const deleteReservationByID = async (id) => {
  try {
    return pool.query('delete from reservations.reservations where id = $1', [id]);
  } catch (err) {
    throw err
  }
};


module.exports = {
  listReservations,
  createReservation,
  deleteReservationByID,
}  