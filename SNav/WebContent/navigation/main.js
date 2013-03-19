
/**  main.js  */

var dataSubject = "";
var dataPredicate = "";
var dataObject = "";

var sys;
var count = 0;

/** addEdge */
function addEdge(subject, object, predicate, index){	
		
		//add node
	    node1 = sys.addNode(subject, {mass:2, color:"skyblue"});
	    node2 = sys.addNode(object, {mass:2, color:"yellow"});
	    //node3 = sys.addEdge(predicate,{'index':index});
	    
	    //add edge
	    edge1 = sys.addEdge(node1, node2,{name: predicate, length:.75, pointSize:5});
}
	 
(function($){
	
		var Renderer = function(canvas){
			
		    var canvas = $(canvas).get(0);
		    var ctx = canvas.getContext("2d");
		    var particleSystem;
		    var predicate;
	
		    alert("RDF Triple Loading");
		    
		    var that = {
		      		
		      init:function(system){
		       
		        // save a reference to the particle system for use in the .redraw() loop
		        particleSystem = system;
		
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
		        
		        for(var index=1; index<20; index++){
		        	var x=document.getElementById("result").innerHTML = subject[index];    
		        	addEdge(subject[index], object[index], predicate[index], index);
		        }
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
		              
		            //  italic
		              ctx.fillStyle = "#5C85AD";            
		              ctx.font = '12px sans-serif';
		              //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
		              ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
		
		          });
		
		          particleSystem.eachNode (function (node, pt)
		          {      
				        	         	  
		        	  var w = 15;      	       	             
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
		            
		            //03.18
		              var id = dragged.node.name;
		              
		              alert('node' + id);
		              
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
		 
		    //sys = arbor.ParticleSystem(3000,600,0.99);
		    sys = arbor.ParticleSystem();
	        //sys.parameters({stiffness: 900,repulsion: 2000,gravity: true,dt: 0.015});
		    sys.parameters({stiffness: 200,repulsion: 10,gravity: false,dt: 0.010});
		    // use center-gravity to make the graph settle nicely (ymmv)
		    sys.parameters({gravity:true}); 
		    
		    // our newly created renderer will have its .init() method called shortly by sys...
		    sys.renderer = Renderer("#viewport"); 
		    
		   //asynchronous communications
		    $.ajax({
		    	
		        url : "http://localhost:9090/SNav/SNavAgent",
		        scriptCharset: "UTF-8",
		        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		        data : "keyword=rdftriple",
		        dataType : "jsonp",
		        jsonp : "callback",
		        success: function(data) {
		            if(data != null)    {            	
		                
		                dataSubject = data.subject;
		                dataPredicate = data.predicate;
		                dataObject = data.object;
		                
		               // alert("Subject : " + dataSubject);
		               // alert("Predicate : " + dataPredicate);
		               // alert("Object : " + dataObject);
		               
		            }
		        }
		    });
		    
		    $("#submitButton").click(function(){
		    	
		    	alert("Submitted");
		    	var k = 1;
	
		    	
		    	var Renderer = function(canvas){
		    		
				    var canvas = $(canvas).get(0);
				    var ctx = canvas.getContext("2d");
				    var particleSystem;
				    var predicate;
				   
				    
				    alert("RDF Triple Loading?? submit");
				    
				    var that = {
				      		
				      init:function(system){
				       
				        // save a reference to the particle system for use in the .redraw() loop
				        particleSystem = system;
				
				        // the new dimensions
				        particleSystem.screenSize(canvas.width, canvas.height) ;
				        
				        // leave an extra 80px of whitespace per side
				        particleSystem.screenPadding(80); 
				        
				        // set up some event handlers to allow for node-dragging
				        that.initMouseHandling();  
				        
				        var subject = dataSubject.split(/[\[\,\]]/);      
				        predicate = dataPredicate.split(/[\[\,\]]/);
				        var object = dataObject.split(/[\[\,\]]/);
				        
				        //var count = subject.length;	
				        
				        for(var index=1; index<=count; index++){
				        	var x=document.getElementById("result").innerHTML = subject[index];    
				        	addEdge(subject[index], object[index], predicate[index], index);
				        	
				        }
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
				              
				            //  italic
				              ctx.fillStyle = "#5C85AD";            
				              ctx.font = '12px sans-serif';
				              //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
				              ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
				
				          });
				
				          particleSystem.eachNode (function (node, pt)
				          {      
				        	  
				        	         	  
				        	  var w = 15;      	       	             
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
			    
			    //sys = arbor.ParticleSystem(3000,600,0.99);
			    sys = arbor.ParticleSystem();
		        //sys.parameters({stiffness: 900,repulsion: 2000,gravity: true,dt: 0.015});
			    sys.parameters({stiffness: 200,repulsion: 10,gravity: false,dt: 0.010});
			    // use center-gravity to make the graph settle nicely (ymmv)
			    sys.parameters({gravity:true}); 
			    
			    // our newly created renderer will have its .init() method called shortly by sys...
			    sys.renderer = Renderer("#viewport"); 
			    
			   
		    	$.ajax({  
		    		
		    		type:"post",
		    	    url : "http://localhost:9090/SNav/SNavAgent",
		    	    data : $("form").serialize(),
		    	    contentType: "application/x-www-form-urlencoded; charset=MS949",
		    	    dataType : "jsonp",
		    	    jsonp : "callback",
		    	    
		    	    success: function(data) {
		    	        	if(data != null){            	
		    	            
			    	            dataSubject = data.subject;
			    	            dataPredicate = data.predicate;
			    	            dataObject = data.object;
			    	            count = data.count;
			    	            alert("what submit");
			    	            
			    	             alert("Subject : " + dataSubject);
					             alert("Predicate : " + dataPredicate);
					             alert("Object : " + dataObject);
					             alert("Count : " + count);
			    	           // location.reload();		    	            
		    	        	}
		    	    }
		    	});
			    
		    }); 		    
		 });

})(this.jQuery);




















// add some nodes to the graph and watch it go...
//sys.addEdge("a",'apple');
//sys.addEdge('a','google');
//sys.addEdge('a','jojo');
//sys.addEdge('a','samsung');
//sys.addNode('f', {alone:true, mass:.25})

////add node
//node1 = sys.addNode("subject");
//node2 = sys.addNode("another");
//node3 = sys.addNode("predicate");
//node4 = sys.addNode("mynode", {mass:2, myColor:"goldenrod"});
//
////add edge
//edge1 = sys.addEdge(node1, node2, node3, {length:.75, pointSize:3});

//different way 	
//sys.graft({
//
//  nodes:{A:{color:"red", shape:"dot", alpha:1}, 
//      B:{color:"#b2b19d", shape:"dot", alpha:1}, 
//      C:{color:"#b2b19d", shape:"dot", alpha:1}, 
//      D:{color:"#b2b19d", shape:"dot", alpha:1},
//      E:{color:"#b2b19d", shape:"dot", alpha:1},
//      F:{color:"#b2b19d", shape:"dot", alpha:1},
//      G:{color:"#b2b19d", shape:"dot", alpha:1},
//      },
//      
//  edges:{
//	  A:{
//      B:{length:.8, data:{name:"A->B"}},
//      C:{length:.8, data:{name:"A->C"}},
//      D:{length:.8, data:{name:"A->D"}},
//      E:{length:.8, data:{name:"A->E"}},
//      F:{length:.8, data:{name:"A->F"}},
//      G:{length:.8, data:{name:"A->G"}}
//       }
//  }
//});


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