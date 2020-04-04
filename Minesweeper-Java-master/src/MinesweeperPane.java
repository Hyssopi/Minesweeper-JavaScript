
import java.awt.GraphicsEnvironment;

import javafx.animation.AnimationTimer;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.control.Tooltip;
import javafx.scene.input.MouseButton;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class MinesweeperPane extends VBox
{
	public final static int SCREEN_WIDTH = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice().getDisplayMode().getWidth();
	public final static int SCREEN_HEIGHT = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice().getDisplayMode().getHeight();
	private HBox toolBar;
	private TextField widthField, heightField, numberOfMinesField;
	private Button newGameButton, bestTimesButton;
	private Label time, numberOfMinesLeft;
	private AnimationTimer timer;
	private Canvas canvas;
	private MineField field;
	private Tooltip widthTooltip, heightTooltip, numberOfMinesTooltip;
	private int minWidth, minHeight, minNumberOfMines, maxWidth, maxHeight;
	
	public MinesweeperPane()
	{
		toolBar = new HBox();
		widthField = new TextField("8");
		heightField = new TextField("8");
		numberOfMinesField = new TextField("10");
		newGameButton = new Button("New Game");
		bestTimesButton = new Button("View Best Times");
		time = new Label("0");
		timer = new AnimationTimer()
		{
			@Override
			public void handle(long l)
			{
				time.setText((System.currentTimeMillis()-field.getStartTime())/1000+"");
			}
		};
		canvas = new Canvas(Tile.COVERED_IMAGE.getWidth()*8, Tile.COVERED_IMAGE.getHeight()*8);
		field = new MineField(8, 8, 10);
		minWidth = 4;
		minHeight = 4;
		minNumberOfMines = 1;
		maxWidth = 99;
		maxHeight = 99;
		widthTooltip = new Tooltip(minWidth + " <= Width <= " + maxWidth);
		heightTooltip = new Tooltip(minHeight + " <= Height <= " + maxHeight);
		numberOfMinesTooltip = new Tooltip(minNumberOfMines + " <= #Mines <= Width*Height-9");
		numberOfMinesLeft = new Label("Mines: " + field.computeRemainingMines() + "/" + field.getNumberOfMines());
		drawMineField(field, canvas);
		
		toolBar.getChildren().addAll(bestTimesButton, widthField, heightField, numberOfMinesField, newGameButton, numberOfMinesLeft, time);
		this.getChildren().addAll(toolBar, canvas);
		
		toolBar.setId("MinesweeperPane-toolBar");
		widthField.setId("MinesweeperPane-widthField");
		widthField.setPromptText("W");
		widthField.setTooltip(widthTooltip);
		heightField.setId("MinesweeperPane-heightField");
		heightField.setPromptText("H");
		heightField.setTooltip(heightTooltip);
		numberOfMinesField.setId("MinesweeperPane-numberOfMinesField");
		numberOfMinesField.setPromptText("#M");
		numberOfMinesField.setTooltip(numberOfMinesTooltip);
		newGameButton.setId("MinesweeperPane-newGameButton");
		bestTimesButton.setId("MinesweeperPane-bestTimesButton");
		time.setId("MinesweeperPane-time");
		numberOfMinesLeft.setId("MinesweeperPane-numberOfMinesLeft");
		widthTooltip.setId("MinesweeperPane-widthTooltip");
		heightTooltip.setId("MinesweeperPane-heightTooltip");
		numberOfMinesTooltip.setId("MinesweeperPane-numberOfMinesTooltip");
		this.setId("MinesweeperPane");
		
		
		canvas.addEventHandler(MouseEvent.MOUSE_CLICKED, new EventHandler<MouseEvent>()
		{
			@Override
			public void handle(MouseEvent e)
			{
				int x = (int)(e.getX()/Tile.COVERED_IMAGE.getWidth());
				int y = (int)(e.getY()/Tile.COVERED_IMAGE.getHeight());
				
				if(e.getButton() == MouseButton.PRIMARY)
				{
					try
					{
						timer.start();
						field.uncoverArea(x,y);
						field.uncoverTile(x,y);
						
						/*
						//SpeedSweeper
						for(int i = 0; i < field.getHeight(); i++)
						{
							for(int j = 0; j < field.getWidth(); j++)
							{
								field.uncoverArea(j,i);
							}
						}
						*/
						
					}
					catch(IndexOutOfBoundsException exception){}
				}
				else if(e.getButton() == MouseButton.MIDDLE)
				{
					try
					{
						field.uncoverArea(x,y);
					}
					catch(IndexOutOfBoundsException exception){}
				}
				e.consume();
				drawMineField(field, canvas);
				if(field.isGameOver())
					timer.stop();
			}
		});
		
		canvas.addEventHandler(MouseEvent.MOUSE_PRESSED, new EventHandler<MouseEvent>()
		{
			@Override
			public void handle(MouseEvent e)
			{
				int x = (int)(e.getX()/Tile.COVERED_IMAGE.getWidth());
				int y = (int)(e.getY()/Tile.COVERED_IMAGE.getHeight());
				
				if(e.getButton() == MouseButton.SECONDARY)
				{
					try
					{
						field.toggleFlagTile(x,y);
						
						/*
						//SpeedSweeper
						for(int i = 0; i < field.getHeight(); i++)
						{
							for(int j = 0; j < field.getWidth(); j++)
							{
								field.uncoverArea(j,i);
							}
						}
						*/
					}
					catch(IndexOutOfBoundsException exception){}
				}
				e.consume();
				numberOfMinesLeft.setText("Mines: " + field.computeRemainingMines() + "/" + field.getNumberOfMines());
				drawMineField(field, canvas);
			}
		});
		
		newGameButton.setOnAction(new EventHandler<ActionEvent>()
		{
			@Override
			public void handle(ActionEvent event)
			{
				int width = 8, height = 8, numberOfMines = 10;
				try
				{
					width = Integer.parseInt(widthField.getText());
					height = Integer.parseInt(heightField.getText());
					numberOfMines = Integer.parseInt(numberOfMinesField.getText());
				}
				catch(NumberFormatException exception)
				{
					return;
				}
				
				if(width < 4 || height < 4)
					return;
				else if(numberOfMines < 1 || numberOfMines > width*height-9)
					return;
				else if(width < minWidth || width > maxWidth)
					return;
				else if(height < minHeight || height > maxHeight)
					return;
				else if(numberOfMines < minNumberOfMines)
					return;
				field.newGame(width, height, numberOfMines);
				field.adjustTileImageSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				canvas.setWidth(Tile.COVERED_IMAGE.getWidth()*width);
				canvas.setHeight(Tile.COVERED_IMAGE.getHeight()*height);
				drawMineField(field, canvas);
				numberOfMinesLeft.setText("Mines: " + field.computeRemainingMines() + "/" + field.getNumberOfMines());
				timer.stop();
				time.setText("0");
			}
		});
		
		bestTimesButton.setOnAction(new EventHandler<ActionEvent>()
		{
			@Override
			public void handle(ActionEvent event)
			{
				Stage stage = new Stage();
				try
				{
					BestTimesPane bestTimesPane = new BestTimesPane(Integer.parseInt(widthField.getText()), Integer.parseInt(heightField.getText()), Integer.parseInt(numberOfMinesField.getText()));
					Scene scene = new Scene(bestTimesPane);
					scene.getStylesheets().add(MinesweeperRunner.class.getResource("MinesweeperPane.css").toExternalForm());
			        stage.setScene(scene);
					stage.setTitle("Best Times");
					stage.initModality(Modality.WINDOW_MODAL);
					stage.show();
				}
				catch(NumberFormatException exception)
				{
					return;
				}
			}
		});
	}
	
	public void drawMineField(MineField mineField, Canvas canvas)
	{
		GraphicsContext gc = canvas.getGraphicsContext2D();
		double tileWidth = Tile.COVERED_IMAGE.getWidth();
		double tileHeight = Tile.COVERED_IMAGE.getHeight();
		
		for(int y = 0; y < mineField.getHeight(); y++)
		{
			for(int x = 0; x < mineField.getWidth(); x++)
			{
				switch(mineField.getTileState(x,y))
				{
					case COVERED: gc.drawImage(Tile.COVERED_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case FLAGGED: gc.drawImage(Tile.FLAGGED_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case MINE: gc.drawImage(Tile.MINE_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case HITMINE: gc.drawImage(Tile.HIT_MINE_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case WRONGMINE: gc.drawImage(Tile.WRONG_MINE_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case BLANK: gc.drawImage(Tile.BLANK_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER1: gc.drawImage(Tile.NUMBER_1_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER2: gc.drawImage(Tile.NUMBER_2_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER3: gc.drawImage(Tile.NUMBER_3_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER4: gc.drawImage(Tile.NUMBER_4_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER5: gc.drawImage(Tile.NUMBER_5_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER6: gc.drawImage(Tile.NUMBER_6_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER7: gc.drawImage(Tile.NUMBER_7_IMAGE, x*tileWidth, y*tileHeight);
						break;
					case NUMBER8: gc.drawImage(Tile.NUMBER_8_IMAGE, x*tileWidth, y*tileHeight);
						break;
				}
			}
		}
	}
}