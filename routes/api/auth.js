const express = require("express");
const router = express.Router();
const auth =require("../../middleware/auth")
const User = require("../../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const config = require("config")
const { check , validationResult } = require("express-validator")
// @router  get api/auth
// @desc    test route
// @access  public 
router.get('/',auth,async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// @router  post api/auth
// @desc    authenticate user & get token 
// @access  public 
router.post('/',[
    check('email','Please include  a valid email').isEmail(),
    check('password','please is required ').exists()
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password} = req.body;
    try{
        // see if user exit or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ errors: [{ msg : " invalid Email "}]});
        }
        
        const isMatch = await bcrypt.compare(password , user.password);
        
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg : " invalid Password "}]});
        }
        // return jsonwebtoken
        
        const payload = {
            user:
            { id: user.id}
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:'5 days'},
            (err,token)=>{
                if(err) throw err;
                res.json({token});
            }
        );

    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router; 