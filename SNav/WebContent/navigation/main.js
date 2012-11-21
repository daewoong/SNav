
/**  main.js  */

var dataSubject = "";
var dataPredicate = "";
var dataObject = "";

var sys;

//asynchronous communications 
$.ajax({
	
    url : "http://localhost:9090/SNav/SNavAgent",
    data : "keyword=RDFTriple",
    dataType : "jsonp",
    jsonp : "callback",
    success: function(data) {
        if(data != null)    {            	
            alert(data.keyword + ", " +  data.subject + ", " + data.predicate  + ", " + data.object);
            dataSubject = data.subject;
            dataPredicate = data.predicate;
            dataObject = data.object;
            
            alert("Subject : " + dataSubject);
            alert("Predicate : " + dataPredicate);
            alert("Object : " + dataObject);

        }
    }
});

/** addEdge */
function addEdge(source, des, count){
	for(var i=0; i<count; i++){
		sys.addEdge(i,"test"+i);
	}
}

(function($){

    var Renderer = function(canvas){
    var canvas = $(canvas).get(0);
    var ctx = canvas.getContext("2d");
    var particleSystem;
    
    alert("loading");
    
    var that = {
      		
      init:function(system){
       
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system     
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system;

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) ;
        
        // leave an extra 80px of whitespace per side
        particleSystem.screenPadding(80); 
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling();      
        
        var x=document.getElementById("contents").innerHTML = dataResult;
    	addEdge("new", dataResult, 20);
	
      },
      
      redraw:function()
      {
          ctx.fillStyle = "white";
          ctx.fillRect (0,0, canvas.width, canvas.height);

          particleSystem.eachEdge (function (edge, pt1, pt2)
          {
              ctx.strokeStyle = "rgba(0,0,0, .333)";
              ctx.lineWidth = 1;
              ctx.beginPath ();
              ctx.moveTo (pt1.x, pt1.y);
              ctx.lineTo (pt2.x, pt2.y);
              ctx.stroke ();

              ctx.fillStyle = "green";
              ctx.font = 'italic 13px sans-serif';
              ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);

          });

          particleSystem.eachNode (function (node, pt)
          {        	  
              var w = 10;
              ctx.fillStyle = "orange";
              ctx.fillRect (pt.x-w/2, pt.y-w/2, w,w);
              ctx.fillStyle = "black";
              ctx.font = 'italic 13px sans-serif';
              ctx.fillText (node.name, pt.x+8, pt.y+8);
          });       
         },
         
       /*  
      redraw:function(){
        // 
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        // 
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10
          ctx.fillStyle = (node.data.alone) ? "orange" : "black"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
          
          
        })    			
      },
      
       */  

      initMouseHandling:function(){

        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
         	
          /** clicked */
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true;
            }

            $(canvas).bind('mousemove', handler.dragged);
            $(window).bind('mouseup', handler.dropped);

            return false;
          },
          
          /** dragged */
          dragged:function(e){
        	  
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s);
              dragged.node.p = p;
            }

            return false;
          },

          /** dropped */
          dropped:function(e){
        	  
            if (dragged===null || dragged.node===undefined) return;
            if (dragged.node !== null) dragged.node.fixed = false;
            dragged.node.tempMass = 1000;
            dragged = null;
            $(canvas).unbind('mousemove', handler.dragged);
            $(window).unbind('mouseup', handler.dropped);
            _mouseP = null;
            return false;
          }
        };
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },     
    };
    
    return that;
  };   

  /** Document Ready Event 
   * - document to be fully loaded and ready */
  
 $(document).ready(function(){
   
	    // create the system with sensible repulsion/stiffness/friction
	    sys = arbor.ParticleSystem(1000, 600, 0.5); 
	   
	    // use center-gravity to make the graph settle nicely (ymmv)
	    sys.parameters({gravity:true}); 
	    
	    // our newly created renderer will have its .init() method called shortly by sys...
	    sys.renderer = Renderer("#viewport"); 
	    	    
	    // add some nodes to the graph and watch it go...
	    sys.addEdge("a",'apple');
	    sys.addEdge('a','google');
	    sys.addEdge('a','jojo');
	    sys.addEdge('a','samsung');
	    //sys.addNode('f', {alone:true, mass:.25})
	
	    //add node
	    node1 = sys.addNode(dataResult);
	    node2 = sys.addNode("another");
	    node3 = sys.addNode("predicate");
	    node4 = sys.addNode("mynode", {mass:2, myColor:"goldenrod"});
	    
	    //add edge
	    edge1 = sys.addEdge(node1, node2, node3, {length:.75, pointSize:3});

	    //different way 	
	    sys.graft({
	   
	      nodes:{A:{color:"red", shape:"dot", alpha:1}, 
		      B:{color:"#b2b19d", shape:"dot", alpha:1}, 
		      C:{color:"#b2b19d", shape:"dot", alpha:1}, 
		      D:{color:"#b2b19d", shape:"dot", alpha:1},
		      E:{color:"#b2b19d", shape:"dot", alpha:1},
		      F:{color:"#b2b19d", shape:"dot", alpha:1},
		      G:{color:"#b2b19d", shape:"dot", alpha:1},
		      },
		      
	      edges:{
	    	  A:{
	          B:{length:.8, data:{name:"A->B"}},
	          C:{length:.8, data:{name:"A->C"}},
	          D:{length:.8, data:{name:"A->D"}},
	          E:{length:.8, data:{name:"A->E"}},
	          F:{length:.8, data:{name:"A->F"}},
	          G:{length:.8, data:{name:"A->G"}}
	           }
	      }
	    });
	    

	    // or, equivalently:
	    //
	    // sys.graft({
	    //   nodes:{
	    //     f:{alone:true, mass:.25}
	    //   }, 
	    //   edges:{
	    //     a:{ b:{},
	    //         c:{},
	    //         d:{},
	    //         e:{}
	    //     }
	    //   }
	    // })
	    
	  });

})(this.jQuery);