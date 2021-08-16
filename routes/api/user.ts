const express = require('express');
const router = express.Router();
const multer = require("multer");
const jimp = require('jimp')
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();
// const User = require('../../model');
import User from '../../model';
const moment = require('moment');
// const { schemaSignupValidate } = require('../../utils/validate/schemas/Schema');
import { schemaSignupValidate } from '../../utils/validate/schemas/Schema';


const uploadDir = `${process.cwd()}/avatars`

const tempDir = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, tempDir);
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 1000000
    }
})
const uploadMiddleware = multer({
    storage
});


router.get('/:userId', async (req, res, next) => {
    const id = req.params.userId;
    try {
        const user = await User.getById(id)
        if (!user) {
            return res.status(404).json({
                Status: '404 error',
                'Content-Type': 'application / json',
                ResponseBody:'Not found'
            })
        }
        return res.status(200).json({
            Status: '200 success',
            'Content-Type': 'application / json',
            ResponseBody: {
                id:user.id,
                email: user.email,
                name: user.name,
                surname: user.surname,
                avatarURL:user.avatarURL
            }
        })
        
    } catch (error) {
        next(error)
    }
})

router.post('/signup', uploadMiddleware.single('avatar'), async (req, res, next) => {
    const { email, password, name, surname } = req.body
    const { path: tempName, originalname } = req.file;
    
    const now = moment().format("YYYY-MM-DD_hh-mm-ss");
    const fileName = `${now}_${originalname}`;
    const avatarURL = `${req.headers.host}/avatars/${fileName}`
    const fullFileName = path.join(uploadDir, fileName);
    
    try {
        const { error } = schemaSignupValidate.validate({ email, password, name, surname } );
       
        if (error) {
            return res.status(400).json({
                Status: '400 Bad Request',
                'Content-Type': 'application / json',
                ResponseBody: 'Ошибка от Joi или другой библиотеки валидации'
            })
        }
        const result = await User.getOne({ email } )
        if (result) {
            return res.status(409).json({
                Status: '409 conflict',
                'Content-Type': 'application / json',
                'ResponseBody': {
                    "message": "Email in use"
                }
            })
        }
        await fs.rename(tempName, fullFileName);
        jimp.read(fullFileName)
            .then(img => {
                return img.cover(200, 200, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
                    .writeAsync(fullFileName)
            })
            .catch(error => {
                console.log(error);
            });
        
        const newUser = await User.add({ email, password, name, surname, avatarURL } );

        res.status(201).json({
            Status: '201 Created',
            'Content-Type': 'application / json',
            'ResponseBody': {
                "user": {
                    "id": newUser._id,
                }
            }
        })

    } catch (error) {
        await fs.unlink(tempName);
    }
})


export default router;

// module.exports = router;
