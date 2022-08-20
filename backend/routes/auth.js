const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')

const { json } = require('express');

const JWT_SECRET = "Harry programmer";

// Routes 1 : Create a user using:Post "/api/auth/createuser"

router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Enter a valid Password').isLength({ min: 5 }),

], async (req, res) => {

    let success=false;
    // If some error ouccure send bad request

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    // Trying to get and catch error 

    try {

        // Checking dublicate emails ,if there are error send bad request(400)
        // async func promise pending

        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return (res.status(400).json({success, error: "Sorry this user with this email already exist" }))
        }

        // Securing password bycrypt secure pass and salt add some other word before storing password password :(Huzaifa) is pass salt add somesome word before storing (Huzaifa43yi3) and bcrypt store pass(32563289gdjbfjksfsmxvckjlgflsdflsu6327) 
        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        // Creating a user database
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })


        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)

        success=true
        res.json({success, authtoken })
        // res.json(user)

    } catch (error) {
        console.log(error.message);
        res.status(500).send(success,"Internal server error ")
    }

    // .then(user => res.json(user))
    // .catch(err=>{console.log(err)
    // res.json({error:"Please enter a unique value"})});

});



// Routes 2 :  Authenticate  a User using:Post "/api/auth/Login"
router.post('/login', [
    // body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be Empty').exists(),

], async (req, res) => {
    let success=false;

    // If some error ouccure send bad request (400)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=true

            return res.status(400).json({ error: "Please try to login with correct credential" })
        }
        // bcrypt return True or false
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            success=false
            return res.status(400).json({ error: "Please try to login with correct credential" })
        }


        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success=true
        res.json({ success,authtoken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error ")
    }
});


// Routes 3 : Get Logged in  User Detail using:Post "/api/auth/getuser"

router.post('/getuser',fetchuser,  async (req, res) => {
    try {
            userId=req.user.id;
            const user=await User.findById(userId).select("-password")
            res.send(user)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error ")
    }
})



module.exports = router;
