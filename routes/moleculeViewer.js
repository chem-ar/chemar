var express = require('express');
var router = express.Router();
var fs = require('fs'); 
var path = require('path');

router.get('/', function(req, res, next) {
  res.render('moleculeViewer', { title: 'Molecule Viewer', item: 2519 });
});

router.get('/:id', function(req , res){
  var molfiles = fs.readdirSync('./public/molfiles/')
  console.log(JSON.stringify(req.headers['user-agent']))

  if(molfiles.includes(req.params.id + '.mol')){    
    res.render('moleculeViewer', {
      title: 'Molecule Viewer', 
      item: req.params.id
    });
  }

  //If the file does not exist, render the viewer page with the id 2519 as a fallback
  else{
    res.render('moleculeViewer', {
      title: 'Molecule Viewer', 
      item: 2519
    });  
  }
});


router.get('/getMolFile/:cid', async (req, res) => {
  try {
    const cid = 702;
    const filePath = path.join(__dirname, `public/molfiles/${cid}`);
    console.log(filePath)
    const molData = await fs.promises.readFile(filePath, 'utf-8')
    console.log(molData)
    
    res.status(200).send(molData);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Internal Server Error');
  }
});
  

module.exports = router;
