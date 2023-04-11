var express = require('express');
var router = express.Router();
var fs = require('fs'); 

router.get('/', function(req, res, next) {
  const lessons = './public/lessons/'

  res.render('lessonEditor', { title: 'Scene Viewer'});
});

//lessonList: fs.readdirSync(lessons) 


router.get('/:id', function(req , res){
  var lessonfiles = fs.readdirSync('./public/lessons/')

  if(lessonfiles.includes(req.params.id)){
    res.render('lessonEditor', {
      title: 'Scene Viewer', 
      item: req.params.id
    });
  }
  
  else{
    res.render('error', { title: 'ChemAR - Error', message: 'Lesson not found', error: {status: 404, stack: 'Lesson not found'}});
  }
});

router.post('/upload/images/', function(req , res){
  let image = req.body["image-contents"].replace(/^data:image\/png;base64,/, "");

  console.log(req.body["image-contents"]);

  const newImage = './public/images/' + req.body["image-name"];

  fs.writeFile(newImage, image, 'base64', function(err) {
    console.log(err);
  });
  
  res.status(200).json(
    {
      "status": "success",
      "message": "File uploaded successfully.",
      "file-src": newImage.replace('./public', '')
    }
  );

  res.send("hello");
  
});

/*
POST to <domain>/lessonEditor/save/<lessonName>
Header: Content-Type = application/json
Body example:
{
    "title": "Lesson 1",
    "description": "Introduction to Chemistry",
    "content": "This is the content of Lesson 2"
}
Response example:
{
    "successful": true,
    "overwritten": true,
    "path": "./public/lessons/lesson10.json"
}
*/
router.post('/save/:lesson', (req, res) => {
  
  // Get the lesson name from the params.
  const lessonName = req.params.lesson;
  const lessonPath = `./public/lessons/${lessonName}.json`; // Save the file path.
  var success = false;
  var overwritten = false;

  // Check if lesson doesn't exist.
  if (fs.existsSync(lessonPath))
    overwritten = true;

  // Write the file with template.
  fs.writeFile(lessonPath, JSON.stringify(req.body), (err) => {

    if (err) {
        success = false;
        console.log(err);
    }

  });

  success = true;

  res.status(200).send({
    successful: success,
    overwritten: overwritten,
    path: lessonPath
  })

});

module.exports = router;
