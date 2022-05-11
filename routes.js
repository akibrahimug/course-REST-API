const express = require('express');
const router = express.Router();
const {User, Course} = require('./models');
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
// Get a User 
router.get('/users', userAuthentication, asyncHandler(async(req,res) => {
    const user = req.currentUser;
    res.json({
        First_Name: user.firstName,
        Last_Name: user.lastName
    })
}))

// Routes for Courses

// Return Multiple courses
router.get('/courses', userAuthentication, asyncHandler(async(req, res) => {
    // Return all courses and Users associted with each course
    const courses = await Course.findAll();
    courses.map(course => {
        res.json({
            Title: course.title,
            Description: course.description
        })
    })
    // Handle errors (200)

}))
// Return single course
router.get('/courses/:id', asyncHandler(async(req,res) => {
    // Return one course with :id params as id
    await Course.findByPk(req.params.id)
    // Handle errors (200)
}))

// Create single course
router.post('/courses', asyncHandler(async(req,res) => {
    try{
        await Course.create(req.body)
        res.status(201).json({"Message": "User successfully created"});
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw error
        }
    }
}))

// Update a course on the database
router.put('/courses/:id', asyncHandler(async(req,res) => {
    // Update corresponding course
    // Handle errors (204)
}))

// Delete a course
router.delete('/courses/:id', asyncHandler(async(req, res) => {
    // Delete a course
    // Handle errors (204)
}))

module.exports = router;