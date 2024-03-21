var express = require('express');
var router = express.Router();

/* GET models page. */
router.get('/', function(req, res, next) {
<<<<<<< HEAD
=======
    const modelfiles = './public/modelfiles/';

>>>>>>> 3ee41719567f108f48dd56aaebcbd07cedf10709
    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('models', { title: 'Model Catalog', isAdmin: isAdmin});
});

module.exports = router;
