const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const compiler = require("compilex");

const options = { stats: true };
compiler.init(options);

app.use(bodyParser.json());

app.post('/runcode', function (req, res) {
    const code = req.body.code;
    const input = req.body.input;
    const lang = req.body.lang;
    console.log(code);

    try {
        if (lang === "python") {
            const envData = { OS: "windows" };
            if (input) {
                compiler.compilePythonWithInput(envData, code, input, handleResponse);
            } else {
                compiler.compilePython(envData, code, handleResponse);
            }
        } else {
            res.status(400).json({ error: "Unsupported language" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

    function handleResponse(data) {
        if (data.output) {
            res.json({ output: data.output });
        } else {
            res.status(500).json({ error: "Compilation or execution error" });
        }
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
