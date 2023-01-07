const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    header: String,
    link: String,
    imageUrl: String,
    stars: Number,
    totalTime: String,
    calories: Number,
    nutrients: [{
        qt: Number,
        unit: String,
        label: String
    }],
    ingredients: [String],
    weightLossScore: Number,
    fatLossScore: Number,
    muscleGainScore: Number
})

module.exports = mongoose.model("Recipe", recipeSchema);