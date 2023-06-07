const express = require("express");
const router = express.Router();

// @router  get api/auth
// @desc    test route
// @access  public 
router.get('/',(req,res)=> res.send("auth Route"));

module.exports = router; 