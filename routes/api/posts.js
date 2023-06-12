const express = require("express");
const router = express.Router();
const {check , validationResult} = require("express-validator")
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const Post = require("../../models/Post")

// @router  post api/post
// @desc    create a post
// @access  private
router.post('/',[auth , [ check('text','text is required').not().isEmpty()]], async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){ 
        return res.status(400).json({ errors: errors.array()});
    }

    try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar:user.avatar,
        user: req.user.id
    });
    const post = await newPost.save();
    res.json(post);    
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
});


// @router  get api/post
// @desc    get all post
// @access  private

router.get('/',auth,async(req,res) =>{
    try{
        const posts = await Post.find().sort({Date:-1})
        res.json(posts);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});


// @router  get api/post/:id
// @desc    get post by id
// @access  private

router.get('/:id',auth,async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json("Post not found")
        }   
        res.json(post);
    }catch(err){
        console.error(err.message);
        if(err.kind=== 'ObjectId'){
            return res.status(404).json("Post not found")
        }
        res.status(500).send("Server Error")
    }
})


// @router  delete api/post/{id}
// @desc    delete post
// @access  private

router.delete('/:id',auth,async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"Post not found"}) 
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: "user not authorize"}); 
        }
        await post.deleteOne();

        res.json({msg:"post removed"})
    }catch(err){
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg:"Post not found"})
        }
        res.status(500).send("Server Error")
    }
});


module.exports = router; 