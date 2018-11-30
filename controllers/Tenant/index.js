const fs = require("fs");
const path = require("path");

// const config = require("../../config");
const mongoose = require("mongoose");
// const connectionString = `mongodb://${config.DB.LOGIN}:${
//   config.DB.PASSWORD
// }@freecluster-shard-00-00-rec05.mongodb.net:27017,freecluster-shard-00-01-rec05.mongodb.net:27017,freecluster-shard-00-02-rec05.mongodb.net:27017/test?ssl=true&replicaSet=FreeCluster-shard-0&authSource=admin&retryWrites=true/${
//   config.DB.NAME
// }`;

const connectionString = `mongodb://localhost:27017/TenantsDB`;
mongoose.connect(
  connectionString
);
const db = mongoose.connection;
let tenants = new mongoose.Schema({
  houseNumber: { type: Number, unique: true },
  email: {
    type: String
    // match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  name: {
    type: String
    // match: /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g
  }
});
db.on("error", console.error.bind(console, "connection error:"));

const isCorrectEmail = email => {
  let regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(email);
};
const isHouseInRange = (number, min, max) => {
  if (!min) {
    min = 0;
  }
  if (!max) {
    max = 56;
  }
  return number > min && number <= max;
};
const isNameCorrect = name => {
  let regExp = /^((?:[а-яА-ЯёЁ]+\s){2}[а-яА-ЯёЁ]+)$/g;
  return regExp.test(name);
};
const compareKeys = (a, b) => {
  let aKeys = Object.keys(a).sort();
  let bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};
const getReqErrors = (req, expectedReq) => {
  let error = [];
  if (compareKeys(req, expectedReq)) {
    error.push("Неверные данные");
  }
  if (req.hasOwnProperty("email")) {
    if (!isCorrectEmail(req.email)) {
      error.push("Неверный формат email");
    }
  }
  if (req.hasOwnProperty("houseNumber")) {
    if (!isHouseInRange(req.houseNumber)) {
      error.push("Неверный номер дома");
    }
  }
  if (req.hasOwnProperty("name")) {
    if (!isNameCorrect(req.name)) {
      error.push("Неверный формат имени");
    }
  }
  return error;
};
const isArrayEmpty = array => {
  return Array.isArray(array) && !array.length ? true : false;
};
const isErrors = errors => {
  return !isArrayEmpty(errors);
};
const backUpTenants = tenants => {
  let date = new Date();
  let fileToWrite = date
    .toString()
    .slice(4, 24)
    .split(" ")
    .join("-")
    .split(":")
    .join("_")
    .concat(".json");
  fs.writeFile(
    path.join(__dirname, `../../tenants/${fileToWrite}`),
    JSON.stringify(tenants),
    err => {
      if (err) throw err;
      console.log("file saved");
    }
  );
};
// let tenantsPath = "../../tenants/tenants.json";
// let tenantsPath = "../../tenants/test.json";
// let tenantsPath = "test.json";

const handleInsert = (req, res) => {
  const { name, email, houseNumber } = req.body;
  console.log(name, email, houseNumber);
  const expectedReq = {
    name: "",
    email: "",
    houseNumber: 0
  };
  let errors = getReqErrors(req, expectedReq);
  if (!isErrors(errors)) {
    let Tenant = mongoose.model("Tenant", tenants);
    let newTenant = new Tenant({
      houseNumber,
      email,
      name
    });
    newTenant.save(err => {
      if (err) {
        return res.status(400).json(err);
      }
      Tenant.find({})
        .then(post => res.status(200).json(post))
        .catch(err => res.status(400).json(err));
    });
  } else {
    return res.status(400).json(errors);
  }
};

const handleUpdate = (req, res) => {
  console.log(req.body);
  const { name, email, houseNumber } = req.body;
  const expectedReq = {
    name: "",
    email: "",
    houseNumber: 0
  };

  let errors = getReqErrors(req, expectedReq);
  if (!isErrors(errors)) {
    let Tenant = mongoose.model("Tenant", tenants);
    Tenant.findOneAndUpdate(
      {
        houseNumber
      },
      {
        $set: {
          name,
          email
        }
      },
      () => {
        Tenant.find()
          .then(tenant => res.status(200).json(tenant))
          .catch(err => res.status(400).json(err));
      }
    );
    // fs.readFile(path.join(__dirname, tenantsPath), "utf-8", (err, data) => {
    //   if (err) {
    //     throw err;
    //   }
    //   content = data;
    //   tenants = JSON.parse(content);
    //   if (tenants.hasOwnProperty(houseNumber)) {
    //     backUpTenants(tenants);
    //     tenants[houseNumber] = { email: email, name: name };
    //     fs.writeFile(
    //       path.join(__dirname, tenantsPath),
    //       JSON.stringify(tenants),
    //       function(err) {
    //         if (err) {
    //           throw err;
    //         }
    //         //TODO: log changes here
    //       }
    //     );
    //     res.status(200).json(tenants);
    //   } else {
    //     res.status(400).json("Жильца в таком доме не существует");
    //   }
    // });
  } else {
    res.status(400).json(errors);
  }
};

const handleDelete = (req, res) => {
  const { houseNumber } = req.body;
  const expectedReq = {
    houseNumber: 0
  };
  let errors = getReqErrors(req, expectedReq);
  if (!isErrors(errors)) {
    let Tenant = mongoose.model("Tenants", tenants);
    Tenant.findOneAndDelete({ houseNumber: houseNumber }, err => {
      if (err) res.status(400).json(err);
      Tenant.find()
        .then(tenant => res.status(200).json(tenant))
        .catch(err => res.status(400).json(err));
    });
    // fs.readFile(path.join(__dirname, tenantsPath), "utf-8", (err, data) => {
    //   if (err) {
    //     throw err;
    //   }
    //   content = data;
    //   tenants = JSON.parse(content);
    //   if (tenants.hasOwnProperty(houseNumber)) {
    //     backUpTenants(tenants);
    //     delete tenants[houseNumber];
    //     fs.writeFile(
    //       path.join(__dirname, tenantsPath),
    //       JSON.stringify(tenants),
    //       function(err) {
    //         if (err) {
    //           throw err;
    //         }
    //         //TODO: log changes here
    //       }
    //     );
    //     res.status(200).json(tenants);
    //   } else {
    //     res.status(400).json("Жильца в таком доме не существует");
    //   }
    // });
  } else {
    res.status(400).json(errors);
  }
};

const handleSelect = (req, res) => {
  //check if correct request data()
  let Tenant = mongoose.model("Tenant", tenants);
  Tenant.find({})
    .then(tenants => res.status(200).json(tenants))
    .catch(err => res.status(400).json(err));
  // fs.readFile(path.join(__dirname, tenantsPath), "utf-8", (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   content = data;
  //   tenants = JSON.parse(content);
  //   res.status(200).json(tenants);
  // });
};

// const getPosts = (req, res) => {
//   let { date } = req.body;
//   let Post = mongoose.model("Post", news);
//   Post.find({ date: { $lt: date } }, null, { limit: 50 })
//     .sort({ date: "desc" })
//     .then(posts => {
//       res.status(200).json(posts);
//     });
// };

module.exports = {
  handleInsert: handleInsert,
  handleUpdate: handleUpdate,
  handleDelete: handleDelete,
  handleSelect: handleSelect
};
