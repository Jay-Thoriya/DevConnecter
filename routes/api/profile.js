const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const {check , validationResult} = require("express-validator")
// @router  get api/profile/me
// @desc    get current users profile
// @access  private
router.get('/me', auth , async (req,res)=> {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name','avatar']
        );
        if(!profile){
            return res.status(400).json({ msg: 'there is no profile for this user '});
        }

        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send("server Error")
    }
});

// @router  Post api/profile
// @desc    create or update user profile
// @access  private

router.post('/',[auth , [ 
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty(),
]], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubUsername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    const profileFields = {}
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubUsername) profileFields.githubUsername = githubUsername;
    if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());


    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;

    try{
        let profile = await Profile.findOne({user: req.user.id});
        //console.log("profile ",profile);

        if(profile){
            // update
            profile = await Profile.findOneAndUpdate({ user: req.user.id} , { $set:profileFields} , { new: true});
            return res.json(profile);
        };

        //create
        profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});


// @router  get api/profile
// @desc    get all profile
// @access  public

router.get('/' , async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(err.message);
    res.status(500).send("server Error");
    }
})


// @router  get api/profile/user/:user_id
// @desc    get profile by user_id
// @access  public

router.get('/user/:user_id' , async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);

        if(!profile) return res.status(400).json({msg:"Profile not found"})
        res.json(profile );
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            
            return res.status(400).json({msg:"Profile not found"})
        }
    res.status(500).send("server Error");
    }
})


// @router  delete api/profile
// @desc    delete profile , user & posts
// @access  private

router.delete('/', auth , async (req,res) => {
    try {
        //@todo - remove    users posts

        //remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        //remove user
        await User.findOneAndRemove({_id: req.user.id});

        res.json( { msg:" User Deleted "});
    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            
            return res.status(400).json({msg:"Profile not found"})
        }
    res.status(500).send("server Error");
    }
});


// @router  pul api/profile/experience
// @desc    add profile experience
// @access  private

router.put('/experience',[ auth , [ 
    check("title","TItal is required ").not().isEmpty(),
    check("company","Company is required ").not().isEmpty(),
    check("from","From date is required ").not().isEmpty(),

]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.send(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server Error")
    }
});

module.exports = router;  