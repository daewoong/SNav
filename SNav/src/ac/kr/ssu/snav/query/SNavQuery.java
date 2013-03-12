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
	private String commonURI = "http://imc.ssu.ac.kr/2012/08/gensol/election#";
	private String varSubject = "";
	private String varPredicate = "<"+commonURI+"구성인원>";	
	private String varObject = "";
	
	private SNavStatements statement;
	
	private Vector<String> vSubject;
	private Vector<String> vPredicate;
	private Vector<String> vObject;
	
	public SNavQuery(String var){
		
		this.vSubject = new Vector<String>();
		this.vPredicate = new Vector<String>();
		this.vObject = new Vector<String>();
		
		this.varPredicate = "<"+ commonURI + var + ">";
		SNavReadingRDF rdf = new SNavReadingRDF();
		rdf.modelRead();
		this.model = rdf.getModel();
				
		//String queryString = "SELECT * { ?subject  " + this.varPredicate + "?object }";
		String queryString = getQueryPredicate(this.varPredicate); 
		this.queryExecute(queryString);  
	}
	
	private void queryExecute(String queryString){
		
		Query query = QueryFactory.create(queryString);
		QueryExecution qexec = QueryExecutionFactory.create(query, this.model);
		
		  try {
		    ResultSet results = qexec.execSelect();			 
		    List<String> resultVarNames = results.getResultVars();
		    Iterator iterator = resultVarNames.iterator();
		    
		    String subject = resultVarNames.get(0);
		    String object = resultVarNames.get(1);
		  	int index = 0;
		  	
		  	//query results navigation
		    while(results.hasNext()){
		    	
		    	QuerySolution soln = results.nextSolution();
		   		    	
		    	RDFNode r = soln.get(subject);
		    	Literal l = soln.getLiteral(object);		    	
		    	
		    	//query results added vector
		    	int nameSpaceLenth = r.asResource().getNameSpace().length();
		    	String nonURIValue = r.asResource().getURI().substring(nameSpaceLenth);
		    	this.vSubject.add(nonURIValue);		    	
			       
		    	System.out.println(this.vSubject.get(index++));
		    }
		    
		    //ResultSetFormatter.out(System.out, results);
//		    
//		    //make rdf model
//		    Model model = results.getResourceModel();
//		    //Model model  = qexec.execDescribe();
//		    
//		    System.out.println("Keyword Result Statement Size: " +  model.size());	
//		    this.statement = new SNavStatements(model);
//		    
//		    System.out.println("rowNum : " + results.getRowNumber());
		    
		   } finally { qexec.close(); }		
	}
	
	private String getQuerySubject(String varSubject){
		
		this.varSubject = varSubject;
		String queryString = "SELECT * { " + this.varSubject + "?predicate ?object }";
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
