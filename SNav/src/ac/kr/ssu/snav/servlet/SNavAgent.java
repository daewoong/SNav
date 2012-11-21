package ac.kr.ssu.snav.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import ac.kr.ssu.snav.parser.SNavReadingRDF;
import ac.kr.ssu.snav.parser.SNavStatements;

/**
 * Servlet implementation class SNavAgent
 */
public class SNavAgent extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
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
		
		String keyword = request.getParameter("keyword");
		String callBack = request.getParameter("callback");
		
		//call to rdf resources.	
	    new SNavReadingRDF();
	    SNavStatements sStmt = new SNavStatements();
	    Vector<String> statement = sStmt.getvStatement();
	    Vector<String> subject = sStmt.getvSubject();
	    Vector<String> predicate = sStmt.getvPredicate();
	    Vector<String> object = sStmt.getvObject();
	   
	    String message = "Semantic Search Result!";
        System.out.println("\n==" + keyword + "===\n");
        
        PrintWriter out = response.getWriter();
//        out.println("<html><head>");
//        out.println("<meta http-equiv=\"Content-Type\" content=text/html; charset=utf-8\"/>");
//        out.println("</head>");
//        out.println("<body>");
//        out.println("<h1>"+message+"</h1>");
//        out.println("keyword: " + keyword);
//        out.println("<hr></hr>");
//        out.println("<h3>Statement</h3>");
//        for(int index=0; index<statement.size(); index++){
//    	   out.println(statement.get(index)+"</br>");	
//	    }
//       
//        out.println("<h3>Subject</h3>");
//       
//        for(int index=0; index<statement.size(); index++){
//    	   out.println(subject.get(index)+"</br>");	
//	    }
//        
//        out.println("<h3>Predicate</h3>");
//        
//        for(int index=0; index<statement.size(); index++){
//    	   out.println(predicate.get(index)+"</br>");	
//	    }
//       
//        out.println("<h3>Object</h3>");
//       
//        for(int index=0; index<statement.size(); index++){
//    	   out.println(object.get(index)+"</br>");	
//	    }
//        out.println("</body></html>");
//        out.close();
        
	    //created jason type   
		JSONObject obj = new JSONObject();
		
		try {	
		   obj.put("keyword", keyword);
		   obj.put("subject", subject);
		   obj.put("predicate", predicate);
		   obj.put("object", object);
		} catch (JSONException e) {
		   e.printStackTrace();
		}	    
		         
		out.println(callBack + "(" + obj.toString() + ")");
		System.out.println(callBack + "(" + obj.toString() + ")");
		out.flush();
		out.close();
	}

}
