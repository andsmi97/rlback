const bill = (req, res) => {
  const { billname } = req.params;
  const file = `../back/Bills/${billname}`;
  res.download(file);
};

module.exports = {
  bill,
};
