var express = require('express');
var router = express.Router();
var { checkSession } = require('./auth/session-mgmt')
const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');
const multer = require('multer');
const unzipper = require('unzipper');
var {checkPassword} = require('./checkPassword')

function emailExists(email){
    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    let exists = false

    adminData.map((ele, i) => {
        if(ele.email == email){
            exists = true
        }
    })
    
    return exists
}

router.get('/', async function (req, res, next) {
    let {isAdmin, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }

    if (!isOwner) return res.redirect("/");
    res.render('allAdmins', { title: 'allAdmin', isOwner, isAdmin })
})

router.get('/alladminsearch', async function (req, res, next) {
    let {isAdmin, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isOwner) return res.status(401).json({error: 'Please log in as owner of the page'})

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    return res.send(adminData)
})

router.delete('/delete', async function (req, res, next) {
    let {isAdmin, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isOwner) return res.status(401).json({error: 'Please log in as owner of the page'})

    let email = req.body.email;

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))
    let adminDeleteIndex = -1;
    adminData.map((ele, i) => {
        if(ele.email == email){
            adminDeleteIndex = i
        }
    })

    if(adminDeleteIndex === -1){
        return res.status(400).json({error: 'Email does not exists'})
    }

    const thisAdminSession = adminData[adminDeleteIndex].session.find(
        session => session.token === req.cookies.session
    );
    if (thisAdminSession !== undefined) {
        return res.status(400).json({
            error: 'You cannot delete your own account'
        });
    }
    adminData.splice(adminDeleteIndex, 1)

    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData))

    return res.status(200).send({message: 'deleted success'})
})

// adding admins
router.post('/addadmin', async function (req, res, next) 
{
    let {isAdmin, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isOwner) return res.status(401).json({error: 'Please log in as owner of the page'})

    let data = { ...req.body }
    if(!checkPassword(data.password)){
        console.log("Incorrect Password");
        return res.status(401).json({error: "Not a strong password"})
    }
    if(emailExists(data.email, res)){
        return res.status(400).json({error: 'Email already exists'})
    }

    let hashPassword = await bcrypt.hash(data.password, 5)

    let newAdmin = {
        session: [],
        email: data.email,
        password: hashPassword,
        owner: data.adminType
    }

    let adminData = JSON.parse(fs.readFileSync("./routes/auth/admin.json"))

    adminData.push(newAdmin)

    fs.writeFileSync("./routes/auth/admin.json", JSON.stringify(adminData))

    return res.status(200).send({message: 'add success'})
})

const BACKUP_DATES_PATH = path.resolve(__dirname, '../public/backupDates.json');

// Ensure backupDates.json exists, or initialize with an empty array if it doesn't
function ensureBackupDatesFile() {
    if (!fs.existsSync(BACKUP_DATES_PATH)) {
        fs.writeFileSync(BACKUP_DATES_PATH, JSON.stringify([]), 'utf8');
    }
}


router.get('/download-backup', async (req, res, next) => {
    let {isAdmin, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isOwner) return res.status(401).json({error: 'Please log in as owner of the page'})

    // Generate the filename with the format YYYY-MM-DD-CHEMAR-BACKUP.zip
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const filename = `${formattedDate}-CHEMAR-BACKUP.zip`;
    const outputPath = path.resolve(__dirname, `../${filename}`);

    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
        // Check and create backupDates.json if necessary
        ensureBackupDatesFile(); 

        let backupDates = JSON.parse(fs.readFileSync(BACKUP_DATES_PATH, 'utf8'));
        backupDates.push(formattedDate);
        fs.writeFileSync(BACKUP_DATES_PATH, JSON.stringify(backupDates, null, 2));

        res.download(outputPath, filename, (err) => {
            if (err) {
                console.error('Download failed:', err);
                res.status(500).send({ error: 'Failed to download the file' });
            } else {
                fs.unlinkSync(outputPath);
            }
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    const directories = [
        path.resolve(__dirname, '../public/catalog'),
        path.resolve(__dirname, '../public/modelfiles'),
        path.resolve(__dirname, '../public/molfiles'),
        path.resolve(__dirname, '../public/scenes')
    ];

    directories.forEach((dir) => {
        archive.directory(dir, path.basename(dir));
    });

    await archive.finalize();
});

// Route to get the last backup date
router.get('/last-backup', (req, res) => {
    // Ensure backupDates.json exists
    ensureBackupDatesFile(); 

    const backupDates = JSON.parse(fs.readFileSync(BACKUP_DATES_PATH, 'utf8'));

    if (backupDates.length > 0) {
        const lastBackupDate = backupDates[backupDates.length - 1];
        res.json({ lastBackupDate });
    } else {
        res.json({ lastBackupDate: null });
    }
});

// Temporary upload directory
const upload = multer({ dest: 'uploads/' });
// structure to check against when zip files get uploaded
const REQUIRED_DIRECTORIES = [
    'catalog/',
    'modelfiles/',
    'molfiles/',
    'scenes/'
];

router.post('/upload-backup', upload.single('backupZip'), async (req, res) => {
    let {isAdmin, isOwner} = checkSession(req, res);
    let userRole = res.locals.userRole;
    if(userRole === 'admin'){
        isAdmin = true;
        isOwner = true;
    }
    if (!isOwner) return res.status(401).json({error: 'Please log in as owner of the page'})

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const zipPath = path.resolve(req.file.path);
    const extractPath = path.resolve(__dirname, '../public');

    try {
        // Validate the structure of the uploaded ZIP file
        const directoryContents = [];
        const zip = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }));

        for await (const entry of zip) {
            // Collect each entry path
            directoryContents.push(entry.path); 
            entry.autodrain(); 
        }

        // Check if all required directories exist in the uploaded ZIP file
        const isValidStructure = REQUIRED_DIRECTORIES.every((requiredDir) =>
            directoryContents.some((path) => path.startsWith(requiredDir))
        );

        if (!isValidStructure) {
            // Delete the uploaded file
            await fs.remove(zipPath); 
            return res.status(400).json({
                error: 'Invalid backup structure. Please upload a ZIP with the correct directory structure.'
            });
        }

        // Extract and overwrite files in the respective folders
        fs.createReadStream(zipPath)
            .pipe(unzipper.Extract({ path: extractPath }))
            .on('close', async () => {
                // Clean up the uploaded ZIP file
                await fs.remove(zipPath); 
                res.status(200).json({ message: 'Backup restored successfully' });
            })
            .on('error', async (error) => {
                // Clean up on error
                await fs.remove(zipPath); 
                console.error('Extraction error:', error);
                res.status(500).json({ error: 'Failed to extract the backup' });
            });
    } catch (error) {
        console.error('Upload processing error:', error);
        res.status(500).json({ error: 'An error occurred while processing the backup' });
    }
});



module.exports = router;