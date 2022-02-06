const db = require('../db/db');
const User = db.User;

exports.like = (req, res) => {

  if (!req.body.songid) return res.status(400).send({message: 'No songId'});

  User.findById(req.userId)
  .then(user => {
    let liked = user.liked;
    const songId = req.body.songid;

    if (!liked.includes(songId)) {

      liked.push(songId);
      user.liked = liked;
      user.save((err => {

        if (err) return res.status(500).send({err: err.message});
        res.status(200).send({message: 'Add song to liked'});
        console.log(`Song ${songId} was added to user liked`);

      }))

    } else {

      const newLiked = liked.filter(id => id != songId);
      user.liked = newLiked;
      user.save((err => {

        if (err) return res.status(500).send({err: err.message});
        console.log(`Song ${songId} was removed from user liked`);
        res.status(200).send({message: 'Removed song from liked'});

      }))

    }
  })
  .catch(err => res.status(500).send({err: err.message}));

};

exports.user = (req, res) => {

  if (!req.userId) return res.status(400).send({message: 'No userId'});
  User.findById(req.userId)
  .then(user => {
    const userInfo = {
      login: user.login,
      roles: user.roles,
      liked: user.liked
    }
    return res.status(200).send({user: userInfo})
  })
  .catch(err => res.status(500).send({err: err.message}));

}