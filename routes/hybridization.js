var express = require('express');
var router = express.Router();
var fs = require('fs'); 


router.get('/', function(req, res, next) {
  
  //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');
  
    res.render('hybridization', {title: 'Hybridization', isAdmin: isAdmin});
      
    });
  
    
module.exports = router;
