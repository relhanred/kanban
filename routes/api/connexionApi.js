const { Router } = require('express')
const router = Router()
const Utilisateurs = require('../../models/inscription')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// const auth = require('../../frontend/src/middlewares/auth');

router.post('/', async (req, res) => {
  Utilisateurs.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            userName: user.nom,
            userEmail: user.email,
            connected: true,
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
});

module.exports = router