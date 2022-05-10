const express = require('express');
const router = express.Router();
const {User} = require('./models');
const { asyncHandler } = require('./middleWare/asyncHandler')
const { userAuthentication } =  require('./middleWare/userAuthentication')

// Routes for Authenticated Users
// Post a User
router.post('/users', asyncHandler(async(req,res) => {
    try{
        await User.create(req.body)
        res.status(201).json({"Message": "User successfully created"});
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw error
        }
    }
}));
// Get
router.get('/users', userAuthentication, asyncHandler(async(req,res) => {
    const user = req.currentUser;

    res.json({
        email: user.emailAddress,
        password: user.password
    })
}))

// Routes for Courses

module.exports = router;