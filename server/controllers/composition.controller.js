const db = require('../db/db');
const Composition = db.Composition;

exports.all = (req, res) => {
    Composition.find({})
    .then(songs => {
        return res.status(200).send(songs);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({message: 'Getting playlists error', err: err.message});
    });
}

exports.id = (req, res) => {
    try {
        Composition.findById(req.params.id, (err, song) => {
            if (err) {
                console.log(err);
                return res.status(500).send({message: 'Getting playlists error', err: err.message});
            }
            return res.status(200).send(song);
        });
    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Getting playlists error', err: err.message});
        }
    }
}