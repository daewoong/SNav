package ac.kr.ssu.snav.parser;


import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.rdf.model.Resource;
import com.hp.hpl.jena.rdf.model.Statement;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.hp.hpl.jena.util.FileManager;

public class SNavReadingTtl {

    public static void main(String[] args) {
        FileManager.get().addLocatorClassLoader(SNavReadingTtl.class.getClassLoader());
        Model model = FileManager.get().loadModel("c:\\exampleRDF/electionLaw.ttl", null, "TURTLE");

        StmtIterator iter = model.listStatements();
        try {
            while ( iter.hasNext() ) {
                Statement stmt = iter.next();
                
                Resource s = stmt.getSubject();
                Resource p = stmt.getPredicate();
                RDFNode o = stmt.getObject();
                
                if ( s.isURIResource() ) {
                	
                    System.out.print("URI");
                    System.out.print(s.toString());
                } else if ( s.isAnon() ) {
                    System.out.print("blank");
                }
                
                if ( p.isURIResource() ) 
                    System.out.print(" URI ");
                
                if ( o.isURIResource() ) {
                    System.out.print("URI");
                } else if ( o.isAnon() ) {
                    System.out.print("blank");
                } else if ( o.isLiteral() ) {
                    System.out.print("literal");
                }
                
                System.out.println();                
            }
        } finally {
            if ( iter != null ) iter.close();
        }
    }

}