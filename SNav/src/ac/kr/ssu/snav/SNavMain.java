package ac.kr.ssu.snav;

import ac.kr.ssu.snav.parser.SNavReadingRDF;
import ac.kr.ssu.snav.parser.SNavStatements;
import ac.kr.ssu.snav.parser.SNavUser;

public class SNavMain {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		SNavReadingRDF rdf = new SNavReadingRDF();
		SNavUser nav = rdf.setUser();
		System.out.println(nav.getUser());
		
		new SNavStatements();
	}

}
