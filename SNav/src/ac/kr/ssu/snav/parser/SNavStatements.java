package ac.kr.ssu.snav.parser;

import java.util.Vector;

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
	
	private Vector<String> vStatement;
	private Vector<String> vSubject;
	private Vector<String> vPredicate;
	private Vector<String> vObject;
	
	public SNavStatements(){
		
		model = new SNavReadingRDF().getModel();
		
		this.vStatement = new Vector<String>();
		this.vSubject = new Vector<String>();
		this.vPredicate = new Vector<String>();
		this.vObject = new Vector<String>();
		
		// list the statements in the Model
		StmtIterator iter = model.listStatements();
	
		// print out the predicate, subject and object of each statement
		while (iter.hasNext()) {
		    this.stmt      = iter.nextStatement();  // get next statement
		    this.subject   = stmt.getSubject();     // get the subject
		    this.predicate = stmt.getPredicate();   // get the predicate
		    this.object    = stmt.getObject();      // get the object
	
		    this.vStatement.add(this.stmt.toString());
		    System.out.println("\nstatement: " + this.stmt.toString());
		    
		    this.vSubject.add(this.subject.toString());
		    System.out.println("subject: " + this.subject.toString());
		    
		    this.vPredicate.add(this.predicate.toString());
		    System.out.println("  predicate: " + this.predicate.toString() + " ");
		    
		    if (this.object instanceof Resource) {
		       this.vObject.add(this.object.toString());
		       System.out.print("  object: " + this.object.toString());
		    } else {
		        // object is a literal
		    	this.vObject.add(this.object.toString());
		        System.out.print("  object: \"" + this.object.toString() + "\"");
		    }
	
		    System.out.println(" .");
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
	
	@Override
	public String toString() {
		return "SNavStatements [sStmt=" + sStmt + ", sSubject=" + sSubject
				+ ", sPredicate=" + sPredicate + ", sObject=" + sObject + "]";
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
}

