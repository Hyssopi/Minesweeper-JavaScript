
import * as utilities from './utilities.js';

import {DEFAULT_TILE_IMAGE_DIRECTORY, TileState, Direction, Ids} from '../scripts/main.js';


/**
 * Get tile coordinates, can be invalid coordinate values.
 * 
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 * @param direction Modified direction of the input coordinate
 * @returns Tile coordinate object based on the direction, can be invalid coordinate values
 */
export function getTileCoordinate(x, y, direction = null)
{
  let modifiedX = x;
  let modifiedY = y;
  
  if (direction === Direction.TOP)
  {
    modifiedY = y - 1;
  }
  else if (direction === Direction.TOP_RIGHT)
  {
    modifiedY = y - 1;
    modifiedX = x + 1;
  }
  else if (direction === Direction.RIGHT)
  {
    modifiedX = x + 1;
  }
  else if (direction === Direction.BOTTOM_RIGHT)
  {
    modifiedY = y + 1;
    modifiedX = x + 1;
  }
  else if (direction === Direction.BOTTOM)
  {
    modifiedY = y + 1;
  }
  else if (direction === Direction.BOTTOM_LEFT)
  {
    modifiedY = y + 1;
    modifiedX = x - 1;
  }
  else if (direction === Direction.LEFT)
  {
    modifiedX = x - 1;
  }
  else if (direction === Direction.TOP_LEFT)
  {
    modifiedY = y - 1;
    modifiedX = x - 1;
  }

  return {x: modifiedX, y: modifiedY};
}

/**
 * Checks to see if input coordinate is valid for the mine field size.
 * 
 * @param width Width of the mine field in tiles
 * @param height Height of the mine field in tiles
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 * @param direction Modified direction of the input coordinate
 * @returns True if input coordinate is valid, false otherwise
 */
export function isValidTileCoordinate(width, height, x, y, direction = null)
{
  let modifiedCoordinate = getTileCoordinate(x, y, direction);

  let modifiedX = modifiedCoordinate.x;
  let modifiedY = modifiedCoordinate.y;

  return modifiedY >= 0 && modifiedY < height
    && modifiedX >= 0 && modifiedX < width;
}

/**
 * Create default tile image with all listeners setup.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 * @param tileWidthPixels Width of the tile image in pixels
 * @param tileHeightPixels Height of the tile image in pixels
 * @returns Default tile image with all listeners setup
 */
export function createDefaultTileImage(mineField, x, y, tileWidthPixels, tileHeightPixels)
{
  let tileImage = new Image(tileWidthPixels, tileHeightPixels);

  tileImage.addEventListener('mouseup',
    function(event)
    {
      if (event.button === 0)
      {
        // Left mouse click
        uncoverArea(mineField, x, y);
        uncoverTile(mineField, x, y);
      }
      if (event.button === 1)
      {
        // Middle mouse click
        uncoverArea(mineField, x, y);
      }
      
      //console.log(mineField);
      
      redrawMineField(mineField);
    }, false);
  
  tileImage.addEventListener('contextmenu',
    function(event)
    {
      // Right mouse click
      // Prevent context menu from showing
      event.preventDefault();

      toggleFlagTile(mineField, x, y);

      if (!mineField.gameOver)
      {
        updateStatusBarRemainingMines(mineField);
      }

      redrawMineField(mineField);
    }, false);
  
  // Prevent when user tries to drag an image
  tileImage.addEventListener('dragstart',
    function(event)
    {
      event.preventDefault();
    }, false);
  
  tileImage.src = DEFAULT_TILE_IMAGE_DIRECTORY + '/' + TileState.COVERED + '.png';

  return tileImage;
}

/**
 * Set the width, height, and mine count of the mine field object.
 * 
 * @param mineField Contains mine field data
 * @param width Width of the mine field in tiles
 * @param height Height of the mine field in tiles
 * @param mineCount Number of mines
 */
export function setMineField(mineField, width, height, mineCount)
{
  mineField.width = width;
  mineField.height = height;
  mineField.mineCount = mineCount;
}

/**
 * Checks to see if the grid is cleared (all non-mines are uncovered).
 * 
 * @param mineField Contains mine field data
 * @returns True if the grid is cleared (all non-mines are uncovered), false otherwise
 */
export function isGridCleared(mineField)
{
  for (let y = 0; y < mineField.height; y++)
  {
    for (let x = 0; x < mineField.width; x++)
    {
      if (mineField.grid[y][x].state === TileState.COVERED && !mineField.grid[y][x].isMine)
      {
        return false;
      }
    }
  }
  return true;
}

/**
 * Get the number of total flagged tiles in the mine field.
 * 
 * @param mineField Contains mine field data
 * @returns Number of total flagged tiles in the mine field
 */
export function getFlaggedCount(mineField)
{
  let flaggedCount = 0;
  for (let y = 0; y < mineField.height; y++)
  {
    for (let x = 0; x < mineField.width; x++)
    {
      if (mineField.grid[y][x].state === TileState.FLAGGED)
      {
        ++flaggedCount;
      }
    }
  }
  return flaggedCount;
}

/**
 * Compute the number of mines around the given tile coordinate, includes the given tile coordinate itself.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 * @returns Number of mines around the given tile coordinate, includes the given tile coordinate itself
 */
export function computeNumberOfMinesAround(mineField, x, y)
{
  let mineCount = 0;
  for (const enumDirectionProperty in Direction)
  {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty]))
    {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      if (mineField.grid[tileCoordinate.y][tileCoordinate.x].isMine)
      {
        ++mineCount;
      }
    }
  }
  return mineCount;
}

/**
 * Compute the number of flags around the given tile coordinate, includes the given tile coordinate itself.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 * @returns Number of flags around the given tile coordinate, includes the given tile coordinate itself
 */
export function computeNumberOfFlagsAround(mineField, x, y)
{
  let flagCount = 0;
  for (const enumDirectionProperty in Direction)
  {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty]))
    {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      if (mineField.grid[tileCoordinate.y][tileCoordinate.x].state === TileState.FLAGGED)
      {
        ++flagCount;
      }
    }
  }
  return flagCount;
}

/**
 * Update the Status Bar Mines Remaining.
 * 
 * @param mineField Contains mine field data
 */
export function updateStatusBarRemainingMines(mineField)
{
  let minesRemaining = mineField.mineCount - getFlaggedCount(mineField);
  minesRemaining = minesRemaining.toString().padStart(2, '0');

  document.getElementById(Ids.gameScreen.statusBar.minesRemainingLabel).innerHTML = `${minesRemaining} <img src="${DEFAULT_TILE_IMAGE_DIRECTORY}/${TileState.FLAGGED}.png" width="20" height="20">`;
}

/**
 * Reset the mine field data and draw the mine field UI.
 * 
 * @param mineField Contains mine field data
 */
export function resetAndRedrawMineField(mineField)
{
  resetMineField(mineField);

  updateStatusBarRemainingMines(mineField);

  drawMineField(mineField);
}

/**
 * Reset the mine field data.
 * 
 * @param mineField Contains mine field data
 */
function resetMineField(mineField)
{
  mineField.firstClick = false;
  mineField.gameOver = false;
  mineField.startTime = null;
  mineField.grid = [];

  for (let y = 0; y < mineField.height; y++)
  {
    mineField.grid.push([]);
    for (let x = 0; x < mineField.width; x++)
    {
      let tile =
      {
        state: TileState.COVERED,
        isMine: false,
        x: x,
        y: y,
        image: createDefaultTileImage(mineField, x, y, 40, 40)
      };
      mineField.grid[y].push(tile);
    }
  }
}

/**
 * Initialize and draw the mine field UI.
 * 
 * @param mineField Contains mine field data
 */
function drawMineField(mineField)
{
  let mineFieldDiv = document.getElementById(Ids.gameScreen.mineField);
  mineFieldDiv.innerHTML = '';

  for (let y = 0; y < mineField.height; y++)
  {
    let newDivRow = document.createElement('div');
    newDivRow.classList.add('flexBoxRow');
    for (let x = 0; x < mineField.width; x++)
    {
      // Draw the tile image based on the tile state
      mineField.grid[y][x].image.src = DEFAULT_TILE_IMAGE_DIRECTORY + '/' + mineField.grid[y][x].state + '.png';

      // Create a new div for the tile
      let newDiv = document.createElement('div');
      newDiv.appendChild(mineField.grid[y][x].image);

      newDiv.style.padding = '0px';
      newDiv.style.margin = '0px';
      newDiv.style.height = 40 + 'px';

      newDivRow.appendChild(newDiv);
    }
    mineFieldDiv.appendChild(newDivRow);
  }
}

/**
 * Redraw the mine field UI. The mine field UI should already be initialized.
 * 
 * @param mineField Contains mine field data
 */
export function redrawMineField(mineField)
{
  let mineFieldDiv = document.getElementById(Ids.gameScreen.mineField);
  for (let y = 0; y < mineField.height; y++)
  {
    let divRow = mineFieldDiv.childNodes[y];
    for (let x = 0; x < mineField.width; x++)
    {
      // Update the tile image based on the tile state
      divRow.childNodes[x].firstChild.src = DEFAULT_TILE_IMAGE_DIRECTORY + '/' + mineField.grid[y][x].state + '.png';
    }
  }
}

/**
 * Fill the mine field data with mines. Starting click position and its four cardinal (N, E, S, W) and four intercardinal (NE, SE, SW, NW) directions are guaranteed to not be filled with mines.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0), starting click position
 * @param y Vertical tile position, starting from the top (0), starting click position
 */
export function fillMines(mineField, x, y)
{
  let availableTilesToSetMine = [];
  for (let loopY = 0; loopY < mineField.height; loopY++)
  {
    for (let loopX = 0; loopX < mineField.width; loopX++)
    {
      availableTilesToSetMine.push(loopX + ',' + loopY);
    }
  }

  // Remove the starting click position and its four cardinal (N, E, S, W) and four intercardinal (NE, SE, SW, NW) directions from the list of possible mines to set
  for (const enumDirectionProperty in Direction)
  {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty]))
    {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      let value = tileCoordinate.x + ',' + tileCoordinate.y;
      let index = availableTilesToSetMine.indexOf(value);
      if (index >= 0)
      {
        availableTilesToSetMine.splice(index, 1);
      }
    }
  }

  // Randomly set the mines on the mine field
  for (let i = 0; i < mineField.mineCount; i++)
  {
    if (availableTilesToSetMine <= 0)
    {
      console.error('Cannot fill mines when availableTilesToSetMine is less than or equal to 0. Check that the mineCount is within the range of the width/height of the mine field.');
      break;
    }

    let randomNumber = utilities.generateRandomInteger(0, availableTilesToSetMine.length - 1);
    let tileToSetMineCoordinate = availableTilesToSetMine.splice(randomNumber, 1)[0];
    // Reformat it from "x,y" string to {x:a, y:b} object
    tileToSetMineCoordinate =
    {
      x: tileToSetMineCoordinate.split(',')[0],
      y: tileToSetMineCoordinate.split(',')[1],
    }
    mineField.grid[tileToSetMineCoordinate.y][tileToSetMineCoordinate.x].isMine = true;
  }
}

/**
 * Uncover tile of the given tile coordinate.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 */
export function uncoverTile(mineField, x, y)
{
  if (!mineField.firstClick)
  {
    fillMines(mineField, x, y);
    mineField.firstClick = true;
    mineField.startTime = new Date();
  }

  if (mineField.gameOver)
  {
    return;
  }

  if (mineField.grid[y][x].state != TileState.COVERED)
  {
    return;
  }

  if (mineField.grid[y][x].isMine && mineField.grid[y][x].state != TileState.FLAGGED)
  {
    gameOver(mineField);
    mineField.grid[y][x].state = TileState.HIT_MINE;
    return;
  }

  let numberOfMinesAround = computeNumberOfMinesAround(mineField, x, y);
  if (numberOfMinesAround === 0)
  {
    mineField.grid[y][x].state = TileState.BLANK;
    uncoverArea(mineField, x, y);
  }
  else if (numberOfMinesAround === 1)
  {
    mineField.grid[y][x].state = TileState.NUMBER1;
  }
  else if (numberOfMinesAround === 2)
  {
    mineField.grid[y][x].state = TileState.NUMBER2;
  }
  else if (numberOfMinesAround === 3)
  {
    mineField.grid[y][x].state = TileState.NUMBER3;
  }
  else if (numberOfMinesAround === 4)
  {
    mineField.grid[y][x].state = TileState.NUMBER4;
  }
  else if (numberOfMinesAround === 5)
  {
    mineField.grid[y][x].state = TileState.NUMBER5;
  }
  else if (numberOfMinesAround === 6)
  {
    mineField.grid[y][x].state = TileState.NUMBER6;
  }
  else if (numberOfMinesAround === 7)
  {
    mineField.grid[y][x].state = TileState.NUMBER7;
  }
  else if (numberOfMinesAround === 8)
  {
    mineField.grid[y][x].state = TileState.NUMBER8;
  }

  if (isGridCleared(mineField) && !mineField.gameOver)
  {
    console.log('Grid cleared. Game won.');
    gameOver(mineField);
  }
}

/**
 * Uncover area of the four cardinal (N, E, S, W) and four intercardinal (NE, SE, SW, NW) directions of the given tile coordinate.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 */
export function uncoverArea(mineField, x, y)
{
  if (mineField.grid[y][x].state === TileState.COVERED
    || mineField.grid[y][x].state === TileState.FLAGGED)
  {
    return;
  }

  let numberOfFlagsAround = computeNumberOfFlagsAround(mineField, x, y);
  
  for (const enumDirectionProperty in Direction)
  {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty]))
    {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);

      if (numberOfFlagsAround === computeNumberOfMinesAround(mineField, x, y))
      {
        uncoverTile(mineField, tileCoordinate.x, tileCoordinate.y);
      }
    }
  }
}

/**
 * Toggle flag tile.
 * 
 * @param mineField Contains mine field data
 * @param x Horizontal tile position, starting from the left (0)
 * @param y Vertical tile position, starting from the top (0)
 */
export function toggleFlagTile(mineField, x, y)
{
  if (mineField.gameOver)
  {
    return;
  }

  if (!mineField.firstClick)
  {
    return;
  }

  if (mineField.grid[y][x].state === TileState.FLAGGED)
  {
    mineField.grid[y][x].state = TileState.COVERED;
  }
  else if (mineField.grid[y][x].state === TileState.COVERED)
  {
    mineField.grid[y][x].state = TileState.FLAGGED;
  }
}

/**
 * Set the game over.
 * 
 * @param mineField Contains mine field data
 */
export function gameOver(mineField)
{
  // Update the timer
  let timeDifferenceInSeconds = (new Date() - mineField.startTime) / 1000;
  document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = timeDifferenceInSeconds.toFixed(2);

  mineField.gameOver = true;

  // Show the results
  let isGridClearedTemp = isGridCleared(mineField);
  for (let y = 0; y < mineField.height; y++)
  {
    for (let x = 0; x < mineField.width; x++)
    {
      if (isGridClearedTemp && mineField.grid[y][x].isMine)
      {
        mineField.grid[y][x].state = TileState.FLAGGED;
      }
      else if (mineField.grid[y][x].state === TileState.FLAGGED)
      {
        if (!mineField.grid[y][x].isMine)
        {
          mineField.grid[y][x].state = TileState.WRONG_MINE;
        }
      }
      else if (mineField.grid[y][x].isMine)
      {
        mineField.grid[y][x].state = TileState.MINE;
      }
    }
  }
}
