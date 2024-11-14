const searchBtn = document.getElementById('search-btn');
const mealSearch = document.getElementById('search-input');
const mealResults = document.getElementById('meal-results');

searchBtn.addEventListener('click', fetchMeals);

function fetchMeals() {
    const searchTerm = mealSearch.value.trim();
    if (!searchTerm) {
        mealResults.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }
    
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                mealResults.innerHTML = '<p>No meals found. Try a different search!</p>';
            }
        })
        .catch(error => {
            mealResults.innerHTML = `<p>Error fetching meals: ${error.message}</p>`;
            console.error('Error fetching meals:', error);
        });
}

function displayMeals(meals) {
    const mealsHTML = meals.map(meal => `
        <div class="meal-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button onclick="fetchMealDetails(${meal.idMeal})">View Recipe</button>
        </div>
    `).join('');
    mealResults.innerHTML = mealsHTML;
}

function fetchMealDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const meal = data.meals[0];
            const detailsHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strInstructions}</p>
            `;
            mealResults.innerHTML = detailsHTML;
        })
        .catch(error => {
            mealResults.innerHTML = `<p>Error fetching meal details: ${error.message}</p>`;
            console.error('Error fetching meal details:', error);
        });
}
