
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

import javafx.scene.image.Image;

public class MineField
{
	private int width, height, numberOfMines;
	private boolean firstClick, isGameOver;
	private long startTime;
	private Tile[][] grid;
	
	public MineField(int width, int height, int numberOfMines)
	{
		newGame(width, height, numberOfMines);
	}
	
	public void newGame(int width, int height, int numberOfMines)
	{
		this.width = width;
		this.height = height;
		this.numberOfMines = numberOfMines;
		firstClick = isGameOver = false;
		grid = new Tile[height][width];
		for(int y = 0; y < height; y++)
		{
			for(int x = 0; x < width; x++)
				grid[y][x] = new Tile();
		}
	}
	
	public void newGame()
	{
		firstClick = isGameOver = false;
		for(int y = 0; y < height; y++)
		{
			for(int x = 0; x < width; x++)
			{
				grid[y][x].setState(TileState.COVERED);
				grid[y][x].setMine(false);
			}
		}
	}
	
	public void fillMines(int x, int y)
	{
		List<Integer> indexes = new ArrayList<Integer>();
		for(int i = 0; i < width*height; i++)
			indexes.add(i);
		
		try{indexes.remove((y+1)*width+(x+1));}catch(IndexOutOfBoundsException e){}
		try{indexes.remove((y+1)*width+(x));}catch(IndexOutOfBoundsException e){}
		try{indexes.remove((y+1)*width+(x-1));}catch(IndexOutOfBoundsException e){}
		try{indexes.remove((y)*width+(x+1));}catch(IndexOutOfBoundsException e){}
		indexes.remove((y)*width+(x));
		try{indexes.remove((y)*width+(x-1));}catch(IndexOutOfBoundsException e){}
		try{indexes.remove((y-1)*width+(x+1));}catch(IndexOutOfBoundsException e){}
		try{indexes.remove((y-1)*width+(x));}catch(IndexOutOfBoundsException e){}
		try{indexes.remove((y-1)*width+(x-1));}catch(IndexOutOfBoundsException e){}
		
		for(int i = 0; i < numberOfMines; i++)
		{
			int randomNumber = new Random().nextInt(indexes.size()-1 + 1 - 0) + 0;
			int index = indexes.remove(randomNumber);
			grid[index/width][index%width].setMine(true);	
		}
	}
	
	public int computeNumberOfMinesAround(int x, int y)
	{
		int mineCount = 0;
		try{mineCount = grid[y-1][x-1].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{mineCount = grid[y-1][x].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{mineCount = grid[y-1][x+1].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{mineCount = grid[y][x-1].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		mineCount = grid[y][x].isMine() ? mineCount+1 : mineCount;
		try{mineCount = grid[y][x+1].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{mineCount = grid[y+1][x-1].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{mineCount = grid[y+1][x].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{mineCount = grid[y+1][x+1].isMine() ? mineCount+1 : mineCount;}catch(ArrayIndexOutOfBoundsException e){}
		return mineCount;
	}
	
	public void uncoverTile(int x, int y)
	{
		if(!firstClick)
		{
			fillMines(x,y);
			firstClick = true;
			startTime = System.currentTimeMillis();
		}
		
		if(isGameOver)
			return;
		if(grid[y][x].getState()!=TileState.COVERED || grid[y][x].getState()==TileState.FLAGGED)
			return;
		if(grid[y][x].isMine() && grid[y][x].getState()!=TileState.FLAGGED)
		{
			//System.out.println("Clicked on mine, GAME OVER");
			gameOver();
			grid[y][x].setState(TileState.HITMINE);
			return;
		}
		
		int numberOfMinesAround = computeNumberOfMinesAround(x,y);
		if(numberOfMinesAround > 0)
		{
			switch(numberOfMinesAround)
			{
				case 1: grid[y][x].setState(TileState.NUMBER1); break;
				case 2: grid[y][x].setState(TileState.NUMBER2); break;
				case 3: grid[y][x].setState(TileState.NUMBER3); break;
				case 4: grid[y][x].setState(TileState.NUMBER4); break;
				case 5: grid[y][x].setState(TileState.NUMBER5); break;
				case 6: grid[y][x].setState(TileState.NUMBER6); break;
				case 7: grid[y][x].setState(TileState.NUMBER7); break;
				case 8: grid[y][x].setState(TileState.NUMBER8); break;
			}
		}
		else if(numberOfMinesAround == 0)
		{
			grid[y][x].setState(TileState.BLANK);
			uncoverArea(x,y);
		}
		
		if(isGridCleared() && !isGameOver)
		{
			long endTime = System.currentTimeMillis();
			recordTime(startTime, endTime);
			//System.out.println("Game cleared, GAME WON");
			gameOver();
		}
	}
	
	public void uncoverArea(int x, int y)
	{
		if(grid[y][x].getState() == TileState.COVERED)
			return;
		
		int flaggedAroundCount = 0;
		try{flaggedAroundCount = grid[y-1][x-1].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y-1][x].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y-1][x+1].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y][x-1].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y][x+1].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y+1][x-1].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y+1][x].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		try{flaggedAroundCount = grid[y+1][x+1].getState()==TileState.FLAGGED ? flaggedAroundCount+1 : flaggedAroundCount;}catch(ArrayIndexOutOfBoundsException e){}
		
		if(flaggedAroundCount == computeNumberOfMinesAround(x,y))
		{
			try{uncoverTile(x-1,y-1);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x,y-1);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x+1,y-1);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x-1,y);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x+1,y);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x-1,y+1);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x,y+1);}catch(ArrayIndexOutOfBoundsException e){}
			try{uncoverTile(x+1,y+1);}catch(ArrayIndexOutOfBoundsException e){}
		}
	}
	
	public void toggleFlagTile(int x, int y)
	{
		if(isGameOver)
			return;
		if(grid[y][x].getState() != TileState.COVERED && grid[y][x].getState() != TileState.FLAGGED)
			return;
		
		if(grid[y][x].getState() == TileState.FLAGGED)
			grid[y][x].setState(TileState.COVERED);
		else
			grid[y][x].setState(TileState.FLAGGED);
	}
	
	public boolean isGridCleared()
	{
		for(int y = 0; y < height; y++)
		{
			for(int x = 0; x < width; x++)
			{
				if(grid[y][x].getState()==TileState.COVERED && !grid[y][x].isMine())
					return false;
			}
		}
		return true;
	}
	
	public int computeRemainingMines()
	{
		int flaggedCount = 0;
		for(int y = 0; y < height; y++)
		{
			for(int x = 0; x < width; x++)
			{
				if(grid[y][x].getState() == TileState.FLAGGED)
					++flaggedCount;
			}
		}
		return numberOfMines - flaggedCount;
	}
	
	public void gameOver()
	{
		isGameOver = true;
		for(int y = 0; y < height; y++)
		{
			for(int x = 0; x < width; x++)
			{
				if(isGridCleared() && grid[y][x].isMine())
				{
					grid[y][x].setState(TileState.FLAGGED);
					continue;
				}
				if(grid[y][x].getState() == TileState.FLAGGED)
				{
					if(!grid[y][x].isMine())
						grid[y][x].setState(TileState.WRONGMINE);
					continue;
				}
				if(grid[y][x].isMine())
					grid[y][x].setState(TileState.MINE);
			}
		}
	}
	
	public TileState getTileState(int x, int y)
	{
		return grid[y][x].getState();
	}
	
	public void adjustTileImageSize(double paneWidth, double paneHeight)
	{
		if(width <= 30 && height <= 16)
			Tile.tileImageSize = (int)(paneWidth/30);
		else if(width > height)
			Tile.tileImageSize = (int)(paneWidth/width);
		else
			Tile.tileImageSize = (int)(0.9*paneHeight/height);
		
		Tile.COVERED_IMAGE = new Image(Tile.imageDirectory + "covered.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.FLAGGED_IMAGE = new Image(Tile.imageDirectory + "flagged.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.MINE_IMAGE = new Image(Tile.imageDirectory + "mine.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.HIT_MINE_IMAGE = new Image(Tile.imageDirectory + "hitmine.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.WRONG_MINE_IMAGE = new Image(Tile.imageDirectory + "wrongmine.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.BLANK_IMAGE = new Image(Tile.imageDirectory + "blank.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_1_IMAGE = new Image(Tile.imageDirectory + "number1.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_2_IMAGE = new Image(Tile.imageDirectory + "number2.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_3_IMAGE = new Image(Tile.imageDirectory + "number3.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_4_IMAGE = new Image(Tile.imageDirectory + "number4.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_5_IMAGE = new Image(Tile.imageDirectory + "number5.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_6_IMAGE = new Image(Tile.imageDirectory + "number6.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_7_IMAGE = new Image(Tile.imageDirectory + "number7.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
		Tile.NUMBER_8_IMAGE = new Image(Tile.imageDirectory + "number8.png", Tile.tileImageSize, Tile.tileImageSize, true, true);
	}
	
	public void recordTime(long startTime, long endTime)
	{
		String delimiter = " ";
		String folderPath = "bestTimes" + System.getProperty("file.separator");
		String filename = width + "_" + height + "_" + numberOfMines + ".log";
		String newEntry = startTime + delimiter + endTime;
		List<String> lines = new ArrayList<String>();
		try
		{
			new File(folderPath).mkdir();
			
			if(!(new File(folderPath+filename).exists()))
			{
				PrintWriter writer = new PrintWriter(folderPath+filename);
				writer.println(newEntry);
				writer.close();
				return;
			}
			
			Scanner inFile = new Scanner(new FileReader(folderPath+filename));
			while(inFile.hasNextLine())
				lines.add(inFile.nextLine());
			inFile.close();
			
			if(lines.size() < 10)
				lines.add(newEntry);
			else if((endTime-startTime) < (Long.parseLong(lines.get(lines.size()-1).split(delimiter)[1]) - Long.parseLong(lines.get(lines.size()-1).split(delimiter)[0])))
				lines.set(lines.size()-1, newEntry);
			
			for(int i = lines.size()-1; i > 0; i--)
			{
				long startTime1 = Long.parseLong(lines.get(i).split(delimiter)[0]);
				long endTime1 = Long.parseLong(lines.get(i).split(delimiter)[1]);
				long startTime2 = Long.parseLong(lines.get(i-1).split(delimiter)[0]);
				long endTime2 = Long.parseLong(lines.get(i-1).split(delimiter)[1]);
				if((endTime1-startTime1) < (endTime2-startTime2))
				{
					String t = lines.get(i);
					lines.set(i, lines.get(i-1));
					lines.set(i-1, t);
				}
			}
			
			PrintWriter outFile = new PrintWriter(folderPath+filename);
			int index = 0;
			while(index < lines.size())
			{
				outFile.println(lines.get(index));
				++index;
			}
			outFile.close();
		}
		catch(NumberFormatException e){System.err.println("NumberFormatException: " + e.getMessage());}
		catch(ArrayIndexOutOfBoundsException e){System.err.println("ArrayIndexOutOfBoundsException: " + e.getMessage());}
		catch(IOException e){System.err.println("IOException: " + e.getMessage());}
	}
	
	
	
	
	public void printGrid()
	{
		System.out.println("   0 1 2 3 4 5 6 7 8 9");
		System.out.println("   -------------------");
		for(int y = 0; y < height; y++)
		{
			System.out.print(y + "| ");
			for(int x = 0; x < width; x++)
			{
				if(grid[y][x].isMine())
					System.out.print("X ");
				else
					System.out.print(computeNumberOfMinesAround(x,y) + " ");
			}
			System.out.println("");
		}
		System.out.println("");
	}
	
	
	public int getWidth(){return width;}
	public int getHeight(){return height;}
	public int getNumberOfMines(){return numberOfMines;}
	public boolean getFirstClick(){return firstClick;}
	public boolean isGameOver(){return isGameOver;}
	public long getStartTime(){return startTime;}
}