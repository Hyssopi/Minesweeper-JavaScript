
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Label;
import javafx.scene.control.Separator;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.VBox;
import javafx.scene.shape.Rectangle;

public class BestTimesPane extends VBox
{
	private Label titleLabel;
	private ComboBox<String> fileSelector;
	private GridPane gridPane;
	private List<Label> positionLabels;
	private List<Label> timeLabels;
	String folderPath, filename;
	
	public BestTimesPane(int widthField, int heightField, int numberOfMinesField)
	{
		titleLabel = new Label("W = " + widthField + ", H = " + heightField + ", #M = " + numberOfMinesField);
		fileSelector = new ComboBox<String>();
		gridPane = new GridPane();
		positionLabels = new ArrayList<Label>();
		timeLabels = new ArrayList<Label>();
		
		this.getChildren().addAll(titleLabel, new Separator(), fileSelector, gridPane, new Rectangle(275,0));
		this.setId("BestTimesPane");
		titleLabel.setId("BestTimesPane-titleLabel");
		gridPane.setId("BestTimesPane-gridPane");
		gridPane.setGridLinesVisible(true);
		
		folderPath = "bestTimes" + System.getProperty("file.separator");
		filename = widthField + "_" + heightField + "_" + numberOfMinesField + ".log";
		List<String> bestTimes = getBestTimes(folderPath+filename);
		
		Label numberHeader = new Label("#");
		numberHeader.setId("BestTimesPane-numberHeader");
		gridPane.add(numberHeader, 0, 0);
		Label timeHeader = new Label("Time (sec)");
		timeHeader.setId("BestTimesPane-timeHeader");
		gridPane.add(timeHeader, 1, 0);
		
		for(int i = 0; i < 10; i++)
		{
			positionLabels.add(new Label(i+1+""));
			positionLabels.get(i).setId("BestTimesPane-positionLabels");
			gridPane.add(positionLabels.get(i), 0, i+1);
			if(i < bestTimes.size())
				timeLabels.add(new Label(bestTimes.get(i)));
			else
				timeLabels.add(new Label("-"));
			timeLabels.get(i).setId("BestTimesPane-timeLabels");
			gridPane.add(timeLabels.get(i), 1, i+1);
		}
		
		List<String> filenames = getFilenames(folderPath);
		for(int i = 0; i < filenames.size(); i++)
			filenames.set(i, filenames.get(i).split(folderPath)[1].split(".log")[0]);
		sort(filenames);
		for(int i = 0; i < filenames.size(); i++)
			fileSelector.getItems().add(filenames.get(i));
		
		fileSelector.getSelectionModel().selectedItemProperty().addListener(new ChangeListener<String>()
		{
			public void changed(ObservableValue<? extends String> observable, String oldString, String newString)
			{
				titleLabel.setText("W = " + newString.split("_")[0] + ", H = " + newString.split("_")[1] + ", #M = " + newString.split("_")[2]);
				String filename = newString + ".log";
				List<String> bestTimes = getBestTimes(folderPath+filename);
				for(int i = 0; i < positionLabels.size(); i++)
				{
					if(i < bestTimes.size())
						timeLabels.get(i).setText(bestTimes.get(i));
					else
						timeLabels.get(i).setText("-");
				}
			}
		});
	}
	
	public List<String> getFilenames(String folderPath)
	{
		File folder = new File(folderPath);
		if(!folder.exists())
		{
			System.err.println("Error: Folder does not exist.");
			return new ArrayList<String>();
		}
		if(!folder.isDirectory())
		{
			System.err.println("Error: Path is not a folder.");
			return new ArrayList<String>();
		}
		List<String> filenames = new ArrayList<String>();
		File[] listOfFiles = folder.listFiles();
		for(File file : listOfFiles)
		{
			if(file.isFile())
			{
				String canonicalPath = null;
				try
				{
					canonicalPath = file.getCanonicalPath();
				}
				catch(IOException e){System.err.println("IOException: " + e.getMessage());}
				filenames.add(canonicalPath);
			}
		}
		return filenames;
	}
	
	public void sort(List<String> filenames)
	{
		for(int i = 0; i < filenames.size(); i++)
		{
			for(int j = i+1; j < filenames.size(); j++)
			{
				boolean flag = false;
				if(Integer.parseInt(filenames.get(i).split("_")[0]) > Integer.parseInt(filenames.get(j).split("_")[0]))
					flag = true;
				else if(Integer.parseInt(filenames.get(i).split("_")[0]) == Integer.parseInt(filenames.get(j).split("_")[0]) && Integer.parseInt(filenames.get(i).split("_")[1]) > Integer.parseInt(filenames.get(j).split("_")[1]))
					flag = true;
				else if(Integer.parseInt(filenames.get(i).split("_")[1]) == Integer.parseInt(filenames.get(j).split("_")[1]) && Integer.parseInt(filenames.get(i).split("_")[2]) > Integer.parseInt(filenames.get(j).split("_")[2]))
					flag = true;
				
				if(flag)
				{
					String temp = filenames.get(i);
					filenames.set(i, filenames.get(j));
					filenames.set(j, temp);
				}
			}
		}
	}
	
	public List<String> getBestTimes(String filename)
	{
		List<String> bestTimes = new ArrayList<String>();
		String delimiter = " ";
		if(!(new File(filename).exists()))
			return new ArrayList<String>();
		try
		{
			Scanner inFile = new Scanner(new FileReader(filename));
			while(inFile.hasNextLine())
			{
				String t = inFile.nextLine();
				long startTime = Long.parseLong(t.split(delimiter)[0]);
				long endTime = Long.parseLong(t.split(delimiter)[1]);
				bestTimes.add((endTime-startTime)/1000.0 + "");
			}
			inFile.close();
		}
		catch(NumberFormatException e){System.err.println("NumberFormatException: " + e.getMessage());}
		catch(ArrayIndexOutOfBoundsException e){System.err.println("ArrayIndexOutOfBoundsException: " + e.getMessage());}
		catch(IOException e){System.err.println("IOException: " + e.getMessage());}
		return bestTimes;
	}
}