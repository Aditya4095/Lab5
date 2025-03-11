async function fetchRecipes() {
    const ingredients = document.getElementById("ingredients").value.trim();
    const diet = document.getElementById("diet").value;
    const resultsDiv = document.getElementById("results");
  
    if (!ingredients) {
      resultsDiv.innerHTML = "<p>Please enter some ingredients.</p>";
      return;
    }
  
    resultsDiv.innerHTML = "<p>Loading...</p>";
  
    try {
      const response = await fetch(`/.netlify/functions/fetchRecipes?ingredients=${encodeURIComponent(ingredients)}&diet=${diet}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        resultsDiv.innerHTML = data.results.map(recipe =>
          `<div class="recipe-item">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" width="200">
          </div>`
        ).join("");
      } else {
        resultsDiv.innerHTML = "<p>No recipes found.</p>";
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      resultsDiv.innerHTML = "<p>Failed to fetch recipes. Please try again later.</p>";
    }
  }