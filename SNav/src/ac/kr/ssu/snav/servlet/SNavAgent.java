package ac.kr.ssu.snav.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.Vector;

import javax.servlet.RequestDispatcher;
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
		
		String keyword = request.getParameter("search");
		String callBack = request.getParameter("callback");	
		
//		//keyword = "설치";
//				
	    //Query process.
	    if(keyword != null){
	    	
	    	System.out.println("\nKeyword : ===" + keyword + "===\n");
	    	SNavQuery query = new SNavQuery(keyword); 
	    	SNavStatements sStmt = query.getSnavStatements();
	    	
	    	this.statement = sStmt.getvStatement();
			this.subject = sStmt.getvSubject();
			this.predicate = sStmt.getvPredicate();
			this.object = sStmt.getvObject();
			    
	        createJSon(response,keyword,callBack);		        
			
	        //redirect 
//			response.sendRedirect("index.html");
//
//	        RequestDispatcher rd = request.getRequestDispatcher("index.html");
//	        rd.forward(request, response);
			
	    }else{
	    	
	    	System.out.println("\nKeyword : ===" + keyword + "===\n");
	    	//call to rdf resources.	
		    new SNavReadingRDF();
		    SNavStatements sStmt = new SNavStatements();
		    
		    this.statement = sStmt.getvStatement();
		    this.subject = sStmt.getvSubject();
		    this.predicate = sStmt.getvPredicate();
		    this.object = sStmt.getvObject();
		    
	    	createJSon(response,keyword,callBack);
	    	
	    }
//	    request.setAttribute("message", message); // This will be available as ${message}
//      request.getRequestDispatcher("/navigation/testindex.html").forward(request, response);
	}
	
	private void createJSon(HttpServletResponse response, String keyword, String callBack){
		
		 //created jason type   
		JSONObject obj = new JSONObject();
		
		try {	
		   obj.put("keyword", keyword);
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
			out.println(callBack + "(" + JSonType + ")");
			System.out.println(callBack + "(" + JSonType + ")");
			
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