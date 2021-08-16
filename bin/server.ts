const app = require('../app');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config()

const { DB_HOST } = process.env;
const PORT = process.env.PORT || 3000

mongoose.connect(DB_HOST, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
}).then(() => app.listen(PORT, () => {
    console.log('Database connection successful')
})).catch((error)=> {
    console.log(error);
    return process.exit(1)
})
