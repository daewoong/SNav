var canvas;
var ctx;
var x = 75;
var y = 50;
var WIDTH = 400;
var HEIGHT = 300;
var dragok = false;

function init() {
	 canvas = document.getElementById("canvas");
	 ctx = canvas.getContext("2d");
	 canvas.onmousedown = myDown;
	 canvas.onmouseup = myUp;
	 return setInterval(draw, 10);
}

function clear() {
	 ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function image(){
	//alert("Canvas Image Test");
	clear();
	var ctx = document.getElementById("canvas").getContext("2d");
	var textHeight = 32;

	ctx.font = textHeight + 'px "맑은 고딕"';
	ctx.fillStyle = "pink";
	ctx.fillRect(x,y,150,100);
	
	ctx.fillStyle = "black";
	ctx.textBaseline = "bottom";
	ctx.fillText("Semantic Navigation",200,150);
	
	var image = new Image();

	image.onload = function(){
		ctx.drawImage(image,0,300 ,300,300);
	};
	image.src = "http://www.nasa.gov/images/content/297522main_image_1244_946-710.jpg";
	
}

function rect(x,y,w,h) {
	 ctx.beginPath();
	 ctx.rect(x,y,w,h);
	 ctx.closePath();
	 ctx.fill();
}

function cirlceImage(x,y,width,height) {
	
	 var image = new Image();
	 
	 image.onload = function(){
			ctx.drawImage(image,x,y,width, height);
	 };
	 
	 image.src = "http://www.psdgraphics.com/wp-content/uploads/2009/04/light-blue-circle.jpg";
	// image.src = "images/Navigation.jpg";

}

function draw() {
	/*
	 clear();
	 ctx.fillStyle = "#FAF7F8";
	 rect(0,0,canvas.width,canvas.height); //WIDTH,HEIGHT);
	 ctx.fillStyle = "#7FAFE0";
	 rect(x - 15, y - 15, 30, 30);
	 rect(x - 95, y - 15, 30, 30);
	 */
	clear();
	cirlceImage(x-15,y-15,50,40);
	
}

function myMove(e){
	 if (dragok){
		x = e.pageX - canvas.offsetLeft;
		y = e.pageY - canvas.offsetTop;
	 }
}

function myDown(e){
	 if (e.pageX < x + 15 + canvas.offsetLeft && e.pageX > x - 15 +
	 canvas.offsetLeft && e.pageY < y + 15 + canvas.offsetTop && e.pageY > y -15 + canvas.offsetTop){
		x = e.pageX - canvas.offsetLeft;
		y = e.pageY - canvas.offsetTop;
		dragok = true;
		canvas.onmousemove = myMove;
	 }
}

function myUp(){
	 dragok = false;
	 canvas.onmousemove = null;
}
