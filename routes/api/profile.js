const express = require("express");
const router = express.Router();

// @router  get api/profile
// @desc    test route
// @access  public 
router.get('/',(req,res)=> res.send("profile Route"));

module.exports = router; 