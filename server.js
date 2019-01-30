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
const SignIn = require('./controllers/SignIn');

const app = express();

// Middleware
app.use(bodyParser.json());
const whitelist = ['http://localhost:3000', 'https://lesnayagavan.ru'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// app.use(cors(corsOptions));
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
app.post(
  '/tenantinsert',
  tenant.validateInsert,
  auth.requireAuth,
  tenant.insert
);
app.post(
  '/tenantupdate',
  tenant.validateUpdate,
  auth.requireAuth,
  tenant.update
);
app.delete(
  '/tenantdelete',
  tenant.validateRemove,
  auth.requireAuth,
  tenant.remove
);
app.get('/tenants', auth.requireAuth, tenant.select);

// Mail
app.post('/mail', auth.requireAuth, email.send);

// Posts
app.post('/addpost', auth.requireAuth, posts.insert);
app.delete('/deletepost', auth.requireAuth, posts.remove);
app.patch('/updatepost', auth.requireAuth, posts.update);
app.post('/getposts', posts.select); // since i can't use body in GET
app.patch('/updatepostphoto', auth.requireAuth, posts.updatePhoto);
app.delete('/deletePostPhoto', auth.requireAuth, posts.deletePhoto);

// Projects
app.post('/addproject', auth.requireAuth, projects.insert);
app.delete('/deleteproject', auth.requireAuth, projects.remove);
app.patch('/updateproject', auth.requireAuth, projects.update);
app.post('/getprojects', projects.select); // since i can't use body in GET
app.patch('/updateprojectphoto', auth.requireAuth, projects.updatePhoto);
app.delete('/deleteProjectPhoto', auth.requireAuth, projects.removePhoto);

// Settings
app.put(
  '/changeaccountpassword',
  auth.requireAuth,
  settings.changeAccountPassword
);
app.put(
  '/updateemailcredentials',
  auth.requireAuth,
  settings.updateEmailCredentials
);
// Tariffs
app.put('/changetariffs', auth.requireAuth, tariffs.change);
// Auth
app.post('/createuser', auth.addUser);
app.post('/login', SignIn.signinAuthentication);
// TODO: DELETE IN PRODUCTION
app.get('/users', auth.requireAuth, auth.getUsers);
app.post('/deleteuser', auth.requireAuth, auth.deleteUser);
app.get('/getcontacts', auth.requireAuth, auth.getContacts);

app.post('/addimg', auth.requireAuth, sections.addPhoto);
app.post('/addsiteSections', auth.requireAuth, sections.addSiteSections);
app.post('/sectionPhotos', sections.sectionPhotos);
app.delete('/deletePhoto', auth.requireAuth, sections.deletePhoto);
app.post('/updatePhoto', auth.requireAuth, sections.updatePhoto);
app.post('/siteContent', sections.siteContent);
app.post('/uploaddefault', auth.requireAuth, sections.addDefaultPhotos);
app.post('/clearall', auth.requireAuth, sections.clearAll);
app.patch('/reorderPhotos', auth.requireAuth, sections.reorderPhotos);

// Don't stop server in production
process.on('uncaughtException', (err) => {
  console.log(err);
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server is running on port 8080');
});
