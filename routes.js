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
            throw err
        }
    }
}));
// Get a User 
router.get('/users', userAuthentication, asyncHandler(async(req,res) => {
    try{
        const user = req.currentUser;
        res.status(200).json({
            Message: `Welcome ${user.firstName} ${user.lastName}`
        })
    }catch(err){
        throw err
    }
}))

// Routes for Courses

// Return Multiple courses
router.get('/courses', asyncHandler(async(req, res) => {
    try{
    const courses = await Course.findAll({
        include: [{
            model: User,
            as: "User"
        }]
    });
    res.json({
        Courses: courses,
    })
    }catch(err){
        throw err
    }


}))
// Return single course
router.get('/courses/:id', asyncHandler(async(req,res) => {
    try{
        const course = await Course.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: User,
                as: "User"
            }]
        })
        if(course){
            res.status(200).json({
                Course: course
            })
        }else{
            res.status(404).json({"Message": "Sorry Course Not Found"})
        }
        // Handle other errors
    }catch(err){
        throw err
    }

}))

// Create single course
router.post('/courses', asyncHandler(async(req,res) => {
    try{
        await Course.create(req.body)
        res.status(201).json({"Message": "Course successfully created"});
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw err
        }
    }
}))

// Update a course on the database
router.put('/courses/:id', userAuthentication, asyncHandler(async(req,res) => {
    try{
        const user = req.currentUser
        const course = await Course.findByPk(req.params.id);
        if(course.userId === user.id){
            const updatedCourse = await course.update(req.body)
            res.status(204).json({
                UpdatedCourse: updatedCourse
            })
        }else{
            res.status(400).json({"Message": "You cannot Update  course you did not write"})
        }
        // Handle errors
    }catch(err){
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
            const errors = err.errors.map(er => er.message);
            res.status(400).json({errors})
        }else{
            throw err
        }
    }

}))

// Delete a course
router.delete('/courses/:id', userAuthentication, asyncHandler(async(req, res) => {
    // Delete a course
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if(course){
        if(course.userId === user.id){
            await course.destroy()
            res.status(201).json({"Message": "Course deleted successfully"})
        }else{
            res.status(400).json({"Message": "Cannot delete a course you didnt create"})
        }
    }else{
        res.status(404).json({"Message": "Course Not Found"})
    }

    // Handle errors (204)
}))

module.exports = router;