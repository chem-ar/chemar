var express = require('express');
var router = express.Router();
var fs = require('fs');
const { parse } = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('addScene', {title: 'Add New Scene'});
});

// Post request when clicking submit button
router.post('/', (req, res) => {
  // Assign values from form to variables
  var sceneName = req.body.name;
  var sceneDescription = req.body.description;
  var fileName = req.body.fileName;
  var sceneFileContent = req.body.preview;
  //const csid = fileName.substring(0, fileName.indexOf("."));

  var scenefiles = fs.readdirSync('./public/scenefiles/');
  var fileIsPresent = scenefiles.includes(fileName);

  // Check if the scene already exists
  if (fileIsPresent) {
      console.log('This scene already exists.');
  }
  else {
      // Create new scene file in ./public/scenefiles/
      fs.writeFile('./public/scenefiles/'+fileName, sceneFileContent, function (err) {
          if (err) throw err;
              console.log('New scene created');
      });

      // Read json file and add info to it
      var rawdata = fs.readFileSync('./public/catalog/sceneCatalog.json');
      var parsedData = JSON.parse(rawdata);

      parsedData[fileName] = {
            name: sceneName,
            description: sceneDescription          
      };

      var newScene = JSON.stringify(parsedData);
      fs.writeFileSync('./public/catalog/sceneCatalog.json', newScene);
  }    

  // Return to scene page
  res.redirect('/scenes');
});




module.exports = router;
