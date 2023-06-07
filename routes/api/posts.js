const express = require("express");
const router = express.Router();

// @router  get api/post
// @desc    test route
// @access  public 
router.get('/',(req,res)=> res.send("posts Route"));

module.exports = router; 