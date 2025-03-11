const axios = require("axios");

exports.handler = async (event, context) => {
  const { ingredients, diet } = event.queryStringParameters;
  const API_KEY = "4a08f9b36c9548e38950fd9e46b0c8ef"; // Ensure this is set in Netlify's environment variables

  try {
    if (!ingredients) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingredients parameter is required" }),
      };
    }

    const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {
      params: {
        apiKey: API_KEY,
        includeIngredients: ingredients,
        diet: diet || "",
        number: 5,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipes" }),
    };
  }
};