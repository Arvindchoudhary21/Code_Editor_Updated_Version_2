const express = require("express");
const app = express();
const bodyP = require("body-parser");
const compiler = require("compilex");
const options = { stats: true };
compiler.init(options);

app.use(bodyP.json());

app.post("/runcode", function (req, res) {
    var code = req.body.code;
    var input = req.body.Input;
    var lang = req.body.language; // Adjusted to match the expected field name in editor.js

    try {
        if (lang === "javascript") {
            var envData = { OS: "windows" }; // Modify environment data as needed
            if (input) {
                compiler.compileNodeWithInput(envData, code, input, handleResponse); // Assuming you want to execute JavaScript code on Node.js
            } else {
                compiler.compileNode(envData, code, handleResponse); // Assuming you want to execute JavaScript code on Node.js
            }
        } else if (lang === "python") {
            var envData = { OS: "windows" }; // Modify environment data as needed
            if (input) {
                compiler.compilePythonWithInput(envData, code, input, handleResponse);
            } else {
                compiler.compilePython(envData, code, handleResponse);
            }
        } else {
            throw new Error("Unsupported language");
        }
    } catch (e) {
        console.log("error:", e);
        res.status(400).send({ output: "Error: " + e.message });
    }

    function handleResponse(data) {
        if (data.output) {
            res.status(200).send(data);
        } else {
            res.status(400).send({ output: "Error: Execution failed" });
        }
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
