
const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

// Flask backend URL
const FLASK_URL = "http://127.0.0.1:5000";

// Parse JSON requests
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// API route
app.post("/api/search", async (req, res) => {

    try {

        const { name, city } = req.body;

        if (!name || !city) {
            return res.status(400).json({
                error: "Please enter your name and city"
            });
        }

        // Send request to Flask backend
        const flaskResponse = await fetch(
            `${FLASK_URL}/api/population?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}`
        );

        const data = await flaskResponse.json();

        res.status(flaskResponse.status).json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to connect to Flask backend"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on port ${PORT}`);
});
