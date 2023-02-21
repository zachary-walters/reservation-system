const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const listInventory = async () => {
  try {
    return pool.query('select * from inventory.inventory;');
  } catch(err) {
    throw err;
  }
}

const getInventoryByReservationTime = async (reservation_time) => {
  try {
    return pool.query('select * from inventory.inventory where reservation_time = $1', [reservation_time]);
  } catch(err) {
    throw err;
  }
};

const createInventory = async (availability, party_size, start_time, end_time) => {
  try {
    return pool.query(
      `
      insert into inventory.inventory (id, availability, party_size, reservation_time)
      select
        uuid_generate_v4(),
        $1,
        $2, 
        ts.*
      from  
        generate_series($3::timestamp, $4::timestamp, '15 minutes'::interval) ts
      ;`,
      [availability, party_size, start_time, end_time]
    );
  } catch(err) {
    throw err;
  }
}

const updateInventory = async (id, decrease, next) => {  
  let sql = `update inventory.inventory set availability = availability + 1 where id = $1;`
  if (decrease === 'true') {
    sql = `update inventory.inventory set availability = availability - 1 where id = $1;`
  }

  try {
    return await pool.query(sql, [id]); 
  } catch(err) {
    throw err
  }
}

module.exports = {
  listInventory,
  getInventoryByReservationTime,
  createInventory, 
  updateInventory,
}  