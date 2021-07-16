const { Router } = require('express')
const router = Router()
const Utilisateurs = require('../../models/inscription')
const bcrypt = require('bcryptjs')

router.get('/', async (req, res) => {
    try {
        const bucketListItems = await Utilisateurs.find()
        if (!bucketListItems) throw new Error('Il n\'y a pas d\'utilisateurs')
        const sorted = bucketListItems.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.get('/:id', async (req, res) => {
    Utilisateurs.findById(req.params.id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', async (req, res) => {
    const check = req.body
    Utilisateurs.findOne({ email: check.email })
        .then(async emailExist => {
            if (emailExist) {
                return res.status(400).json({ error: 'L\'adresse email existe déjà !' });
            }
            Utilisateurs.findOne({ nom: check.nom })
                .then(async usernameExist => {
                    if (usernameExist) {
                        return res.status(400).json({ error: 'Le nom d\'utilisateur existe déjà !' });
                    }
                    const hash = await bcrypt.hash(req.body.password, 10);
                    const user = new Utilisateurs({
                        nom: req.body.nom,
                        email: req.body.email,
                        password: hash,
                        passwordBis: hash,
                    })
                    await user.save()
                    res.status(200).json(user)
                })
        })
        .catch(error => res.status(500).json({ error }));
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await Utilisateurs.findByIdAndUpdate(id, req.body)
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
        const removed = await Utilisateurs.findByIdAndDelete(id)
        if (!removed) throw Error('delete : Une erreur est survenue ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router