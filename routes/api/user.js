const express = require("express");
const router = express.Router();

// @router  get api/user
// @desc    test route
// @access  public 
console.log("user lodding...");
router.get('/',(req,res)=> res.send("User Route"));

module.exports = router; 