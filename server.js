//libs
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

//Controllers
const email = require("./controllers/Email");
const tenant = require("./controllers/Tenant");
const posts = require("./controllers/Posts");
const settings = require("./controllers/Settings");
const tariffs = require("./controllers/Tariffs");
const auth = require("./controllers/Auth");
const sections = require("./controllers/Sections");
const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
app.use(helmet());
app.use("/admin", express.static("build"));
app.use("/", express.static("ozerodom.ru"));
app.use("/news", express.static("News"));
//Routes

//Tenants
app.post("/tenantinsert", tenant.handleInsert);
app.post("/tenantupdate", tenant.handleUpdate);
app.delete("/tenantdelete", tenant.handleDelete);
app.get("/tenants", tenant.handleSelect);

//Mail
app.post("/mail", email.handleSend);

//Posts
app.post("/addpost", posts.addPost);
app.delete("/deletepost", posts.deletePost);
app.patch("/updatepost", posts.updatePost);
app.post("/getposts", posts.getPosts); //since i can't use body in GET

//Settings
app.put("/changeaccountpassword", settings.changeAccountPassword);
app.put("/updateemailcredentials", settings.updateEmailCredentials);

//Tariffs
app.put("/changetariffs", tariffs.changeTariffs);

//Auth
app.post("/createuser", auth.addUser);
app.post("/login", auth.login);

//TODO: DELETE IN PRODUCTION
app.get("/users", auth.getUsers);
app.post("/deleteuser", auth.deleteUser);
app.get("/getcontacts", auth.getContacts);

app.post("/addimgcarousel", sections.addCarouselPhoto);
app.post("/addsiteSections", sections.addSiteSections);
app.post("/sectionPhotos", sections.sectionPhotos);
//Don't stop server in production
process.on("uncaughtException", err => {
  console.log(err);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`server is running on port 8080`);
});
