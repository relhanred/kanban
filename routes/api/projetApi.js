const { Router } = require('express')
const router = Router()
const Projet = require('../../models/Projet')

router.get('/', async (req, res) => {
    try {
        const projetsList = await Projet.find()
        if (!projetsList) throw new Error('Il n\'y a pas de projets')
        const sorted = projetsList.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/id/:id', async (req, res) => {
    Projet.findById(req.params.id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/public/:public', async (req, res) => {
    Projet.find({ public: true })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


router.get('/proprio/:proprio', async (req, res) => {
    Projet.find({ proprio: req.params.proprio })
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
    let username = req.params.user;
    let projetUser = [];
    Projet.find()
        .then(result => {
            result.forEach(projet => {
                if ((projet.users.includes(username)) || (projet.proprio == username)) {
                    projetUser.push(projet);
                }
            });
            res.status(200).json(projetUser)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

// Creating one
router.post('/', async (req, res) => {
    const user = new Projet({
        nomProjet: req.body.nomProjet,
        rows: req.body.rows,
        public: req.body.public,
        proprio: req.body.proprio,
        users: req.body.users,
        items: req.body.items,
        date: req.body.date,
    })
    try {
        if (!user) throw new Error('post : une erreur est survenue')
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await Projet.findByIdAndUpdate(id, req.body)
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
        const removed = await Projet.findByIdAndDelete(id)
        if (!removed) throw Error('delete : Une erreur est survenue ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router