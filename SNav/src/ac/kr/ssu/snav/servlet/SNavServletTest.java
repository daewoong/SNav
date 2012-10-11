package ac.kr.ssu.snav.servlet;

import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class SNavServletTest extends HttpServlet {
  public void doGet( HttpServletRequest req, HttpServletResponse res )
    throws ServletException,IOException {
    
    res.setContentType( "text/html;charset=UTF-8" );
    PrintWriter out = res.getWriter();
    
    out.println( "<HTML>" );
    out.println( "<BODY>" );
    out.println( "Hello World" );
    out.println( "</BODY>" );
    out.println( "</HTML>" );
    out.close();
    
  }
}