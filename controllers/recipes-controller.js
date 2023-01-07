const Recipe = require('../models/recipe');

const getRecipes = async (request, response) => {
    // input via headers
    // ingredients
    // list of available ingredients
    // fitness goals
    // weight loss, fat loss, muscle gain
    // calories (optional)
    // minCalories
    // maxCalories
    const recipes = await Recipe.find();

    const {
        ingredients,
        fitnessGoal,
        minCalories,
        maxCalories
    } = request.query;

    let results = [];

    // weight loss

    let scoreCol;

    if (fitnessGoal === "weightLoss") {
        scoreCol = "weightLossScore";
    } else if (fitnessGoal === "fatLoss") {
        scoreCol = "fatLossScore";
    } else if (fitnessGoal === "muscleGain") {
        scoreCol = "muscleGainScore";
    } else {
        return response.status(400).json({
            message: "Fitness goal is required"
        })
    }

    // tag results with an ingredient counts

    const ingredientList = ingredients.split(",");

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeIngredients = recipe.ingredients;
        let totalIngredients = recipeIngredients.length;
        let ingredientCount = 0;
        for (let j = 0; j < recipeIngredients.length; j++) {
            const ingredient = recipeIngredients[j];
            for (let k = 0; k < ingredientList.length; k++) {
                if (ingredient.toLowerCase().trim().includes(ingredientList[k].toLowerCase().trim())) {
                    ingredientCount++;
                    break
                }
            }
        }

        results.push({
            recipe,
            ingredientCount,
            totalIngredients,
            pctAvailable: ingredientCount / totalIngredients,
            score: recipe[scoreCol]
        })
    }

    // normalize pctAvailable and score into a 0-1 range

    let maxPctAvailable = 0;
    let minPctAvailable = 0;

    let maxScore = 0;
    let minScore = 0;


    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.pctAvailable > maxPctAvailable) {
            maxPctAvailable = result.pctAvailable;
        }

        if (result.pctAvailable < minPctAvailable) {
            minPctAvailable = result.pctAvailable;
        }

        if (result.score > maxScore) {
            maxScore = result.score;
        }

        if (result.score < minScore) {
            minScore = result.score;
        }
    }

    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        results[i]['normPctAvailable'] = (result.pctAvailable - minPctAvailable) / (maxPctAvailable - minPctAvailable);
        results[i]['scoreAvailable'] = (result.score - minScore) / (maxScore - minScore);
        results[i]['aggScore'] = (results[i]['normPctAvailable'] + results[i]['scoreAvailable']) / 2;
    }

    // sort by aggScore

    results = results.filter((result) => {
        return (result["aggScore"])
    })

    results = results.sort((a, b) => {
        if (a.aggScore > b.aggScore) {
            return -1;
        } else if (a.aggScore < b.aggScore) {
            return 1;
        } else {
            return 0;
        }
    })

    return response.status(200).json({
        results
    })





}


const getRecipe = async (request, response) => {
    const recipeId = request.params.recipeId;
    try {
        const recipe = await Recipe.findById(recipeId);
        response.status(200).json({ recipe });
    } catch (error) {
        response.status(404).json({
            message: error.message
        })
    }

}

const addRecipe = async (request, response) => {

    console.log(request.body);

    const {
        header,
        link,
        imageUrl,
        stars,
        calories,
        totalTime,
        nutrients,
        ingredients,
        weightLossScore,
        fatLossScore,
        muscleGainScore
    } = request.body;

    if (!header || !link) {
        return response.status(400).json({
            message: "Header and link are required"
        })
    }

    const recipe = new Recipe({
        header,
        link,
        imageUrl,
        stars,
        calories,
        totalTime,
        nutrients,
        ingredients,
        weightLossScore,
        fatLossScore,
        muscleGainScore
    });

    try {
        const newRecipe = await recipe.save();
        response.status(201).json({ newRecipe, id: newRecipe._id });
    } catch (error) {
        response.status(400).json({
            message: error.message
        })
    }
}

module.exports = {
    getRecipes,
    getRecipe,
    addRecipe
}