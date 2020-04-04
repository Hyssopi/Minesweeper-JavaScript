
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MinesweeperRunner extends Application
{
	public static void main(String[] args)
	{
		launch(args);
	}
	
	@Override
	public void start(Stage primaryStage)
	{
		MinesweeperPane minesweeperPane = new MinesweeperPane();
		Scene scene = new Scene(minesweeperPane);
		scene.getStylesheets().add(MinesweeperRunner.class.getResource("MinesweeperPane.css").toExternalForm());
        primaryStage.setTitle("Minesweeper");
		//primaryStage.initStyle(StageStyle.UNDECORATED);
		primaryStage.setScene(scene);
		primaryStage.show();
		primaryStage.setMaximized(true);
		primaryStage.setResizable(false);
		
		
		
		
		
		
		/*
		System.out.println("TEST 1");
		System.out.println("Screen Width is: " + Toolkit.getDefaultToolkit().getScreenSize().getWidth() + "\nScreen Height is: " + Toolkit.getDefaultToolkit().getScreenSize().getHeight());
		
		System.out.println("TEST 2");
		GraphicsDevice gd = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice();
		int w= gd.getDisplayMode().getWidth();
		int h = gd.getDisplayMode().getHeight();
		System.out.println("Screen Width is: " + w + "\nScreen Height is: " + h);
		*/
		
		/*
		scene.widthProperty().addListener(new ChangeListener<Number>()
		{
			@Override
			public void changed(ObservableValue<? extends Number> observableValue, Number oldWidth, Number newWidth)
			{
				//minesweeperPane.updatePaneSize(primaryStage.getWidth(), primaryStage.getHeight());
				primaryStage.setMaximized(true);
			}
		});
		
		scene.heightProperty().addListener(new ChangeListener<Number>()
		{
			@Override
			public void changed(ObservableValue<? extends Number> observableValue, Number oldHeight, Number newHeight)
			{
				//minesweeperPane.updatePaneSize(primaryStage.getWidth(), primaryStage.getHeight());
				primaryStage.setMaximized(true);
			}
		});
		
		primaryStage.maximizedProperty().addListener(new ChangeListener<Boolean>()
		{
			@Override
			public void changed(ObservableValue<? extends Boolean> observableValue, Boolean oldValue, Boolean isMaximized)
			{
				//minesweeperPane.updatePaneSize(primaryStage.getWidth(), primaryStage.getHeight());
				primaryStage.setMaximized(true);
			}
		});
		*/
		
	}
}