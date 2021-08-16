// const User = require('./user');
import User from './user';
console.log(User);

const getOne = (filter) => {
  return User.findOne(filter)
}

const add = ({ email, password, name, surname, avatarURL } ) => {
  const newUser = new User({ email, name, surname, avatarURL });
  newUser.setPassword(password);
  return newUser.save();
  
};

const getById = (id) => User.findById(id);

export default {
  getOne,
  add,
  getById,
}
// module.exports = {
//   getOne,
//   add,
//   getById,
// }