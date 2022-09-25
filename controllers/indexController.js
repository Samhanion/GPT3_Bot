const indexController = async (req, res) => {
  res.render('index', { title: 'Express' });
};
module.exports = {
  indexController,
};
