
import javafx.scene.image.Image;

public class Tile
{
	private TileState state;
	private boolean isMine;
	
	public static String imageDirectory = "file:res" + System.getProperty("file.separator");
	public static int tileImageSize = (int)(MinesweeperPane.SCREEN_WIDTH/30);
	public static Image COVERED_IMAGE = new Image(imageDirectory + "covered.png", tileImageSize, tileImageSize, true, true);
	public static Image FLAGGED_IMAGE = new Image(imageDirectory + "flagged.png", tileImageSize, tileImageSize, true, true);
	public static Image MINE_IMAGE = new Image(imageDirectory + "mine.png", tileImageSize, tileImageSize, true, true);
	public static Image HIT_MINE_IMAGE = new Image(imageDirectory + "hitmine.png", tileImageSize, tileImageSize, true, true);
	public static Image WRONG_MINE_IMAGE = new Image(imageDirectory + "wrongmine.png", tileImageSize, tileImageSize, true, true);
	public static Image BLANK_IMAGE = new Image(imageDirectory + "blank.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_1_IMAGE = new Image(imageDirectory + "number1.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_2_IMAGE = new Image(imageDirectory + "number2.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_3_IMAGE = new Image(imageDirectory + "number3.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_4_IMAGE = new Image(imageDirectory + "number4.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_5_IMAGE = new Image(imageDirectory + "number5.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_6_IMAGE = new Image(imageDirectory + "number6.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_7_IMAGE = new Image(imageDirectory + "number7.png", tileImageSize, tileImageSize, true, true);
	public static Image NUMBER_8_IMAGE = new Image(imageDirectory + "number8.png", tileImageSize, tileImageSize, true, true);
	
	public Tile()
	{
		state = TileState.COVERED;
		isMine = false;
	}
	
	public TileState getState(){return state;}
	public boolean isMine(){return isMine;}
	
	public void setState(TileState state){this.state = state;}
	public void setMine(boolean isMine){this.isMine = isMine;}
}