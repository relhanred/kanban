const { Router } = require('express')
const router = Router()
const Invitation = require('../../models/invitation')

router.get('/', async (req, res) => {
  try {
    const invitation = await Invitation.find()
    if (!invitation) throw new Error('Il n\'y a pas d\'invitations')
    const sorted = invitation.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
    res.status(200).json(sorted)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/id/:id', async (req, res) => {
  console.log(req.params)
  Invitation.findById(req.params.id)
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})



router.get('/user/:user', async (req, res) => {
  let invitationByUsers = []
  Invitation.find()
    .then(result => {
      result.forEach(invitation => {
        if (invitation.guests.includes(req.params.user)) {
          invitationByUsers.push(invitation);
        }
      });
      if(invitationByUsers.length == 0) {
        return res.status(200).json({ msg: 'Vous n\'avez pas d\'invitation !' });
      }
      res.status(200).json(invitationByUsers);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

router.get('/projet/:id', async (req, res) => {
  Invitation.find()
  let invitationByProjetId = []
    .then(result => {
      result.forEach(invitation => {
        if (invitation.idProjet == req.params.id) {
          invitationByProjetId = invitation;
        }
      });
      res.status(200).json(invitationByProjetId);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
})

// Creating one
router.post('/', async (req, res) => {
  const invitation = new Invitation({
      idProjet: req.body.idProjet,
      nomProjet: req.body.nomProjet,
      proprio: req.body.proprio,
      guests: req.body.guests
  })
  try {
      if (!invitation) throw new Error('post : une erreur est survenue')
      await invitation.save()
      res.status(200).json(invitation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await Invitation.findByIdAndUpdate(id, req.body)
    if (!response) throw Error('put : Une erreur est survenue')
        const updated = { ...response._doc, ...req.body }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const removed = await Invitation.findByIdAndDelete(id)
        if (!removed) throw Error('delete : Une erreur est survenue ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router