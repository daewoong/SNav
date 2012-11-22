package ac.kr.ssu.snav.parser;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.ResIterator;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;


public class SNavStatements {
	
	private SNavReadingRDF readingRDF;
	private Model model;
	private Statement stmt;
	private Resource subject;
	private Property predicate;
	private RDFNode object;
	
	private Vector<String> vStatement;
	private Vector<String> vSubject;
	private Vector<String> vPredicate;
	private Vector<String> vObject;
	
	private int nameSpaceLength = 0;
	private String nonURIValue;
	
	public SNavStatements(){
		
		//created rdf reading constructor
		this.readingRDF = new SNavReadingRDF();
		this.readingRDF.modelRead();
		this.readingRDF.modelWrite();
		this.model = this.readingRDF.getModel();
		
		this.vStatement = new Vector<String>();
		this.vSubject = new Vector<String>();
		this.vPredicate = new Vector<String>();
		this.vObject = new Vector<String>();
			
		// list the statements in the Model
		StmtIterator iter = this.model.listStatements();			
		
		String anonynous = "";
		int anonynousCount = 0;
		
		// print out the predicate, subject and object of each statement and added vector 
		while (iter.hasNext()) {
		    this.stmt      = iter.nextStatement();  	 // get next statement
		    this.subject   = this.stmt.getSubject();     // get the subject
		    this.predicate = this.stmt.getPredicate();   // get the predicate
		    this.object    = this.stmt.getObject();      // get the object
		    
		    //added statement
		    this.vStatement.add(this.stmt.toString());
		    System.out.println("\nstatement: " + this.stmt.toString());
		    
		    //added subject
		    if(!this.subject.isAnon()){
		    	System.out.println("subject: " + this.subject.toString());	
		    	
		    	this.nameSpaceLength = this.subject.getNameSpace().length();
		    	this.nonURIValue = this.subject.getURI().substring(this.nameSpaceLength);
			    this.vSubject.add(this.nonURIValue);
			    
			    System.out.println("subject: " + this.nonURIValue);		   
		    }else{
		    	anonynous = "anonynous" + anonynousCount++;		    	
		    	this.vSubject.add(anonynous);
		    	System.out.println("subject: " + anonynous);
		    }
		    
		    //predicate
		    System.out.println("  predicate: " + this.predicate.toString() + " ");
		    
		    //added nonURIPredicate
		    this.nameSpaceLength = this.predicate.getNameSpace().length();
		    this.nonURIValue = this.predicate.getURI().substring(this.nameSpaceLength);
		    this.vPredicate.add(this.nonURIValue);
		    System.out.println("  predicate: " + this.nonURIValue + " ");
		    
		    //added object
		    if (this.object instanceof Resource && !this.object.isAnon()) {
		       this.vObject.add(this.object.toString());
		       System.out.print("  object: " + this.object.toString());
		    } else {		    	
		    	// object is a literal
		    	if(this.object.isLiteral()){			   
			    	this.vObject.add(this.object.toString());
			        System.out.print("  object: \"" + this.object.toString() + "\"");
		    	}   
			    else{
			    	
			    	anonynous = "anonyous" + anonynousCount++;	
			    	System.out.print("  object: \"" + anonynous + "\"");
			    	this.vObject.add(anonynous);
			    	
			    }
		    }
	
		    System.out.println(" .");

		} 
	}
	
	public void searchRDFNode(){
		
		Map<String,String> prefixMap = this.model.getNsPrefixMap();
		System.out.println(prefixMap.toString());	
		
		System.out.println(this.model.getNsPrefixURI("election"));
		
		String URI = model.getNsPrefixURI("election");
		Resource vcard = model.getResource(URI);
		
		//make name property
		Property p = model.getProperty(URI+"name");	
		
		//object search using property. 
		ResIterator iter2 = model.listSubjectsWithProperty(p);
		if (iter2.hasNext()) {
		    System.out.println("The database contains election for:");
		    while (iter2.hasNext()) {
		        System.out.println("  " + iter2.nextResource()
		                                      .getProperty(p)
		                                      .getString());
		    }
		} else {
		    System.out.println("No election were found in the database");
		}
	}
	
	/**
	 * @return the vStatement
	 */
	public Vector<String> getvStatement() {
		return vStatement;
	}

	/**
	 * @param vStatement the vStatement to set
	 */
	public void setvStatement(Vector<String> vStatement) {
		this.vStatement = vStatement;
	}

	/**
	 * @return the vSubject
	 */
	public Vector<String> getvSubject() {
		return vSubject;
	}

	/**
	 * @param vSubject the vSubject to set
	 */
	public void setvSubject(Vector<String> vSubject) {
		this.vSubject = vSubject;
	}

	/**
	 * @return the vPredicate
	 */
	public Vector<String> getvPredicate() {
		return vPredicate;
	}

	/**
	 * @param vPredicate the vPredicate to set
	 */
	public void setvPredicate(Vector<String> vPredicate) {
		this.vPredicate = vPredicate;
	}

	/**
	 * @return the vObject
	 */
	public Vector<String> getvObject() {
		return vObject;
	}

	/**
	 * @param vObject the vObject to set
	 */
	public void setvObject(Vector<String> vObject) {
		this.vObject = vObject;
	}	
	
	public Model getModel() {
		return model;
	}

	public void setModel(Model model) {
		this.model = model;
	}

	public Statement getStmt() {
		return stmt;
	}

	public void setStmt(Statement stmt) {
		this.stmt = stmt;
	}

	public Resource getSubject() {
		return subject;
	}

	public void setSubject(Resource subject) {
		this.subject = subject;
	}

	public Property getPredicate() {
		return predicate;
	}

	public void setPredicate(Property predicate) {
		this.predicate = predicate;
	}

	public RDFNode getObject() {
		return object;
	}

	public void setObject(RDFNode object) {
		this.object = object;
	}
	
//	Set<String> uris = new HashSet<String>();
//    if(!this.subject.isAnon()){
//	uris.add(this.subject.getURI());
//}
//uriLength = this.predicate.getNameSpace().length();
//uris.add(this.predicate.getURI().substring(uriLength));// - this.predicate.getNameSpace());

//if(this.object.isResource() && !this.subject.isAnon()){
//	uris.add(this.stmt.getResource().getURI());
//}
	
}

