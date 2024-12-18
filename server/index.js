// grpc:"1.24.11"
// @grpc/proto-loader:"0.7.10"
const PROTO_PATH = "./customers.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: true,
  enums: true,
  arrays: true,
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const customers = [
  {
    id: "1",
    name: "sanjheev",
    age: 22,
    address: "Chennai",
  },
  {
    id: "2",
    name: "monika",
    age: 22,
    address: "Chennai",
  },
];

server.addService(customersProto.CustomerService.service, {
  getAll: (call, callback) => {
    callback(null, { customers });
  },
  get: (call, callback) => {
    let customer = customers.find((n) => n.id === call.request.id);
    if (customer) {
      callback(null, { customer });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
  insert: (call, callback) => {
    let customer = call.request;
    customer.id = Date.now();
    customers.push(customer);
    callback(null, customer);
  },
  update: (call, callback) => {
    let customer = customers.find((n) => n.id === call.request.id);
    if (customer) {
      customer.name = call.request.name;
      customer.age = call.request.age;
      customer.address = call.request.address;
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not Found",
      });
    }
  },
  remove: (call, callback) => {
    let customerIndex = customers.findIndex((n) => n.id == call.request.id);
    if (customerIndex != -1) {
      customers.splice(customerIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not FOund",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Error while starting grpc server", err);
    } else {
      console.log(`Grpc Server Started and listening on ${port}`);
    }
  }
);
