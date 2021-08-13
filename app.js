const express = require('express')
const logger = require('morgan')
const cors = require('cors')

require("dotenv").config();
const userRouter = require('./routes/api/user');
const authenticate = require('./middlewares/authenticate')
const User = require('./model');

const app = express()

require('./configs/passport-config');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/users', userRouter);

const uploadDir = `${__dirname}/routes/api/avatars`;
app.use('/avatars', express.static(uploadDir));



app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})


module.exports =  app
    
