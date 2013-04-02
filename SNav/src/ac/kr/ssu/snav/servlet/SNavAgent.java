package ac.kr.ssu.snav.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import ac.kr.ssu.snav.parser.SNavReadingRDF;
import ac.kr.ssu.snav.parser.SNavStatements;
import ac.kr.ssu.snav.query.SNavQuery;

/**
 * Servlet implementation class SNavAgent
 */
public class SNavAgent extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private Vector<String> statement;
    private Vector<String> subject;
    private Vector<String> predicate;
    private Vector<String> object;  
//    private Vector<String> mLawName;
    
    private String keyword;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SNavAgent() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
				
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache"); 
		response.setContentType("text/html;charset=UTF-8"); 
		
		keyword = request.getParameter("search");			
		String callBack = request.getParameter("callback");		
		
		System.out.println("receive keyword: ===" + keyword + "===");
			    
	    //Query process.
	    if(keyword != null){
	    	
	    	keyword = URLDecoder.decode(keyword, "UTF-8");
	    	System.out.println("\nquery keyword : ===" + keyword + "===\n");
	    	
	    	SNavQuery query = new SNavQuery(keyword); 	    	
			this.subject = query.getvSubject();
			this.predicate = query.getvPredicate();
			this.object = query.getvObject();
//			this.mLawName = query.getmLawName();
			
	        createJSon(response,keyword,callBack);		        
			
	    }else{
	    		    	
	    	System.out.println("\ndefault keyword : ===" + keyword + "===\n");
	    	
			//call to rdf resources.	
		    new SNavReadingRDF();
		    SNavStatements sStmt = new SNavStatements();
		    
		    this.statement = sStmt.getvStatement();
		    this.subject = sStmt.getvSubject();
		    this.predicate = sStmt.getvPredicate();
		    this.object = sStmt.getvObject();
		    
	    	createJSon(response,callBack);
	    }
	    
	}
	
	private void createJSon(HttpServletResponse response, String callBack){
		
		 //created jason type   
		JSONObject obj = new JSONObject();
		
		try {	
		   obj.put("subject", this.subject);
		   obj.put("predicate", this.predicate);
		   obj.put("object", this.object);
		   
		} catch (JSONException e) {
		   e.printStackTrace();
		}	
		
		//write to web browser. 
		PrintWriter out = null;

		try {	
			out = response.getWriter();
			String JSonType = obj.toString();	
						
			out.print(callBack + "(" + JSonType + ")");
			System.out.println(callBack + "(" + JSonType + ")");
			
		} catch (IOException e) {
			e.printStackTrace();
			
		}finally{
			out.flush();
			out.close();
		}
		
	}
	
	private void createJSon(HttpServletResponse response, String keyword, String callBack){
			
		 //created jason type   
		JSONObject obj = new JSONObject();
		
		try {	
		   obj.put("keyword", keyword);
		   obj.put("subject", this.subject);
		   obj.put("predicate", this.predicate);
		   obj.put("object", this.object);
//		   obj.put("mlawname", this.mLawName);
		   obj.put("count", this.subject.size());
		   
		} catch (JSONException e) {
		   e.printStackTrace();
		}	
		
		//write to web browser. 
		PrintWriter out = null;
		
		try {
			out = response.getWriter();			
			String JSonType = obj.toString();	
						
			out.println(callBack + "(" + JSonType + ")");
			System.out.println(callBack + "(" + JSonType + ")");
		} catch (IOException e) {
			e.printStackTrace();
			
		}finally{
			out.flush();
			out.close();
		}	
	}
	
	private void redirectPage(HttpServletResponse response){
		
		response.setHeader("Cache-Control", "no-cache"); 
		response.setContentType("text/html;charset=UTF-8"); 
		
		//write to web browser. 
		PrintWriter out = null;
		
		try {
			out = response.getWriter();			
			
			out.println("<!DOCTYPE html>" +				
						"<html lang=\"en\">" +
						"<head>"+
							"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">" +
							"<title>Semantic Navigation</title>"
							);
					
  
		
 

		} catch (IOException e) {
			e.printStackTrace();
			
		}finally{
			out.flush();
			out.close();
		}
		
	}
}

////created jason type   
//JSONObject obj = new JSONObject();
//
//try {	
//   //obj.put("keyword", keyword);
//   obj.put("subject", subject);
//   obj.put("predicate", predicate);
//   obj.put("object", object);
//   
//} catch (JSONException e) {
//   e.printStackTrace();
//}	
//
////write to web browser. 
//PrintWriter out = response.getWriter();
//String JSonType = obj.toString();		
//out.println(callBack + "(" + JSonType + ")");
//System.out.println(callBack + "(" + JSonType + ")");
//
//out.flush();
//out.close();