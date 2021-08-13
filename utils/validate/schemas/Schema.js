const Joi = require("joi");

const schemaSignupValidate = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(8).required()
})

module.exports = {
   schemaSignupValidate
}