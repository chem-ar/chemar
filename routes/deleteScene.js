var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');

// DELETE request to delete a scene file
router.delete('/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    console.log("Received DELETE request for file: " + fileName);
    const filePath = path.join(__dirname, '../public/scenefiles', fileName);
    console.log("File path: " + filePath);

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting the scene file:', err);
                res.status(500).json({ error: 'Error deleting the scene file' });
            } else {
                console.log('Scene file deleted:', fileName);

                // Remove the corresponding entry from sceneCatalog.json
                const catalogFilePath = path.join(__dirname, '../public/catalog/sceneCatalog.json');
                const rawdata = fs.readFileSync(catalogFilePath);
                const parsedData = JSON.parse(rawdata);

                if (parsedData[fileName]) {
                    delete parsedData[fileName];

                    const newSceneCatalog = JSON.stringify(parsedData);
                    fs.writeFileSync(catalogFilePath, newSceneCatalog);
                    console.log('Scene removed from sceneCatalog.json');
                }

                res.status(204).end(); // Send a "No Content" response
            }
        });
    } else {
        console.error('Scene file not found:', fileName);
        res.status(404).json({ error: 'Scene file not found' });
    }

    // Return to scene page
    res.redirect('/scenes');
});

module.exports = router;
