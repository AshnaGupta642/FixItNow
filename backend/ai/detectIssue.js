const { spawn } = require("child_process");
const path = require("path");

function detectIssue(imagePath) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "detectIssue.py");

        const py = spawn("python", [scriptPath, imagePath]);

        let output = "";
        let errorOutput = "";

        py.stdout.on("data", (data) => {
            output += data.toString();
        });

        py.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        py.on("close", () => {
            if (errorOutput) console.warn("Python stderr:", errorOutput);
            resolve(output.trim()); // clean prediction
        });

        py.on("error", (err) => reject(err));
    });
}

module.exports = detectIssue;
