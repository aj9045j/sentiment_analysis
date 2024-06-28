const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Specify the filename
    }
});

// Configure multer with file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only CSV files are allowed')); // Reject the file
        }
    }
}).single('file');

async function electionPred(req, res) {
    console.log("Backend hit");
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("Multer error:", err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).send('File size exceeds the limit of 100MB.');
            }
            return res.status(400).send(err.message);
        } else if (err) {
            console.log("General error:", err);
            return res.status(500).send('An error occurred while uploading the file.');
        }

        const filePath = req.file.path;
        console.log("File uploaded successfully:", filePath);

        // Determine the Python executable
        const pythonExecutables = ['python3', 'python', 'python3.9', 'python3.8'];
        let pythonExecutable = null;

        for (const exec of pythonExecutables) {
            try {
                require('child_process').execSync(`${exec} --version`, { stdio: 'ignore' });
                pythonExecutable = exec;
                break;
            } catch (e) {
                // Do nothing, try the next executable
            }
        }

        if (!pythonExecutable) {
            return res.status(500).send('Python executable not found');
        }

        // Call the Python script
        const pythonProcess = spawn(pythonExecutable, [path.join(__dirname, '..', 'modelsProgram/electionCsv.py'), filePath]);

        let data = '';

        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stdout.on('end', () => {
            console.log("Raw data from Python script:", data);  // Log raw data for debugging
            try {
                const predictions = JSON.parse(data);
                res.json(predictions);
            } catch (error) {
                console.error("Error parsing prediction result:", error);  // Log the parsing error
                res.status(500).send('Error parsing prediction result');
            }
        });

        let errorOccurred = false;

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            errorOccurred = true;
        });

        pythonProcess.on('error', (error) => {
            console.error(`error: ${error.message}`);
            errorOccurred = true;
        });

        pythonProcess.on('close', (code) => {
            if (!res.headersSent) {
                if (errorOccurred || code !== 0) {
                    res.status(500).send('Error occurred while making prediction');
                }
            }
        });
    });
}

module.exports = {
    electionPred,
};
