package ac.kr.ssu.snav.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ac.kr.ssu.snav.parser.SNavReadingRDF;
import ac.kr.ssu.snav.parser.SNavUser;


/**
 * Servlet implementation class SNavServletTest
 */
@SuppressWarnings("serial")
public class SNavServletTest extends HttpServlet {
	/* (non-Javadoc)
	 * @see javax.servlet.GenericServlet#init()
	 */
	@Override
	public void init() throws ServletException {
		// TODO Auto-generated method stub
		super.init();
	}

	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#service(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse res)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
				
		super.service(req, res);
		
		//RDF Core Engine 
		//new SNavReadingRDF();
		
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
		
		   String keyword = request.getParameter("search");
		
		   //call to rdf resources.	
		   String statement = new SNavReadingRDF().getString();
		   
		   response.setContentType("text/html");
	
	        
	       PrintWriter out = response.getWriter();
	       
	       String message = "Semantic Search Result!";

	       out.println("<html><body>");
	       out.println("<h1>"+message+"</h1>");
	       out.println("keyword: " + keyword);
	       out.println("<hr>");
	       out.println(statement);
	       out.println("</body></html>");
	       out.close();
	}

}
