const mysql = require(`mysql-await`);

var connPool = mysql.createPool({
  connectionLimit: 5,
  host: "",
  user: "",
  database: "",
  password: "",
});

async function addContact(data){
  return await connPool.awaitQuery(
    "INSERT INTO contact (contact_name, contact_email, contact_date, browser_choice, is_subscribed) VALUES (?, ?, ?, ?, ?)",
    [data.name, data.email, data.date, data.dropdown, data.checkbox]);
}

async function deleteContact(id){
  const results = await connPool.awaitQuery("DELETE FROM contact WHERE contact_id=?", [id]);
  if (results.affectedRows)
    return true;
  return false;
}

async function getContacts() {
  return await connPool.awaitQuery("SELECT * FROM contact");
}

async function addSale(message) {
  return await connPool.awaitQuery("INSERT INTO sale (sale_message) VALUES (?)", [message]);
}

async function endSale() {
  return await connPool.awaitQuery("UPDATE sale SET end_time = CURRENT_TIMESTAMP WHERE end_time IS NULL");
}

async function getRecentSales() {
  return await connPool.awaitQuery("SELECT * FROM sale ORDER BY start_time DESC LIMIT 3");
}

module.exports = {addContact, getContacts, deleteContact, addSale, endSale, getRecentSales};
