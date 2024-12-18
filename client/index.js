const express = require("express");
const bodyParser = require("body-parser");
const client = require("./client");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Expose rest call which internally call gRPC server fucntion using gRPC client

const PORT = 3000;

app.get("/", (req, res) => {
  client.getAll(null, (err, data) => {
    res.send(data);
  });
});

app.post("/create", (req, res) => {
  let newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.insert(newCustomer, (err, data) => {
    console.log("Customer created", data);
    res.send({ message: "Customer Created Successfully" });
  });
});

app.post("/update", (req, res) => {
  let updateCustomer = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.update(updateCustomer, (err, data) => {
    console.log("Customer udpated", data);
    res.send({ message: "Customer Updated Successfully" });
  });
});

app.post("/remove", (req, res) => {
  client.update({ id: req.body.id }, (err, data) => {
    console.log("Customer udpated", data);
    res.send({ message: "Customer Updated Successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
