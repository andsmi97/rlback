// libs
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
// Controllers
const passport = require('passport');
const email = require('./controllers/Email');
const tenant = require('./controllers/Tenant');
const posts = require('./controllers/Posts');
const projects = require('./controllers/Projects');
const settings = require('./controllers/Settings');
const tariffs = require('./controllers/Tariffs');
const auth = require('./controllers/Auth');
const sections = require('./controllers/Sections');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());
app.use(express.json());
app.use('/admin', express.static('build'));
app.use('/', express.static('ozerodom.ru'));
app.use('/news', express.static('News'));
app.use('/projects', express.static('Projects'));
// Routes
app.use(passport.initialize());
app.use(passport.session());

// Tenants
app.post('/tenantinsert', tenant.validateInsert, tenant.insert);
app.post('/tenantupdate', tenant.validateUpdate, tenant.update);
app.delete('/tenantdelete', tenant.validateRemove, tenant.remove);
app.get('/tenants', tenant.select);

// Mail
app.post('/mail', email.send);

// Posts
app.post('/addpost', posts.insert);
app.delete('/deletepost', posts.remove);
app.patch('/updatepost', posts.update);
app.post('/getposts', posts.select); // since i can't use body in GET
app.patch('/updatepostphoto', posts.updatePhoto);
app.delete('/deletePostPhoto', posts.deletePhoto);

// Projects
app.post('/addproject', projects.insert);
app.delete('/deleteproject', projects.remove);
app.patch('/updateproject', projects.update);
app.post('/getprojects', projects.select); // since i can't use body in GET
app.patch('/updateprojectphoto', projects.updatePhoto);
app.delete('/deleteProjectPhoto', projects.removePhoto);

// Settings
app.put('/changeaccountpassword', settings.changeAccountPassword);
app.put('/updateemailcredentials', settings.updateEmailCredentials);
// Tariffs
app.put('/changetariffs', tariffs.change);
// Auth
app.post('/createuser', auth.addUser);
app.post('/login', auth.login);
// TODO: DELETE IN PRODUCTION
app.get('/users', auth.getUsers);
app.post('/deleteuser', auth.deleteUser);
app.get('/getcontacts', auth.getContacts);

app.post('/addimg', sections.addPhoto);
app.post('/addsiteSections', sections.addSiteSections);
app.post('/sectionPhotos', sections.sectionPhotos);
app.delete('/deletePhoto', sections.deletePhoto);
app.post('/updatePhoto', sections.updatePhoto);
app.post('/siteContent', sections.siteContent);
app.post('/uploaddefault', sections.addDefaultPhotos);
app.post('/clearall', sections.clearAll);
app.patch('/reorderPhotos', sections.reorderPhotos);

// Don't stop server in production
process.on('uncaughtException', (err) => {
  console.log(err);
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server is running on port 8080');
});
