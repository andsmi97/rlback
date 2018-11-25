const getSite = (req, res) => {
  let Post = mongoose.model("Post", news);
  Post.find({ date: { $lt: date } }, null, { limit: 50 })
    .sort({ date: "desc" })
    .then(posts => {
      res.status(200).json(posts);
    });
};
