const User = require('./user');

const getOne = (filter) => {
    return User.findOne(filter)
};

const add = ({ email, password,name,surname,avatarURL }) => {
    const newUser = new User({ email,name,surname,avatarURL });
    newUser.setPassword(password);
    return newUser.save();
};

const getById = (id) => User.findById(id);


module.exports = {
  getOne,
  add,
  getById,
}