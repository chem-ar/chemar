var express = require('express');
var router = express.Router();
var fs = require('fs');

//get the script files from the jmol directory

router.get('/', function(req, res, next) {
  res.render('jmol', { title: 'Jmol' });
});

router.get('/:id', function(req , res){
    var scriptFiles = fs.readdirSync(`./public/jsmol-16.1.41/`);

    if(scriptFiles.includes(req.params.id + ".js")){
      res.render('jmol', {
        title: 'Jmol', 
        item: req.params.id
      });
    }
        
        else{
        res.render('error', { title: 'ChemAR - Error', message: 'Script not found', error: {status: 404, stack: 'Script not found'}});
        }
        
}
);

module.exports = router;