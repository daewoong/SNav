
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
	var reSearch = 1;	
	var metaLawName = [];
	var findIndex = 0;
	
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
				
				//$('#submitform').attr('title', 'your new title');
				
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
	                //dataMLawName = data.mlawname;
	                dataCount = data.count;
	                
	                //alert(dataMLawName);
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
			var totalSubject = new Array();
			var recomCount = 0;
			var diffSIndex = 0;
			
			//var count = subject.length;
					
			for(var index=1; index<=count; index++){
				
				//search table
//				if(predicate[index] == "조문"){
//					
//					var sTable = document.getElementById("searchResultTable"); 
//					var sRow = sTable.insertRow(1);		
//					var lNumCell = sRow.insertCell(0);
//					lNumCell.innerHTML = object[index];
//					
//					for(var mark=index; mark<=index+1; mark++){
//						if(predicate[mark] == "법명"){
//							var lNameCell = sRow.insertCell(1);
//							lNameCell.innerHTML = object[mark];
//							
//							var search = sRow.insertCell(2);
//						}
//					}
//					
//					//continue;
//					
//				}else if(predicate[index] == "법명"){
//					//continue;	
//				}else if(predicate[index] == "LAW_ID"){
//					continue;
//				}
				
				genSearch.tripleTable(subject[index], predicate[index], object[index]);
						
				
				//make metadata structure
				if(reSearch){
				
					if(subject[index] == subject[next]){
						if(predicate[index] == "법명"){
							metaLawName[diffSIndex] = object[index];
						}
											
					}else{
						totalSubject[recomCount++] = subject[index];	
						diffSIndex++;
					}
					next++;
				}
				
				genSearch.drawingNode(subject[index], object[index], predicate[index], index);
			}
			
			//search table
//			var sTable = document.getElementById("searchResultTable"); 
//			
//			for(var k=0; k<totalSubject.length; k++){
//				
////				alert(totalSubject[k]);
////				alert(metaLawName[k]);
//				
//				var sRow = sTable.insertRow(1);		
//				var lNumCell = sRow.insertCell(0);
//				var lNameCell = sRow.insertCell(1);
//				var search = sRow.insertCell(2);
//				lNumCell.innerHTML = metaLawName[k];
//			}
			
			genSearch.metaTable(totalSubject, findIndex);
			genSearch.recomTable(totalSubject);
											
		},
		
		//need to change parameter
		metaTable:function(totalSubject, findIndex){
							
			//meta search table
			var sTable = document.getElementById("searchResultTable"); 
			
			if(reSearch){
				for(var k=0; k<totalSubject.length; k++){
					
	//				alert(totalSubject[k]);
	//				alert(metaLawName[k]);
					
					var sRow = sTable.insertRow(1);		
					var lNumCell = sRow.insertCell(0);
					var lNameCell = sRow.insertCell(1);
					var search = sRow.insertCell(2);
					lNumCell.innerHTML = metaLawName[k];
				}
			}else{
//				alert("metaTable " + findIndex);
				var sRow = sTable.insertRow(1);		
				var lNumCell = sRow.insertCell(0);
				var lNameCell = sRow.insertCell(1);
				var search = sRow.insertCell(2);
				lNumCell.innerHTML = metaLawName[findIndex];
			}
		},
		
		tripleTable:function(subject, predicate, object){
			
			//triple table
			var table = document.getElementById("resultTable"); 
			var row = table.insertRow(1);
			var sCell = row.insertCell(0);
			var pCell = row.insertCell(1);
			var oCell = row.insertCell(2);
			var kCell = row.insertCell(3);
			
			sCell.innerHTML = subject;
			pCell.innerHTML = predicate;
			oCell.innerHTML = object;		
			kCell.innerHTML = "검색";
			
			//results count
			document.getElementById("count").innerHTML = "( " + count + " )";
			
		},	
		
		recomTable:function(recommendationSubject){
			
			
			//recom table
			for(var rCount=0; rCount < recommendationSubject.length; rCount++){
				var rTable = document.getElementById("recomTable");
				var row = rTable.insertRow(1);
				var rSCell = row.insertCell(0);
				rSCell.innerHTML = recommendationSubject[rCount];;
			}
			
			//table click event
			$('#recomTable td').live("click",function(){
				var originkeyword = $(this).html();
				
				keyword = "search=" + originkeyword;
				reSearch = 0;
				
				for(var metaLawNameIndex=0; metaLawNameIndex<recommendationSubject.length; metaLawNameIndex++){
//					alert("keyword :" + originkeyword);
//					alert("recome keyword :" + recommendationSubject[metaLawNameIndex]);
					if(originkeyword == recommendationSubject[metaLawNameIndex]){
						//need to change parameter
//						alert("recome " + metaLawNameIndex);
						findIndex = metaLawNameIndex;
						genSearch.metaTable(recommendationSubject, findIndex);
						break;
					}
				}
					
//				for(var rCount=0; rCount<recommendationSubject.length; rCount++){
//					document.getElementById("recomTable").deleteRow(1);
//				}
				
				genSearch.tableDataInit();
				genSearch.connectionAgent(keyword);
				
			});
			
		},	
		
		tableDataInit:function(){
			
			for(var index=1; index<=count; index++){				
				document.getElementById("resultTable").deleteRow(1);				
			}
			
//			for(var index=0; index<metaLawName.length; index++){				
//				document.getElementById("searchResultTable").deleteRow(1);				
//			}
			
//			for(var rCount=0; rCount<recommendationSubject.length; rCount++){
//				document.getElementById("recomTable").deleteRow(1);
//			}
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
              
//             var len = edge.data.name.length;
              var edgeName = edge.data.name;
              
//              if(len>=10){
//            	edgeName = edgeName.substring(0,10) + "...";  
//            	
//              }
              
             // alert(len);
             
//              alert(edge.data.name);
              if(edge.data.name == searchTerm){           	  
            	  //italic
                  ctx.fillStyle = "#680000";             	 
                  ctx.font = 'bold 14px Courier';
                  //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                  ctx.fillText (edgeName, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                  
              }else{
            	  //italic
                  ctx.fillStyle = "#5C85AD";            
                  ctx.font = 'bold 14px sans-serif';
                  //ctx.fillText (edge.data.name, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
                  ctx.fillText (edgeName, (pt1.x + pt2.x) / 2, (pt1.y + pt2.y) / 2);
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
              
              var len = node.name.length;
              var nodeName = node.name;
              
              if(len>=12){
            	nodeName = nodeName.substring(0,13) + "...";  
            	
              }
              
              //ctx.fillStyle = "#D6E0EB";
              if(node.name == searchTerm){
	              ctx.fillStyle = "#680000";
	              ctx.font = 'bold 14px sans-serif';
	              ctx.fillText (nodeName, pt.x-15, pt.y);
              }else{
            	  ctx.fillStyle = "gray";
	              ctx.font = 'bold 14px sans-serif';
	              ctx.fillText (nodeName, pt.x-15, pt.y);
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
//            $(canvas).bind('mouseover', handler.over);  
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
//	        alert(id);
	        
	        $(canvas).attr('title', id);  
	        //$.print('sdsdsdd');
	        
            dragged = null;
            
            $(canvas).unbind('mousemove', handler.dragged);           
            $(window).unbind('mouseup', handler.dropped);
            _mouseP = null;

            return false;
          },
          
          over:function(e){
        	  
        	 alert("over");
        	 
//             $(canvas).unbind('mousemove', handler.dragged);    
//             $(canvas).unbind('mouseover', handler.over);  
//             $(window).unbind('mouseup', handler.dropped);

          }
        };
        
	    // start listening
	    $(canvas).mousedown(handler.clicked);
	    $(canvas).mousemove(handler.moved);
	    //$(canvas).mouseover(handler.over);
	        
      }//init mousthandler	  
     
   };//return
   
 };//Renderer
		