const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to my server!");
});

// Listen on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
