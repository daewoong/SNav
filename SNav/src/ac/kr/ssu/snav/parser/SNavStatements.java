package ac.kr.ssu.snav.parser;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Property;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;


public class SNavStatements {
	
	private Model model;
	private Statement stmt;
	private Resource subject;
	private Property predicate;
	private RDFNode object;
	
	private String sStmt;
	private String sSubject;
	private String sPredicate;
	private String sObject;
	
	public SNavStatements(){
		
		model = new SNavReadingRDF().getModel();
		
		// list the statements in the Model
		StmtIterator iter = model.listStatements();
	
		// print out the predicate, subject and object of each statement
		while (iter.hasNext()) {
		    this.stmt      = iter.nextStatement();  // get next statement
		    this.subject   = stmt.getSubject();     // get the subject
		    this.predicate = stmt.getPredicate();   // get the predicate
		    this.object    = stmt.getObject();      // get the object
	
		    System.out.println("subject:" + subject.toString());
		    System.out.println("  predicate: " + predicate.toString() + " ");
		    if (object instanceof Resource) {
		       System.out.print(object.toString());
		    } else {
		        // object is a literal
		        System.out.print(" \"" + object.toString() + "\"");
		    }
	
		    System.out.println(" .");
		} 
	}
	
	public String getStringTest(){
		return stmt.toString();
	}
	
	public Model getModel() {
		return model;
	}

	public void setModel(Model model) {
		this.model = model;
	}

	@Override
	public String toString() {
		return "SNavStatements [sStmt=" + sStmt + ", sSubject=" + sSubject
				+ ", sPredicate=" + sPredicate + ", sObject=" + sObject + "]";
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
}

