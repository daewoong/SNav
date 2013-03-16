package ac.kr.ssu.snav.query;

import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import javax.annotation.Resource;

import ac.kr.ssu.snav.parser.SNavReadingRDF;
import ac.kr.ssu.snav.parser.SNavStatements;

import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.query.ResultSetFactory;
import com.hp.hpl.jena.query.ResultSetFormatter;
import com.hp.hpl.jena.query.ResultSetRewindable;
import com.hp.hpl.jena.rdf.model.Literal;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.util.FileManager;

public class SNavQuery {
	
	private Model model;
	private String PREFIXelection = "http://imc.ssu.ac.kr/2012/08/gensol/election#";
	private String PREFIXsubject = "http://imc.ssu.ac.kr/law/election#";
	private String varSubject = "";
	private String varPredicate = "<"+PREFIXelection+"구성인원>";	
	private String varObject = "";
	
	private SNavStatements statement;
	
	private Vector<String> vSubject;
	private Vector<String> vPredicate;
	private Vector<String> vObject;
	
	private int tripleNum = 0;
	
	public SNavQuery(String var){
		
		this.vSubject = new Vector<String>();
		this.vPredicate = new Vector<String>();
		this.vObject = new Vector<String>();
		
		System.out.println("=== in SNavQuery ===");
		System.out.println("var: " + var);
		//var = "읍·면·동선거관리위원회";
		
		this.varSubject = var;
		//this.varPredicate = "<"+ PREFIXelection + var + ">";
		
		System.out.println(this.varPredicate);
		
		SNavReadingRDF rdf = new SNavReadingRDF();
		rdf.modelRead();
		this.model = rdf.getModel();
						
		//String queryString = "SELECT * { <http://imc.ssu.ac.kr/law/election#읍·면·동선거관리위원회> ?predicate ?object }";
		//String queryString = getQueryPredicate(this.varPredicate); 
		String queryString = getQuerySubject(this.varSubject); 
		//this.queryExecutePredicate(queryString);
		this.queryExecuteSubject(this.varSubject, queryString);

	}
	
	private void queryExecuteSubject(String subject, String queryString){
		
		Query query = QueryFactory.create(queryString);
		QueryExecution qexec = QueryExecutionFactory.create(query, this.model);
		
		  try {
		    ResultSet results = qexec.execSelect();			 
		    List<String> resultVarNames = results.getResultVars();
		    Iterator iterator = resultVarNames.iterator();
		    
		    String var1 = resultVarNames.get(0);
		    String var2 = resultVarNames.get(1);
		  	int index = 0;
		  	
		  	//query results navigation
		    while(results.hasNext()){
		    	
		    	QuerySolution soln = results.nextSolution();
		   		    	
		    	RDFNode r = soln.get(var1);
		    	Literal l = soln.getLiteral(var2);		    	
		    	
		    	//query results added vector
		    	int nameSpaceLenth = r.asResource().getNameSpace().length();
		    	String nonURIValue = r.asResource().getURI().substring(nameSpaceLenth);
		    	
		    	//get literal
		        String convertLiteral = String.valueOf(l.getValue());
		        
		        this.vSubject.add(subject);
		    	this.vPredicate.add(nonURIValue);		    	
			    this.vObject.add(convertLiteral);
			    		    	
		    }
		    
		    //ResultSetFormatter.out(System.out, results);
		    		    
		   } finally { qexec.close(); }		
	}

	private void queryExecutePredicate(String queryString){
		
		Query query = QueryFactory.create(queryString);
		QueryExecution qexec = QueryExecutionFactory.create(query, this.model);
		
		  try {
		    ResultSet results = qexec.execSelect();			 
		    List<String> resultVarNames = results.getResultVars();
		    Iterator iterator = resultVarNames.iterator();
		    
		    String var1 = resultVarNames.get(0);
		    String var2 = resultVarNames.get(1);
		  	int index = 0;
		  	
		  	//query results navigation
		    while(results.hasNext()){
		    	
		    	QuerySolution soln = results.nextSolution();
		   		    	
		    	RDFNode r = soln.get(var1);
		    	Literal l = soln.getLiteral(var2);		    	
		    	
		    	//query results added vector
		    	int nameSpaceLenth = r.asResource().getNameSpace().length();
		    	String nonURIValue = r.asResource().getURI().substring(nameSpaceLenth);
		    	//this.vSubject.add(nonURIValue);		    	
			    
		    	//String querySubject = getQuerySubject(this.vSubject.get(index));
		    	String querySubject = getQuerySubject(nonURIValue);
		    	queryExecutePSubject(nonURIValue, querySubject);
		    		    	
		    	//System.out.println(this.vSubject.get(index++));
		    }
		    
		    //ResultSetFormatter.out(System.out, results);
		    		    
		   } finally { qexec.close(); }		
	}
	
	private void queryExecutePSubject(String nonURIValue, String queryString){
		
		String nonURISubjectValue = nonURIValue;
		Query query = QueryFactory.create(queryString);
		QueryExecution qexec = QueryExecutionFactory.create(query, this.model);
		
		try {
		    ResultSet results = qexec.execSelect();			 
		    List<String> resultVarNames = results.getResultVars();
		    Iterator iterator = resultVarNames.iterator();
		    
		    String predicate = resultVarNames.get(0);
		    String object = resultVarNames.get(1);
		  	int index = 0;
		  	int index2 = 0;
		  	int index3 = 0;
		  	
		  	//query results navigation from subject
		    while(results.hasNext()){
		    	
		    	QuerySolution soln = results.nextSolution();
		   		    	
		    	RDFNode r = soln.get(predicate);
		    	Literal l = soln.getLiteral(object);		    	
		    			    	
		    	//get predicate.
		    	int nameSpaceLenth = r.asResource().getNameSpace().length();
		    	String nonURIPredicateValue = r.asResource().getURI().substring(nameSpaceLenth);	 
		    	
		    	//get literal
		        String convertLiteral = String.valueOf(l.getValue());
		        		        
			    this.vSubject.add(nonURISubjectValue);
		    	this.vPredicate.add(nonURIPredicateValue);
			    this.vObject.add(convertLiteral);
			    
//		    	System.out.println(this.vSubject.get(index++));
//		    	System.out.println(this.vPredicate.get(index2++));
//		    	System.out.println(this.vObject.get(index3++));
		    }
		    
		    //ResultSetFormatter.out(System.out, results);
		    		    
		   } finally { qexec.close(); }	
		
		//ResultSet resultset = qexec.execSelect();
		//ResultSetFormatter.out(System.out, resultset);
//		this.tripleNum = resultset.getRowNumber();
//		
//		for(int i=0; i<this.tripleNum; i++)
//			this.vSubject.add(nonURIValue);
//		
//		System.out.println("Triple count per subject: " + this.tripleNum + "\n");
		
	}
	
	private String getQuerySubject(String varSubject){
		
		varSubject = "<"+ this.PREFIXsubject + varSubject + ">";
		System.out.println(varSubject);
		String queryString = "SELECT * { "+ varSubject + " ?predicate ?object }";

		return queryString;
		
	}
	
	private String getQueryPredicate(String varPredicate){
		
		this.varPredicate = varPredicate;
		String queryString = "SELECT * { ?subject  " + this.varPredicate + "?object }";
		return queryString;
	}
	
	private String getQueryObject(String varObject){
		
		this.varObject = varObject;
		String queryString = "SELECT * { ?subject ?predicate " + this.varObject + "}";
		return queryString;
		  
	}
	
	private String getQuerySPO(){
		
		String queryString = "SELECT * { ?subject ?predicate ?object }";
		return queryString;
		  
	}
	
	private void queryProcess(ResultSet results){
		
		for ( ; results.hasNext() ; )
	    {
	      QuerySolution soln = results.nextSolution() ;
	      
	      // Get a result variable by name.
	      RDFNode x = soln.get("http://imc.ssu.ac.kr/law/election#선거관리위원회") ;    
	      
	      // Get a result variable - must be a resource
	      Resource r = (Resource) soln.getResource("http://imc.ssu.ac.kr/law/election#선거관리위원회"); 
	      
	      // Get a result variable - must be a literal
	      Literal l = soln.getLiteral("VarL");  
	      
//	      System.out.println(x.toString());  
//	      System.out.println(r.toString());
	    } 
	}
	
	public void generalQueryProcess(){
		
		FileManager.get().addLocatorClassLoader(SNavQuery.class.getClassLoader());
        Model model = FileManager.get().loadModel("exampleRDF/electionLaw2.rdf");
        
       // String queryString = "SELECT * { ?s ?p ?o }";
        String queryString = "SELECT ?p { <http://imc.ssu.ac.kr/law/election#특별시·광역시·도선거관리위원회> ?p ?o }";
        Query query = QueryFactory.create(queryString);
        QueryExecution qexec = QueryExecutionFactory.create(query, model);
        try {
            ResultSetRewindable results = ResultSetFactory.makeRewindable(qexec.execSelect());

            System.out.println("---- XML ----");
            ResultSetFormatter.outputAsXML(System.out, results);
            results.reset();

            System.out.println("---- Text ----");
            ResultSetFormatter.out(System.out, results);
            results.reset();

            System.out.println("\n---- CSV ----");
            ResultSetFormatter.outputAsCSV(System.out, results);
            results.reset();

            System.out.println("\n---- TSV ----");
            ResultSetFormatter.outputAsTSV(System.out, results);
            results.reset();
            
            System.out.println("\n---- JSON ----");
            ResultSetFormatter.outputAsJSON(System.out, results);
            results.reset();
            
        } finally {
            qexec.close();
        }      
	}
	
	public SNavStatements getSnavStatements(){
		return this.statement;
	}
	
	/**
	 * @return the vSubject
	 */
	public Vector<String> getvSubject() {
		return this.vSubject;
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
	
	public static void main(String args[]){
		
		new SNavQuery("구성인원");
	}
}
