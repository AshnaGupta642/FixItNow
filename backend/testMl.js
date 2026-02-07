const path = require("path");
const detectIssue = require(path.join(__dirname, "ai", "detectIssue"));

async function test() {
    const imagePath = path.join(__dirname, "ai", "data", "test", "1.jpeg");
    try {
        const type = await detectIssue(imagePath);
        console.log("Predicted type:", type);
    } catch (err) {
        console.error("Error:", err);
    }
}

test();
