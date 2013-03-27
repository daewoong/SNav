
/**  gen-search.js  */


jQuery(function($){
	
	genSearch.init();
	
});


var searchTerm = "";

var genSearch = function(){
	
	var sys;
	var dataSubject = "";
	var dataPredicate = "";
	var dataObject = "";
	var dataCount = 0;
	var keyword = "";
	var count = 0;
	var recommendationSubject = new Array();
	
	
	var colorType = {
			root: '#FF003D',
			subject: '#FF003D',
			predicate: '#FF003D',
			object: '#FF003D',
			literal: '#FF003D',
	};
	

	
	return {
		init: function(){
			
			alert("genSearch init");
			
			$("#submitform").submit(function(){
			    	
				alert("Submitted");
				keyword = $("form").serialize();
				searchTerm = document.getElementById("textForm").value;
				genSearch.tableDataInit();
				genSearch.connectionAgent(keyword);
				return false;
			});
						
            //Start the renderer
            //this.sys = arbor.ParticleSystem({friction:1, stiffness:900, repulsion:100, gravity: true, fps: 60, dt: 0.08, precision: 1.0});
			this.sys = arbor.ParticleSystem({stiffness:200, repulsion:10, gravity: true, fps: 60, dt: 0.010});
			this.sys.renderer = Renderer("#viewport");
		}, 

		connectionAgent:function(keyword){
			
			//Clear all previous particles
			this.sys.prune(function(node, from, to){return true;});
			
			$.ajax({  
	    		
	    		type: "post",
	    	    url : "http://localhost:9090/SNav/SNavAgent",
	    	    data : keyword,
	    	    contentType: "application/x-www-form-urlencoded; charset=MS949",
	    	    dataType : "jsonp",
	    	    jsonp : "callback",	    	    
	    	    success: genSearch.querySuccess,
				error : genSearch.queryError,
	    	});
		},
				
		querySuccess:function(data){
			
			alert("query success");
			
	            if(data != null)    {            	
	                
	            	dataSubject = data.subject;
	                dataPredicate = data.predicate;
	                dataObject = data.object;
	                dataCount = data.count;
	                
	                genSearch.dataGenerate();
	            }
		},
		
		queryError:function(){
			 console.warn("There was an error: ");
			
		},
		
		dataGenerate:function(){
			
			alert("triple generating");

			//var rex = /[\[|\,|\s|\]]/;
			var rex = /\[|\,\s|\]/;
			var subject = dataSubject.split(rex);      
			var predicate = dataPredicate.split(rex);
			var object = dataObject.split(rex);
			count = dataCount;
			var next = 2;
			var recomCount = 0;
			
			//var count = subject.length;
		
			
			for(var index=1; index<=count; index++){
				
				var table = document.getElementById("resultTable"); 
				var row = table.insertRow(1);
				var sCell = row.insertCell(0);
				var pCell = row.insertCell(1);
				var oCell = row.insertCell(2);
				var kCell = row.insertCell(3);
				
				sCell.innerHTML = subject[index];
				pCell.innerHTML = predicate[index];
				oCell.innerHTML = object[index];		
				kCell.innerHTML = "검색";
				
				if(subject[index] == subject[next]){
					
				}else{
					recommendationSubject[recomCount++] = subject[index];						
				}
				next++;
				
				genSearch.drawingNode(subject[index], object[index], predicate[index], index);
			}
			
			//results count
			document.getElementById("count").innerHTML = "( " + count + " )";
			
			
			for(var rCount=0; rCount < recommendationSubject.length -1; rCount++){
				var rTable = document.getElementById("recomTable");
				var row = rTable.insertRow(1);
				var rSCell = row.insertCell(0);
				rSCell.innerHTML = recommendationSubject[rCount];;
			}
			
			//table click event
			$('#recomTable td').live("click",function(){
				keyword = $(this).html();
				keyword = "search=" + keyword;
				genSearch.tableDataInit();
				genSearch.connectionAgent(keyword);
				
			});
			
		
			
		},
				
		tableDataInit:function(){
			
			for(var index=1; index<=count; index++){				
				document.getElementById("resultTable").deleteRow(1);				
			}
			for(var index=1; index<=recommendationSubject.length-1; index++){
				document.getElementById("recomTable").deleteRow(1);
			}
		},
		
		drawingNode:function(subject, object, predicate, index){
						
			//add node
		    node1 = this.sys.addNode(subject, {mass:2, color:"skyblue"});
		    node2 = this.sys.addNode(object, {mass:2, color:"yellow"});
		    //node3 = sys.addEdge(predicate,{'index':index});
		    
		    //add edge
		    edge1 = this.sys.addEdge(node1, node2,{name: predicate, length:.75, pointSize:5});
		},
		
		removeNodes: function(name, level){
			
			if(level === 2){
				//Clicked node
				var clicked = sys.getNode(name);
				
				//Clicked parent node
				var parent = sys.getNode(clicked.data.parent);
				
				//Parent is nolonger expanded
				parent.data.expanded = false;
				
				//Remove Children
				sys.prune(function(node, from, to){
					if(node.data.parent === name){
						return true;
					}
				});
				
				//Remove clicked node too
				sys.pruneNode(name);
			}
		}
		
	};
}();

var Renderer = function(canvas){

	var canvas = $(canvas).get(0);
    var ctx = canvas.getContext("2d");
   
    var particleSystem;

    alert("RDF Triple Rendering");
    
    return {
      		
      init:function(system){
    	     	 		    
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system;

        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) ;
        
        // leave an extra 80px of whitespace per side
        particleSystem.screenPadding(80); 
        
        // set up some event handlers to allow for node-dragging
        this.initMouseHandling();  
                  
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
              
//              alert(edge.data.name);
              if(edge.data.name == searchTerm){           	  
            	  //italic
                  ctx.fillStyle = "#680000";             	 
                  ctx.font = 'bold 14px Courier';
                  //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                  ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                  
              }else{
            	  //italic
                  ctx.fillStyle = "#5C85AD";            
                  ctx.font = '14px sans-serif';
                  //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                  ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
              }                        
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
              if(node.name == searchTerm){
	              ctx.fillStyle = "#680000";
	              ctx.font = 'bold 14px sans-serif';
	              ctx.fillText (node.name, pt.x-10, pt.y);
              }else{
            	  ctx.fillStyle = "gray";
	              ctx.font = 'bold 14px sans-serif';
	              ctx.fillText (node.name, pt.x-10, pt.y);
              }
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
	            alert(id);
              
            dragged = null;

            $(canvas).unbind('mousemove', handler.dragged);
            $(window).unbind('mouseup', handler.dropped);
            _mouseP = null;

            return false;
          }
        };
        
	        // start listening
	        $(canvas).mousedown(handler.clicked);
	        $(canvas).mousemove(handler.moved);
	        
      }//init mousthandler	  
     
   };//return
   
 };//Renderer
		