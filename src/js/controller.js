import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    //Upadte result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //updating bookmarks view
    bookmarkView.update(model.state.bookmarks);

    //Rendering spinner before loading
    recipeView.renderSpinner();

    //Loading receipe
    await model.loadRecipe(id);

    //Rendering receipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //rensering the spinner
    resultsView.renderSpinner();

    //Load search results
    await model.loadSearchResults(query);

    //Render results
    resultsView.render(model.getSearchResultsPage());

    //Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render new pagination butons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings
  model.updateServings(newServings);

  //update view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe =async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner()

    //upload the new recipe data
   await model.uploadRecipe(newRecipe);
   console.log(model.state.recipe)

   //render recipe
   recipeView.render(model.state.recipe)

   //sucess message
   addRecipeView.renderMessage()
   

   //render bookmark view
    bookmarkView.render(model.state.bookmarks)

    //change id in url
    window.history.pushState(null,'',`#${model.state.recipe.id}`)

   //close form
   setTimeout(function(){
    addRecipeView.toggleWindow()
   },MODAL_CLOSE_SEC*1000)
  } catch(err) {
    addRecipeView.renderError(err.message)
  }
};


const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
 
};
init();
