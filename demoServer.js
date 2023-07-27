const express = require("express");
const app = express();
app.use(express.json());

app.listen(3001, () => {
    console.log('server is running at http://localhost:3001/')
});

app.get("/", async (request, response) => {
    response.send("Hello CCBPians!");
});