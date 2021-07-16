const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const inscriptionRouter = require('./routes/api/inscriptionApi')
const connexionRouter = require('./routes/api/connexionApi')
const projetRouter = require('./routes/api/projetApi')
const projetInvitation = require('./routes/api/invitationApi')
require('dotenv').config()

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

mongoose
    .connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log('MongoDB database Connected...'))
    .catch((err) => console.log(err))

app.use(express.json())
app.use('/api/inscription', inscriptionRouter)
app.use('/api/connexion', connexionRouter)
app.use('/api/projet', projetRouter)
app.use('/api/invitation', projetInvitation)

app.listen(3000, () => console.log('Server Started at port '+process.env.DB_PORT))


