var express = require('express');
var router = express.Router();

/* GET models page. */
router.get('/', function(req, res, next) {
    // const models = './public/models1/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('models', { title: 'Model Catalog', isAdmin: isAdmin});
});

// router.get('/', function(req, res, next) {
//     const molfiles = './public/molfiles/';

//     //Admin check
//     let isAdmin = (req.signedCookies.admin == 'true');


//     let listItems =  fs.readdirSync(molfiles);
//     let molfileJSON = fs.readFileSync('./public/catalog/molfileCatalog.json', 'utf8');
//     let molfileObject = JSON.parse(molfileJSON);
    

//     let finalList = [];

//     for(let item of listItems){

//         molfileObject[item].file = item;
//         finalList.push(molfileObject[item])
//     }
//     console.log(finalList)

//     res.render('molecules', { title: 'Catalog', list: finalList, isAdmin: isAdmin});
// });

// router.get('/list', function(req, res) {
//     const models = './public/models1/';

//     //Admin check
//     let isAdmin = (req.signedCookies.admin == 'true');

//     res.status(200).send(fs.readdirSync(models));
// });

module.exports = router;
