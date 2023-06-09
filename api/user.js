const express = require("express");
const router = express.Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check , validationResult } = require("express-validator")
const gravatar = require("gravatar")
// @router  post api/user
// @desc    register user
// @access  public 
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please include  a valid email').isEmail(),
    check('password','please enter a password with 6 or more character').isLength({min:6})
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { name ,email , password} = req.body;
    try{
        // see if user exit or not
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ errors: [{ msg : " User already exists "}]});
        }
        
        // get users gravatar
        const avatar = gravatar.url(email,{
            s:"200",
            r:"pg",
            d:"mm"
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save()

        // return jsonwebtoken

        const payload = {
            user:
            { id: user.id}
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:36000},
            (err,Token)=>{
                if(err) throw err;
                res.json({Token});
            }
        );

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router; 