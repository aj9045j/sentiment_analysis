const path = require('path');
const { spawn } = require('child_process');


async function twitterpred(req, res) {
    console.log("Backend hit");

    const { text } = req.body;
    console.log(text); // Assuming the text is sent in the request body

    if (!text) {
        return res.status(400).send('Text data is required');
    }

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
    const pythonProcess = spawn(pythonExecutable, [path.join(__dirname, '..', 'modelsProgram/twitter.py'), text]);

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
}

module.exports = {
    twitterpred,
};
