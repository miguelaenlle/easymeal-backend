const express = require("express");
const recipeController = require("../controllers/recipes-controller");


const router = express.Router();


router.get("/", recipeController.getRecipes)

router.get("/:recipeId", recipeController.getRecipe)

router.post("/", recipeController.addRecipe)

module.exports = router;