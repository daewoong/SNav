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
import ac.kr.ssu.snav.parser.SNavUser;


/**
 * Servlet implementation class SNavServletTest
 */
@SuppressWarnings("serial")
public class SNavServletTest extends HttpServlet {
	
	/* 
	 * @see javax.servlet.GenericServlet#init()
	 */
	@Override
	public void init() throws ServletException {
		// TODO Auto-generated method stub
		super.init();
	}

	/* 
	 * @see javax.servlet.http.HttpServlet#service(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
				
		super.service(req, res);
		
		String method = req.getMethod();
		System.out.println(method);
		
		if(method.equals("GET")){
			doGet(req, res);
		}else if(method.equals("POST")){
			doPost(req, res);
		}
		
	}
       
	/**
     * @see HttpServlet#HttpServlet()
     */
    public SNavServletTest() {
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
		         
		   String id = request.getParameter("id");
		   String callBack = request.getParameter("callback");
		 
		   JSONObject obj = new JSONObject();
		   try {
				obj.put("result", id);
				obj.put("go", "테스트");
		   } catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
		   }	    
		         
		   PrintWriter out = response.getWriter();
		   out.write(callBack + "(" + obj.toString() + ")");
		   System.out.println(callBack + "(" + obj.toString() + ")");
		   out.flush();
		   out.close();
		   
		    /*
	       request.setCharacterEncoding("UTF-8");
		   String keyword = request.getParameter("search");
		   String callBack = request.getParameter("callback");
		   
		   //call to rdf resources.	
		   new SNavReadingRDF();
		   SNavStatements sStmt = new SNavStatements();
		   Vector<String> statement = sStmt.getvStatement();
		   Vector<String> subject = sStmt.getvSubject();
		   Vector<String> predicate = sStmt.getvPredicate();
		   Vector<String> object = sStmt.getvObject();
		   
			
	       System.out.println("\n==" + keyword + "===\n");
	       	   
	       //response.setContentType("text/html");
	       response.setCharacterEncoding("UTF-8");
	       response.setHeader("Cache-Control", "no-cache"); 
			
	       JSONObject obj = new JSONObject();
	       
	       try {
			obj.put("result", "success");
	       } catch (JSONException e) {
			e.printStackTrace();
	       }
	       
	       String message = "Semantic Search Result!";
	       
	       PrintWriter out = response.getWriter();
	       	      
	       out.write(callBack + obj.toString());
	       
	       out.println(obj.toString());
	       out.close();
	       */
	       /*
	       out.println("<html><head>");
	       out.println("<meta http-equiv=\"Content-Type\" content=text/html; charset=utf-8\"/>");
	       out.println("</head>");
	       out.println("<body>");
	       out.println("<h1>"+message+"</h1>");
	       out.println("keyword: " + keyword);
	       out.println("<hr></hr>");
	       out.println("<h3>Statement</h3>");
	       for(int index=0; index<statement.size(); index++){
	    	   out.println(statement.get(index)+"</br>");	
		   }
	       
	       out.println("<h3>Subject</h3>");
	       
	       for(int index=0; index<statement.size(); index++){
	    	   out.println(subject.get(index)+"</br>");	
		   }
	       
	       out.println("<h3>Predicate</h3>");
	       
	       for(int index=0; index<statement.size(); index++){
	    	   out.println(predicate.get(index)+"</br>");	
		   }
	       
	       out.println("<h3>Object</h3>");
	       
	       for(int index=0; index<statement.size(); index++){
	    	   out.println(object.get(index)+"</br>");	
		   }
	       out.println("</body></html>");
	       out.close();
	       */
	      
	}

}
