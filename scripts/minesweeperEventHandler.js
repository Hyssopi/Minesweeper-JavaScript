
import * as utilities from '../util/utilities.js';
import * as minesweeperUtilities from '../util/minesweeperUtilities.js';

import {DifficultySettings, Ids} from './main.js';


/**
 * Setup mouse event listeners.
 * 
 * @param tileMapEditorData Contains the data used by the editor
 */
/*
export function setupMouseEventListeners(tileMapEditorData)
{
  let canvas = tileMapEditorData.canvas;
  let context = canvas.getContext('2d');
  
  let lastX = canvas.width / 2;
  let lastY = canvas.height / 2;
  let dragStart;
  let dragged;
  
  let zoom = function(delta)
  {
    let point = context.transformedPoint(lastX, lastY);
    context.translate(point.x, point.y);
    let factor = Math.pow(SCALE_FACTOR, delta);
    context.scale(factor, factor);
    context.translate(-point.x, -point.y);
    
    tileMapEditorUtilities.redrawMap(tileMapEditorData);
  };
  
  let handleScroll = function(event)
  {
    let delta = event.wheelDelta ? event.wheelDelta / 40 : event.detail ? -event.detail : 0;
    if (delta)
    {
      zoom(delta);
    }
    return event.preventDefault() && false;
  };
  
  canvas.addEventListener('DOMMouseScroll', handleScroll, false);
  canvas.addEventListener('mousewheel', handleScroll, false);
  
  canvas.addEventListener('mousedown', function(event)
  {
    document.body.style.mozUserSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.userSelect = 'none';
    lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
    lastY = event.offsetY || (event.pageY - canvas.offsetTop);
    dragStart = context.transformedPoint(lastX, lastY);
    dragged = false;
  }, false);
  
  canvas.addEventListener('mousemove', function(event)
  {
    lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
    lastY = event.offsetY || (event.pageY - canvas.offsetTop);
    dragged = true;
    if (dragStart)
    {
      let point = context.transformedPoint(lastX, lastY);
      context.translate(point.x - dragStart.x, point.y - dragStart.y);
      
      tileMapEditorUtilities.redrawMap(tileMapEditorData);
    }
  }, false);
  
  canvas.addEventListener('mouseup', function(event)
  {
    dragStart = null;
  }, false);
  
  canvas.addEventListener('mouseout', function(event)
  {
    dragStart = null;
  }, false);
}
*/

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
