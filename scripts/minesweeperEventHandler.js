
import * as minesweeperUtilities from '../util/minesweeperUtilities.js';

import {TileState, DifficultySettings, Ids} from './main.js';

/**
 * Prevent non-numerical event response.
 * 
 * @param event Event
 */
function preventNonNumericalResponse(event)
{
  // Between 0 and 9
  if (event.which < 48 || event.which > 57)
  {
    event.preventDefault();
  }
}

/**
 * Setup mouse event listeners.
 */
export function setupMouseEventListeners()
{
  // Prevent auto-scrolling when middle clicked
  document.body.onmousedown = function(event)
  {
    if (event.button === 1)
    {
      return false;
    }
  }
}

/**
 * Setup keyboard event listeners.
 */
export function setupKeyboardEventListeners()
{
  // Prevent Ctrl + W from closing the window/tab
  window.onbeforeunload = function(event)
  {
    // TODO: Temporarily disable during development
    //event.preventDefault();
  };

  // Prevent non-numerical inputs for inputs
  document.getElementById(Ids.setupScreen.widthTextbox).addEventListener('keypress', preventNonNumericalResponse, false);
  document.getElementById(Ids.setupScreen.heightTextbox).addEventListener('keypress', preventNonNumericalResponse, false);
  document.getElementById(Ids.setupScreen.mineCountTextbox).addEventListener('keypress', preventNonNumericalResponse, false);
}

/**
 * Setup UI event listeners.
 * 
 * @param mineField Contains mine field data
 */
export function setupUIEventListeners(mineField)
{
  // Default to Expert Difficulty
  document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber = DifficultySettings.expert.width;
  document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber = DifficultySettings.expert.height;
  document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber = DifficultySettings.expert.mineCount;
  document.getElementById(Ids.setupScreen.widthTextbox).disabled = true;
  document.getElementById(Ids.setupScreen.heightTextbox).disabled = true;
  document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = true;
  document.getElementById(Ids.setupScreen.expertRadio).checked = true;

  document.getElementById(Ids.setupScreen.beginnerRadio).addEventListener('change',
    function()
    {
      document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber = DifficultySettings.beginner.width;
      document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber = DifficultySettings.beginner.height;
      document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber = DifficultySettings.beginner.mineCount;
      document.getElementById(Ids.setupScreen.widthTextbox).disabled = true;
      document.getElementById(Ids.setupScreen.heightTextbox).disabled = true;
      document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = true;
    });
  
  document.getElementById(Ids.setupScreen.intermediateRadio).addEventListener('change',
    function()
    {
      document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber = DifficultySettings.intermediate.width;
      document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber = DifficultySettings.intermediate.height;
      document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber = DifficultySettings.intermediate.mineCount;
      document.getElementById(Ids.setupScreen.widthTextbox).disabled = true;
      document.getElementById(Ids.setupScreen.heightTextbox).disabled = true;
      document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = true;
    });
  
  document.getElementById(Ids.setupScreen.expertRadio).addEventListener('change',
    function()
    {
      document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber = DifficultySettings.expert.width;
      document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber = DifficultySettings.expert.height;
      document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber = DifficultySettings.expert.mineCount;
      document.getElementById(Ids.setupScreen.widthTextbox).disabled = true;
      document.getElementById(Ids.setupScreen.heightTextbox).disabled = true;
      document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = true;
    });
  
  document.getElementById(Ids.setupScreen.customRadio).addEventListener('change',
    function()
    {
      document.getElementById(Ids.setupScreen.widthTextbox).disabled = false;
      document.getElementById(Ids.setupScreen.heightTextbox).disabled = false;
      document.getElementById(Ids.setupScreen.mineCountTextbox).disabled = false;
    });
  
  document.getElementById(Ids.setupScreen.startButton).addEventListener('click',
    function()
    {
      let width = document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber;
      let height = document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber;
      let mineCount = document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber;
      
      let difficultySelected = document.querySelector('input[name="difficulty"]:checked').value;

      document.getElementById(Ids.gameScreen.statusBar.infoLabel).innerHTML = `${difficultySelected}: ${width} <i class="fa fa-arrows-alt-h"></i> , ${height} <i class="fa fa-arrows-alt-v"></i> , ${mineCount} <img src="images/${TileState.MINE}.png" width="20" height="20">`;

      // TODO: Check that mineCount is within width/height

      document.getElementById(Ids.setupScreen.id).hidden = true;
      document.getElementById(Ids.gameScreen.id).hidden = false;
      
      minesweeperUtilities.setMineField(mineField, width, height, mineCount);
      minesweeperUtilities.resetAndRedrawMineField(mineField);

      // TODO: Reset UI
    });
  
  document.getElementById(Ids.gameScreen.statusBar.resetButton).addEventListener('click',
    function()
    {
      let width = document.getElementById(Ids.setupScreen.widthTextbox).valueAsNumber;
      let height = document.getElementById(Ids.setupScreen.heightTextbox).valueAsNumber;
      let mineCount = document.getElementById(Ids.setupScreen.mineCountTextbox).valueAsNumber;
      
      minesweeperUtilities.setMineField(mineField, width, height, mineCount);
      minesweeperUtilities.resetAndRedrawMineField(mineField);
      
      // TODO: Reset UI
    });
}
