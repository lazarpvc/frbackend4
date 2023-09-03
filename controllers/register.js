

const registerHandler = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, 10);
    db.transaction((trx) => {
      trx.insert({
        hash: hash,
        email: email,
      })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            })
            .catch((err) => {
              console.error("Error inserting user:", err);
              res.status(500).json('internal server error');
            });
        })
        .then(trx.commit)
        .catch((err) => {
          console.error("Error inserting login:", err);
          trx.rollback();
          res.status(500).json('internal server error');
        });
    })
    .catch((err) => {
      console.error("Error registering:", err);
      res.status(500).json('internal server error, db');
    });
  };

  module.exports = {
    registerHandler: registerHandler
  }