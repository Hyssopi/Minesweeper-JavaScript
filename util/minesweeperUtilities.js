
import * as utilities from './utilities.js';

import {TileState, Direction, DifficultySettings, Ids} from '../scripts/main.js';





export function createDefaultTileImage(mineField, x, y)
{
  let tileImage = new Image(40, 40);

  tileImage.addEventListener('mouseup',
    function(event)
    {
      if (event.button === 0)
      {
        // Left mouse click
        uncoverArea(mineField, x, y);
        uncoverTile(mineField, x, y);

        console.log(mineField);
      }
      if (event.button === 1)
      {
        // Middle mouse click
        uncoverArea(mineField, x, y);
      }
      
      redrawMineField(mineField);

      if (mineField.gameOver)
      {
        // Stop timer
      }
    }, false);
  
  tileImage.addEventListener('contextmenu',
    function(event)
    {
      // Right mouse click
      // Prevent context menu from showing
      event.preventDefault();

      toggleFlagTile(mineField, x, y);

      // TODO: Update flag count label on UI
      //Ids.gameScreen.statusBar.flagCountLabel

      redrawMineField(mineField);
    }, false);
  
  // Prevent when user tries to drag an image
  tileImage.addEventListener('dragstart',
    function(event)
    {
      event.preventDefault();
    }, false);
  
  tileImage.src = 'images/covered.png';

  return tileImage;
}

export function setMineField(mineField, width, height, mineCount)
{
  mineField.width = width;
  mineField.height = height;
  mineField.mineCount = mineCount;
}

export function resetAndRedrawMineField(mineField)
{
  resetMineField(mineField);

  // Initialize the mine field UI
  drawMineField(mineField);
}

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
        image: createDefaultTileImage(mineField, x, y)
      };
      mineField.grid[y].push(tile);
    }
  }

  // TODO: Move this to a UI specific function?
  document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = "0.00";
}


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
      // Update the tile image based on the tile state
      mineField.grid[y][x].image.src = 'images/' + mineField.grid[y][x].state + '.png';

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

export function redrawMineField(mineField)
{
  let mineFieldDiv = document.getElementById(Ids.gameScreen.mineField);
  for (let y = 0; y < mineField.height; y++)
  {
    let divRow = mineFieldDiv.childNodes[y];
    for (let x = 0; x < mineField.width; x++)
    {
      // Update the tile image based on the tile state
      divRow.childNodes[x].firstChild.src = 'images/' + mineField.grid[y][x].state + '.png';
    }
  }
}

// x and y are starting points
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

  for (let i = 0; i < mineField.mineCount; i++)
  {
    let randomNumber = utilities.generateRandomInteger(0, availableTilesToSetMine.length - 1);
    let tileToSetMineCoordinate = availableTilesToSetMine.splice(randomNumber, 1)[0];
    tileToSetMineCoordinate =
    {
      x: tileToSetMineCoordinate.split(',')[0],
      y: tileToSetMineCoordinate.split(',')[1],
    }
    mineField.grid[tileToSetMineCoordinate.y][tileToSetMineCoordinate.x].isMine = true;
  }
}

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
    redrawMineField(mineField);
    return;
  }

  let numberOfMinesAround = computeNumberOfMinesAround(mineField, x, y);
  if (numberOfMinesAround > 0)
  {
    if (numberOfMinesAround == 1)
    {
      mineField.grid[y][x].state = TileState.NUMBER1;
    }
    else if (numberOfMinesAround == 2)
    {
      mineField.grid[y][x].state = TileState.NUMBER2;
    }
    else if (numberOfMinesAround == 3)
    {
      mineField.grid[y][x].state = TileState.NUMBER3;
    }
    else if (numberOfMinesAround == 4)
    {
      mineField.grid[y][x].state = TileState.NUMBER4;
    }
    else if (numberOfMinesAround == 5)
    {
      mineField.grid[y][x].state = TileState.NUMBER5;
    }
    else if (numberOfMinesAround == 6)
    {
      mineField.grid[y][x].state = TileState.NUMBER6;
    }
    else if (numberOfMinesAround == 7)
    {
      mineField.grid[y][x].state = TileState.NUMBER7;
    }
    else if (numberOfMinesAround == 8)
    {
      mineField.grid[y][x].state = TileState.NUMBER8;
    }
  }
  else if (numberOfMinesAround == 0)
  {
    mineField.grid[y][x].state = TileState.BLANK;
    uncoverArea(mineField, x, y);
  }

  if (isGridCleared(mineField) && !mineField.gameOver)
  {
    console.log('Game cleared, GAME WON');

    gameOver(mineField);
  }
}

export function uncoverArea(mineField, x, y)
{
  if (mineField.grid[y][x].state == TileState.COVERED
    || mineField.grid[y][x].state == TileState.FLAGGED)
  {
    return;
  }

  let numberOfFlagsAround = 0;
  for (const enumDirectionProperty in Direction)
  {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty]))
    {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);
      if (mineField.grid[tileCoordinate.y][tileCoordinate.x].state == TileState.FLAGGED)
      {
        ++numberOfFlagsAround;
      }
    }
  }
  
  for (const enumDirectionProperty in Direction)
  {
    if (isValidTileCoordinate(mineField.width, mineField.height, x, y, Direction[enumDirectionProperty]))
    {
      let tileCoordinate = getTileCoordinate(x, y, Direction[enumDirectionProperty]);

      if (numberOfFlagsAround == computeNumberOfMinesAround(mineField, x, y))
      {
        uncoverTile(mineField, tileCoordinate.x, tileCoordinate.y);
      }
    }
  }
}

export function toggleFlagTile(mineField, x, y)
{
  if (mineField.gameOver)
  {
    return;
  }

  if (mineField.grid[y][x].state == TileState.FLAGGED)
  {
    mineField.grid[y][x].state = TileState.COVERED;
  }
  else if (mineField.grid[y][x].state == TileState.COVERED)
  {
    mineField.grid[y][x].state = TileState.FLAGGED;
  }
}

export function isGridCleared(mineField)
{
  for (let y = 0; y < mineField.height; y++)
  {
    for (let x = 0; x < mineField.width; x++)
    {
      if (mineField.grid[y][x].state == TileState.COVERED
        && !mineField.grid[y][x].isMine)
      {
        return false;
      }
    }
  }
  return true;
}

export function computeRemainingMines()
{
  //
}

export function gameOver(mineField)
{
  // TODO: End timer
  let timeDifferenceInSeconds = (new Date() - mineField.startTime) / 1000;
  document.getElementById(Ids.gameScreen.statusBar.timerLabel).innerHTML = timeDifferenceInSeconds.toFixed(2);

  mineField.gameOver = true;
  for (let y = 0; y < mineField.height; y++)
  {
    for (let x = 0; x < mineField.width; x++)
    {
      if (isGridCleared(mineField) && mineField.grid[y][x].isMine)
      {
        mineField.grid[y][x].state = TileState.FLAGGED;
        continue;
      }
      if (mineField.grid[y][x].state == TileState.FLAGGED)
      {
        if (!mineField.grid[y][x].isMine)
        {
          mineField.grid[y][x].state = TileState.WRONG_MINE;
        }
        continue;
      }
      if (mineField.grid[y][x].isMine)
      {
        mineField.grid[y][x].state = TileState.MINE;
      }
    }
  }
}


export function updateStatusBarRemainingMines()
{
  //numberOfMinesLeft.setText("Mines: " + field.computeRemainingMines() + "/" + field.getNumberOfMines());
  document.getElementById(Ids.gameScreen.statusBar.flagCountLabel).innerHTML = '';
}
































// Can be invalid
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
 * @param width Width of the mine field
 * @param height Height of the mine field
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
 * Print debug information to console.
 * 
 * @param tileMapEditorData Contains the data used by the editor
 */
export function printDebug(tileMapEditorData)
{
  let tileLookup = tileMapEditorData.tileLookup;
  let layeredTileHashesDisplay = tileMapEditorData.layeredTileHashesDisplay;
  let cursor = tileMapEditorData.cursor;
  let userActionHistory = tileMapEditorData.userActionHistory;
  
  console.log('\n\n');
  console.log('%c*****START DEBUG PRINT*****', 'background: black; color: white;');
  
  console.info('layeredTileHashesDisplay:');
  console.table(layeredTileHashesDisplay);
  
  console.info('mapWidth: ' + tileMapEditorData.mapWidth + '\n');
  console.info('mapHeight: ' + tileMapEditorData.mapHeight + '\n');
  
  console.info('cursor:');
  console.log(cursor);
  console.log('\n');
  
  console.info('layeredTileHashesDisplay.map[' + cursor.tileY + '][' + cursor.tileX + ']:');
  console.log(layeredTileHashesDisplay.map[cursor.tileY][cursor.tileX]);
  console.log('\n');
  
  console.info('getTileNeighborSum(...): ' + getTileNeighborSum(tileLookup, layeredTileHashesDisplay.map[cursor.tileY][cursor.tileX]) + '\n');
  
  console.info('userActionHistory:');
  console.log(userActionHistory);
  console.log('\n');
  
  console.log('%c*****END DEBUG PRINT*****', 'background: black; color: white;');
  console.log('\n\n');
}
