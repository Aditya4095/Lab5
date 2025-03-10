const request = require('supertest');
const app = require('./server'); // Import your Express app

describe('Recipe Recommender API', () => {
  // Test case 1: Successful request with valid ingredients
  it('should return a list of recipes when valid ingredients are provided', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ ingredients: 'tomato,cheese' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeGreaterThan(0);
  });

  // Test case 2: Successful request with valid ingredients and diet preference
  it('should return a list of recipes when valid ingredients and diet preference are provided', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ ingredients: 'tomato,cheese', diet: 'vegetarian' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeGreaterThan(0);
  });

  // Test case 3: Missing ingredients parameter
  it('should return a 400 error when the ingredients parameter is missing', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ diet: 'vegetarian' }) // No ingredients provided
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Ingredients parameter is required');
  });

  // Test case 4: Invalid ingredients (empty string)
  it('should return a 400 error when the ingredients parameter is an empty string', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ ingredients: '', diet: 'vegetarian' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Ingredients parameter is required');
  });

  // Test case 5: No recipes found for the given ingredients
  it('should return an empty results array when no recipes are found', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ ingredients: 'invalidIngredient1,invalidIngredient2' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBe(0);
  });

  // Test case 6: Server error (e.g., Spoonacular API fails)
  it('should return a 500 error when the Spoonacular API fails', async () => {
    // Mock the Spoonacular API to simulate a failure
    jest.spyOn(require('axios'), 'get').mockRejectedValue(new Error('API failure'));

    const response = await request(app)
      .get('/recipes')
      .query({ ingredients: 'tomato,cheese' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Failed to fetch recipes');

    // Restore the original axios.get function
    jest.restoreAllMocks();
  });

  // Test case 7: Invalid diet preference
  it('should ignore invalid diet preferences and return recipes', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ ingredients: 'tomato,cheese', diet: 'invalidDiet' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('results');
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results.length).toBeGreaterThan(0);
  });
});