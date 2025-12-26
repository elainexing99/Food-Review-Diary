const express = require("express");
const app = express();


app.post("/addEntry", (req, res) => {
    return res.send("entry added");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})