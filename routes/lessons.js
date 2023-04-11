var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    const lessons = './public/lessons/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.render('lessons', { title: 'Catalog', list: fs.readdirSync(lessons), isAdmin: isAdmin});
});

// Post to name that already exists, update file.
// If post to name that doesn't exist, make new file.

// This endpoint is where you can update lessons.
// Example put '/lessons/add/exampleLesson'
router.put('/addLesson', (req, res) => {

    // Grab info from the request.
    const lessonName = req.params.lesson;
    const lessonPath = `./public/lessons/${lessonName}.json`;

    // Check if lesson doesn't exist.
    if (!fs.existsSync(lessonPath)) {

        // Basic template for lesson file if file doesn't exist.
        const lessonTemplate = { name: lessonName };

        // Write the file with template.
        fs.writeFile(lessonPath, JSON.stringify(lessonTemplate), (err) => {
            
            if (err) {
                // Send err in response if it fails.
                res.status(500).send(err);
            } else {
                res.send("Lesson added successfully.");
            }
        });

    }
});

router.get('/list', function(req, res) {
    const lessons = './public/lessons/';

    //Admin check
    let isAdmin = (req.signedCookies.admin == 'true');

    res.status(200).send(fs.readdirSync(lessons));
});

module.exports = router;
