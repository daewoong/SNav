package ac.kr.ssu.snav.query;

import java.util.Iterator;
import java.util.List;

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
	
	public SNavQuery(String var){
		
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
//		    List<String> resultVarNames = results.getResultVars();
//		    Iterator iterator = resultVarNames.iterator();
//		    String subject = null;
//		    String object = null;
//		    RDFNode r = null;
//		    
//		    //get vars name
//			while(iterator.hasNext()){
//	    		subject = iterator.next().toString();
//	    		object = iterator.next().toString();
//	    	}
//			
//		    while(results.hasNext()){
//		    	
//		    	QuerySolution soln = results.nextSolution();
//		   		    	
//		    	r = soln.get(subject);
//		    	Literal l = soln.getLiteral(object);
//		    	
//		    	System.out.println("subject: " + r.toString());
//		    	System.out.println("object: " + l.toString());
//		    
//		    }
		    
//		    String queryString1 = getQuerySubject("읍·면·동선거관리위원회"); 
//	    	Query query1 = QueryFactory.create(queryString1);
//			QueryExecution qexec1 = QueryExecutionFactory.create(query1, this.model);  
//			ResultSet re = qexec1.execSelect();
//			
//			ResultSetFormatter.out(System.out, re);
			
		    System.out.println("rowNum" + results.getRowNumber());
		    ResultSetFormatter.out(System.out, results);
		    
		    //make rdf model
		    Model model = results.getResourceModel();
		    //Model model  = qexec.execDescribe();
		    
		    System.out.println("Keyword Result Statement Size: " +  model.size());	
		    this.statement = new SNavStatements(model);
		    
		    System.out.println("rowNum : " + results.getRowNumber());
		    
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
	
	public static void main(String args[]){
		
		new SNavQuery("구성인원");
	}
}
