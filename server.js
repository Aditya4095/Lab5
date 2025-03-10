const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_KEY = "4a08f9b36c9548e38950fd9e46b0c8ef";

// Recipe search endpoint
app.get("/recipes", async (req, res) => {
    try {
        const { ingredients, diet } = req.query;
        if (!ingredients) {
            return res.status(400).json({ error: "Ingredients parameter is required" });
        }

        const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
            params: {
                apiKey: API_KEY,
                includeIngredients: ingredients,
                diet: diet || "",
                number: 5
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: "Failed to fetch recipes" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; 
