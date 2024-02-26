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

router.use('/getMolFile', express.static(path.join(__dirname, '../public/molfiles')));
router.get('/getMolFile/:cid', async (req, res) => {
  try{
    const cid = req.params.cid;
    
    const filePath = path.join(__dirname, `../public/molfiles/${cid}.mol`)

    const fileContent = await fs.readFileSync(filePath, 'utf8');

    res.send(fileContent);
  } catch(error){
    console.log("Error:", error);
  }
})

module.exports = router;
