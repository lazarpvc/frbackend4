const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
        res.json(entries[0].entries);
      })
      .catch((err) => {
        console.error("Error incrementing entries:", err);
        res.status(500).json('internal server error');
      });
  };

  module.exports = {
    handleImage: handleImage
  }