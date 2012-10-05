package ac.kr.ssu.snav.parser;

import java.io.InputStream;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.util.FileManager;

public class SNavReadingRDF {

	private String inputFileName = "exampleRDF/electionLaw.rdf";
	// create an empty model
	private Model model = ModelFactory.createDefaultModel();
	
	public SNavReadingRDF(){

		 
		// use the FileManager to find the input file
		InputStream in = FileManager.get().open( inputFileName );
		if (in == null) {
		    throw new IllegalArgumentException(
		       "File: " + inputFileName + " not found");
		}
	
		// read the RDF/XML file
		model.read(in, null);
	
		// write it to standard out
		model.write(System.out);
		System.out.println("================\n\n");
		

		
	}
	
	public Model getModel(){
		return model;
	}
	
	public SNavUser setUser(){
		SNavUser snavUser = new SNavUser();
		snavUser.setUser("Gerrard");
		return snavUser;
	}
}
