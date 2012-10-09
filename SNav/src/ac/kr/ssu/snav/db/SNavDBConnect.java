package ac.kr.ssu.snav.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SNavDBConnect {
	
	private static String driver = "com.mysql.jdbc.Driver";
	private static int number = 12;
	private static String statement = "koei";
	private static String subject = "koei";
	private static String predicate = "koei";
	private static String object = "koei";
	
	public static void main(String[] args) {
		try {
			
			try {
				Class.forName(driver);
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
			Connection con = null;

			con = DriverManager.getConnection("jdbc:mysql://localhost:3306/snav","root", "apmsetup");
			System.out.println("success");
			
			Statement st = null;
			ResultSet rs = null;
			
			st = con.createStatement();
			//rs = st.executeQuery("SHOW DATABASES");
			int num = st.executeUpdate("INSERT INTO statement " +
			"VALUES(" + number + ",'" + statement + "','" + subject + "','" + predicate + "','" + object + "')");
			
			//if (st.execute("SHOW DATABASES") 
			/*
			if(st.execute("INSERT INTO statement VALUES('7', '4', '44', '4', '4')")){
				rs = st.getResultSet();
			}

			while (rs.next()) {
				String str = rs.getNString(1);
				System.out.println(str);
			}
			*/
			st.close();
			con.close();
		} catch (SQLException sqex) {
			System.out.println("SQLException: " + sqex.getMessage());
			System.out.println("SQLState: " + sqex.getSQLState());
		}	
	}
}
