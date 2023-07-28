const express = require("express");
const app = express();
// Middleware to parse JSON requests
app.use(express.json()); // This middleware enables parsing of incoming JSON payloads.


app.listen(3001, () => {
    console.log('server is running at http://localhost:3001/')
});

app.get("/", async (request, response) => {
    response.send("Hello CCBPians!");
});