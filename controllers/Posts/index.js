const mongoose = require("mongoose");
const connectionString = `mongodb://localhost:27017/TenantsDB`;
mongoose.connect(connectionString);
const db = mongoose.connection;
let news = new mongoose.Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now }
});

db.on("error", console.error.bind(console, "connection error:"));

const addPost = (req, res) => {
  let { title, body } = req.body;
  let Post = mongoose.model("Post", news);
  let newPost = new Post({
    title: title,
    body: body,
    date: Date.now()
  });
  newPost.save(err => {
    if (err) res.status(400).json("Возникла ошибка при вставке");
    res.status(200).json(newPost);
  });
};

const getPosts = (req, res) => {
  let { date } = req.body;
  console.log("GETTING POSTS");
  let Post = mongoose.model("Post", news);
  Post.find({ date: { $lt: date } }, null, { limit: 50 })
    .sort({ date: "desc" })
    .then(posts => {
      res.status(200).json(posts);
    });
};

const deletePost = (req, res) => {
  console.log("deletePost");
  let { id } = req.body;
  console.log(id);
  let Post = mongoose.model("Post", news);
  Post.findByIdAndDelete(id)
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json(err));
};

const updatePost = (req, res) => {
  let { id, title, body } = req.body;
  console.log(id, title, body);
  let Post = mongoose.model("Post", news);
  Post.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title,
        body: body
      }
    },
    (err, dbRes) => {
      console.log(dbRes);
      Post.findById(id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(400).json(err));
      if (err) res.status(400).json(err);
    }
  );
};
module.exports = {
  addPost,
  getPosts,
  deletePost,
  updatePost
};
