
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
            //alert(data.keyword + ", " +  data.subject + ", " + data.predicate  + ", " + data.object);
            dataSubject = data.subject;
            dataPredicate = data.predicate;
            dataObject = data.object;
            
           // alert("Subject : " + dataSubject);
           // alert("Predicate : " + dataPredicate);
           // alert("Object : " + dataObject);

        }
    }
});

/** addEdge */
function addEdge(subject, object, predicate, index){	
		
		 //add node
	    node1 = sys.addNode(subject, {mass:2, color:"skyblue"});
	    node2 = sys.addNode(object, {mass:2, color:"yellow"});
	    //node3 = sys.addEdge(predicate,{'index':index});
	    
	    //add edge
	    edge1 = sys.addEdge(node1, node2,{name: predicate, length:.75, pointSize:3});

}

(function($){

    var Renderer = function(canvas){
    var canvas = $(canvas).get(0);
    var ctx = canvas.getContext("2d");
    var particleSystem;
    var predicate;
    var pre;
    
    alert("RDF Triple Loading");
    
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
        
        var subject = dataSubject.split(/[\[\,\]]/);      
        predicate = dataPredicate.split(/[\[\,\]]/);
        var object = dataObject.split(/[\[\,\]]/);
        
        var count = subject.length;
        
        for(var index=1; index<12; index++){
        	var x=document.getElementById("result").innerHTML = subject[index];    
        	addEdge(subject[index], object[index], predicate[index], index);
        }
      },
      
      redraw:function()
      {
          ctx.fillStyle = "white";
          ctx.fillRect (0,0, canvas.width, canvas.height);
          
          var count = predicate.length;
          
          particleSystem.eachEdge (function (edge, pt1, pt2)
          {
        	 
              ctx.strokeStyle = "rgba(0,0,0, .333)";
              ctx.lineWidth = 1;
              ctx.beginPath ();
//              ctx.moveTo (pt1.x+20, pt1.y);
//              ctx.lineTo (pt2.x+20, pt2.y);
              ctx.moveTo (pt1.x, pt1.y);
              ctx.lineTo (pt2.x, pt2.y);
              ctx.stroke ();
              
            //  italic
              ctx.fillStyle = "#5C85AD";            
              ctx.font = '12px sans-serif';
              //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
              ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);

          });

          particleSystem.eachNode (function (node, pt)
          {      
        	  
        	         	  
        	  var w = 15;
        	       	  
//              ctx.fillStyle = "#005C5C";
//              ctx.fillRect (pt.x-w/2, pt.y-w/2, w + 250,w + 10);   
//              //ctx.arc(50,50,25,0,2*Math.PI, true);
//              ctx.fillStyle = "#D6E0EB";
//              ctx.font = 'bold 13px sans-serif';
//              ctx.fillText (node.name, pt.x, pt.y+8);
              
              ctx.beginPath();
              
              ctx.arc(pt.x-w/2, pt.y-w/2, 20, 0, 2 * Math.PI, false);
              //ctx.fillStyle = 'skyblue';
              ctx.fillStyle = node.data.color;  //node color
              ctx.fill();
              ctx.lineWidth = 5;
              
              //ctx.fillStyle = "#D6E0EB";
              ctx.fillStyle = "gray";
              ctx.font = 'bold 13px sans-serif';
              ctx.fillText (node.name, pt.x-10, pt.y);
              
              //ctx.strokeStyle = '#003300';
              ctx.stroke();
          });       
         },
           
//         redraw:function(){
//             if (!particleSystem) return
//                     
//             ctx.clearRect(0,0, canvas.width, canvas.height)
//
//             var nodeBoxes = {}
//             particleSystem.eachNode(function(node, pt){
//               // node: {mass:#, p:{x,y}, name:"", data:{}}
//               // pt:   {x:#, y:#}  node position in screen coords
//               
//
//               // determine the box size and round off the coords if we'll be 
//               // drawing a text label (awful alignment jitter otherwise...)
//               var label = node.data.label||""
//               var w = ctx.measureText(""+label).width + 10
//               if (!(""+label).match(/^[ \t]*$/)){
//                 pt.x = Math.floor(pt.x)
//                 pt.y = Math.floor(pt.y)
//               }else{
//                 label = null
//               }
//               
//               // draw a rectangle centered at pt
//               if (node.data.color) ctx.fillStyle = node.data.color
//               // else ctx.fillStyle = "#d0d0d0"
//               else ctx.fillStyle = "rgba(0,0,0,.2)"
//               if (node.data.color=='none') ctx.fillStyle = "white"
//               
//               
//               // ctx.fillRect(pt.x-w/2, pt.y-10, w,20)
//               if (node.data.shape=='dot'){
//                  gfx.oval(pt.x-w/2, pt.y-w/2, w,w, {fill:ctx.fillStyle})
//                  nodeBoxes[node.name] = [pt.x-w/2, pt.y-w/2, w,w]
//               }else{
//                 gfx.rect(pt.x-w/2, pt.y-10, w,20, 4, {fill:ctx.fillStyle})
//                 nodeBoxes[node.name] = [pt.x-w/2, pt.y-11, w, 22]
//               }
//
//               // w = Math.max(20,w)
//
//               // draw the text
//               if (label){
//                 ctx.font = "12px Helvetica"
//                 ctx.textAlign = "center"
//                 ctx.fillStyle = "white"
//                 if (node.data.color=='none') ctx.fillStyle = '#333333'
//                 ctx.fillText(label||"", pt.x, pt.y+4)
//                 ctx.fillText(label||"", pt.x, pt.y+4)
//               }
//             })    			
//
//
//             ctx.strokeStyle = "#cccccc"
//             ctx.lineWidth = 1
//             ctx.beginPath()
//             particleSystem.eachEdge(function(edge, pt1, pt2){
//               // edge: {source:Node, target:Node, length:#, data:{}}
//               // pt1:  {x:#, y:#}  source position in screen coords
//               // pt2:  {x:#, y:#}  target position in screen coords
//
//               var weight = edge.data.weight
//               var color = edge.data.color
//               
//               // trace(color)
//               if (!color || (""+color).match(/^[ \t]*$/)) color = null
//
//               // find the start point
//               var tail = intersect_line_box(pt1, pt2, nodeBoxes[edge.source.name])
//               var head = intersect_line_box(tail, pt2, nodeBoxes[edge.target.name])
//
//               ctx.save() 
//                 ctx.beginPath()
//
//                 if (!isNaN(weight)) ctx.lineWidth = weight
//                 if (color) ctx.strokeStyle = color
//                 // if (color) trace(color)
//                 ctx.fillStyle = null
//               
//                 ctx.moveTo(tail.x, tail.y)
//                 ctx.lineTo(head.x, head.y)
//                 ctx.stroke()
//               ctx.restore()
//               
//               // draw an arrowhead if this is a -> style edge
//               if (edge.data.directed){
//                 ctx.save()
//                   // move to the head position of the edge we just drew
//                   var wt = !isNaN(weight) ? parseFloat(weight) : ctx.lineWidth
//                   var arrowLength = 6 + wt
//                   var arrowWidth = 2 + wt
//                   ctx.fillStyle = (color) ? color : ctx.strokeStyle
//                   ctx.translate(head.x, head.y);
//                   ctx.rotate(Math.atan2(head.y - tail.y, head.x - tail.x));
//
//                   // delete some of the edge that's already there (so the point isn't hidden)
//                   ctx.clearRect(-arrowLength/2,-wt/2, arrowLength/2,wt)
//
//                   // draw the chevron
//                   ctx.beginPath();
//                   ctx.moveTo(-arrowLength, arrowWidth);
//                   ctx.lineTo(0, 0);
//                   ctx.lineTo(-arrowLength, -arrowWidth);
//                   ctx.lineTo(-arrowLength * 0.8, -0);
//                   ctx.closePath();
//                   ctx.fill();
//                 ctx.restore()
//               }
//             }),
             
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
	    //sys = arbor.ParticleSystem(3000,600,0.99);
	    sys = arbor.ParticleSystem();
        //sys.parameters({stiffness: 900,repulsion: 2000,gravity: true,dt: 0.015});
	    sys.parameters({stiffness: 200,repulsion: 10,gravity: false,dt: 0.010});
	    // use center-gravity to make the graph settle nicely (ymmv)
	    sys.parameters({gravity:true}); 
	    
	    // our newly created renderer will have its .init() method called shortly by sys...
	    sys.renderer = Renderer("#viewport"); 
	    	    
	    // add some nodes to the graph and watch it go...
//	    sys.addEdge("a",'apple');
//	    sys.addEdge('a','google');
//	    sys.addEdge('a','jojo');
//	    sys.addEdge('a','samsung');
	    //sys.addNode('f', {alone:true, mass:.25})
	
//	    //add node
//	    node1 = sys.addNode("subject");
//	    node2 = sys.addNode("another");
//	    node3 = sys.addNode("predicate");
//	    node4 = sys.addNode("mynode", {mass:2, myColor:"goldenrod"});
//	    
//	    //add edge
//	    edge1 = sys.addEdge(node1, node2, node3, {length:.75, pointSize:3});

	    //different way 	
//	    sys.graft({
//	   
//	      nodes:{A:{color:"red", shape:"dot", alpha:1}, 
//		      B:{color:"#b2b19d", shape:"dot", alpha:1}, 
//		      C:{color:"#b2b19d", shape:"dot", alpha:1}, 
//		      D:{color:"#b2b19d", shape:"dot", alpha:1},
//		      E:{color:"#b2b19d", shape:"dot", alpha:1},
//		      F:{color:"#b2b19d", shape:"dot", alpha:1},
//		      G:{color:"#b2b19d", shape:"dot", alpha:1},
//		      },
//		      
//	      edges:{
//	    	  A:{
//	          B:{length:.8, data:{name:"A->B"}},
//	          C:{length:.8, data:{name:"A->C"}},
//	          D:{length:.8, data:{name:"A->D"}},
//	          E:{length:.8, data:{name:"A->E"}},
//	          F:{length:.8, data:{name:"A->F"}},
//	          G:{length:.8, data:{name:"A->G"}}
//	           }
//	      }
//	    });
	    

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