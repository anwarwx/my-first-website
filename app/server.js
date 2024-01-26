const express = require("express");
const basicAuth = require('express-basic-auth');
const { deleteContact, addContact, getContacts, getRecentSales, addSale, endSale } = require("./database/data");
const app = express();
const PORT = 4131;

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const MyAuth = basicAuth({
  users: { 'admin': 'password' },
  challenge: true,
  unauthorizedResponse: "401 Unauthorized"
});

app.use((req, res, next) => {
  next();
  console.log(`"${req.method} ${req.originalUrl}" ${res.statusCode}`);
});

app.use(express.static("resources"));

// GET /
app.get('/', (req, res) => {
  res.render("mainpage.pug", {
    title: "GreenWrap Solutions"
  });
});

// GET /main
app.get('/main', (req, res) => {
  res.render("mainpage.pug", {
    title: "GreenWrap Solutions"
  });
});

/*
  GET  /contact
  POST /contact
*/
app.route('/contact')
  .get((req, res) => {
    res.render("contactform.pug", {
      title: "Contact Form"
    });
  })
  .post(confirmation);

// GET /testimonies
app.get('/testimonies', (req, res) => {
  res.render("testimonies.pug", {
    title: "Customer Reviews"
  });
});

// GET /admin/contactlog
app.get('/admin/contactlog', MyAuth, async (req, res) => {
  const CONTACTS = JSON.parse(JSON.stringify(await getContacts()));
  console.log(CONTACTS);

  const LABELS =
    ['Name', 'Email', 'Date', 'Service', 'Status', 'Time Until', 'Delete Row'];

  res.render("contactlog.pug", {
    title: "Contact Log",
    labels: LABELS,
    contacts: CONTACTS
  });
});

// DELETE /api/contact
app.delete('/api/contact', MyAuth, delete_contact);

/*
  GET    /api/sale
  POST   /api/sale
  DELETE /api/sale
*/
app.route('/api/sale')
  .get(async (req, res)=> res.status(200).send((await get_sale())[0]))
  .post(MyAuth, set_sale)
  .delete(MyAuth, delete_sale);

app.get('/admin/salelog', MyAuth, async (req, res)=> res.status(200).send(await get_sale()));

// 404
app.use((req, res) => res.status(404).render("404.pug", { title: "Error 404" }));

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));


// *** HELPER FUNCTIONS ***
function parse_params(req, res) {
  const params = req.body;

  if (!params.name || !params.email)
    return false;

  let option = params.dropdown;
  if (!option)
    option = "";
  else
    option = option[0].toUpperCase() + option.slice(1);

  let status = "Subscribed";
  if (!params.checkbox)
    status = "Not Subscribed";

  const data = {
    'name': params.name,
    'email': params.email,
    'date': params.date,
    'dropdown': option,
    'checkbox': status
  };

  addContact(data).then(console.log);
  return true;
}

function confirmation(req, res) {
  let code = 400;
  let locals = {
    title: "Failed!",
    id: "error_gif",
    message: "error",
    image: "error.gif"
  };

  if (parse_params(req, res)) {
    locals['title'] = "Success!";
    locals['id'] = "confirm_gif";
    locals['message'] = "confirmation";
    locals['image'] = "confirm.gif";
    code = 201;
  }
  res.status(code).render("confirmation.pug", locals);
}

function delete_contact(req, res) {
  if (req.is('application/json')) {
    const id = String(req.body.id);
    if (id) {
      if (deleteContact(id))
        res.status(200).send("200 OK");
      else
        res.status(404).send("404 Not Found");
      return;
    }
  }
  res.status(400).send("400 Bad Request");
}

function set_sale(req, res) {
  if (req.is('application/json')) {
    const message = req.body.message;
    if (message) {
      addSale(message);
      res.status(200).send("200 OK");
      return;
    }
  }
  res.status(400).send("400 Bad Request");
}

function delete_sale(req, res) {
  endSale();
  res.status(200).send("200 OK");
}

async function get_sale() {
  const SALES = JSON.parse(JSON.stringify(await getRecentSales()));
  let salesJSON = [];
  let i = 0;
  for (const sale of SALES) {
    let v = 1;
    if (sale.end_time) v = 0;
    salesJSON[i] = {'message': sale.sale_message, 'active': v};
    i++;
  }
  return salesJSON;
}
