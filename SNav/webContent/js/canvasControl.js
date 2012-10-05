var canvas;
var ctx;
var personArray = new Array();	//작업자 배열
var todoArray = new Array();	//할일 배열
var elementDowned = null;
var mouseDowned = false;
var canvasCurX = 0;
var canvasCurY = 0;

/**
 * 작업자 클래스
 */
function personClass(x, y, name){
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
	this.img = new Image();
	this.img.src = 'image/person.png';
	this.selected = false;
	this.name = name;
}

/**
 * 할일 클래스
 */
function todoClass(x, y, todo, start, finish){
	this.x = x;
	this.y = y;
	this.width = 200;
	this.height = 50;
	this.img = new Image();
	this.img.src = 'image/todo.png';
	this.selected = false;
	this.todo = todo;	//할일
	this.start = start;	//시작일자
	this.finish = finish;	//종료일자
}

/**
 * 캔버스에 이벤트를 등록한다.
 */
function canvasAddEvent(){
	canvas = document.getElementById('ctx_canvas');
	ctx = document.getElementById('ctx_canvas').getContext('2d');
	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mouseup', mouseUp, false);
	canvas.addEventListener('mousedown', mouseDown, false);
}

/**
 * 캔버스에 이벤트를 제거한다
 */
function canvasRemoveEvent(){
	canvas = document.getElementById('ctx_canvas');
	ctx = document.getElementById('ctx_canvas').getContext('2d');
	canvas.removeEventListener('mousemove', mouseMove, false);
	canvas.removeEventListener('mouseup', mouseUp, false);
	canvas.removeEventListener('mousedown', mouseDown, false);
}

/**
 * 마우스 움직임에 관련된 함수
 */
function mouseMove(ev){
	//커서의 위치정보를 가져온다
	var curX = ev.pageX;
	var curY = ev.pageY;
	canvasCurX = curX - document.getElementById('canvas').offsetLeft - document.getElementById('bound').offsetLeft;
	canvasCurY = curY - document.getElementById('canvas').offsetTop - document.getElementById('bound').offsetTop;

	//선택 기능
	if(toolSelected == 1 && addSelected == -1 && mouseDowned == false){
		if(cursorOnElement(canvasCurX, canvasCurY)){
			document.getElementById('bound').style.cursor = 'move';
		}
		else{
			document.getElementById('bound').style.cursor = 'default';
		}
	}
	//위치 이동
	if(toolSelected == 1 && addSelected == -1 && mouseDowned == true){
		elementDowned.x = canvasCurX - elementDowned.width/2;
		elementDowned.y = canvasCurY - elementDowned.height/2;
		drawAll();
	}
}

/**
 * 마우스가 올라갔을 때
 */
function mouseUp(ev){
	//커서의 위치정보를 가져온다
	var curX = ev.pageX;
	var curY = ev.pageY;
	canvasCurX = curX - document.getElementById('canvas').offsetLeft - document.getElementById('bound').offsetLeft;
	canvasCurY = curY - document.getElementById('canvas').offsetTop - document.getElementById('bound').offsetTop;

	//추가 리스트를 선택한 상태에서 캔버스를 클릭하였을 때
	if(addSelected != -1 && mouseDowned == false){
		//사용자 정보 입력 팝업을 띄움
		if(addSelected == 1){
			var personPopup = document.getElementById('personPopup');
			document.getElementById('personName').value = '';
			personPopup.style.display = 'block';
			windowRemoveEvent();
		}
		//할일 정보 입력 팝업을 띄움
		else if(addSelected == 2){
			var todoPopup = document.getElementById('todoPopup');
			document.getElementById('todoTask').value = '';
			document.getElementById('todoStart').value = '';
			document.getElementById('todoFinish').value = '';
			todoPopup.style.display = 'block';
			windowRemoveEvent();
		}
		document.getElementById('bound').style.cursor = 'default';
		addSelected = -1;
	}
	//위치 이동 끝냄
	if(addSelected == -1 && toolSelected == 1 && mouseDowned == true){
		elementDowned = null;
		mouseDowned = false;
	}
	drawAll();
}

/**
 * 마우스가 눌렸을 때
 */
function mouseDown(ev){
	//커서의 위치정보를 가져온다
	var curX = ev.pageX;
	var curY = ev.pageY;
	canvasCurX = curX - document.getElementById('canvas').offsetLeft - document.getElementById('bound').offsetLeft;
	canvasCurY = curY - document.getElementById('canvas').offsetTop - document.getElementById('bound').offsetTop;

	//선택모드 일 때
	if(addSelected == -1 && toolSelected == 1 && mouseDowned == false){
		for(var i = 0; i < personArray.length; i++)
			personArray[i].selected = false;
		for(var i = 0; i < todoArray.length; i++)
			todoArray[i].selected = false;
		if(elementDowned = cursorOnElement(canvasCurX, canvasCurY)){
			elementDowned.selected = true;
			mouseDowned = true;
		}
	}
}

/**
 * personArray, todoArray에 있는 정보를 읽어서 캔버스에 그린다
 */
function drawAll(){
	ctx.clearRect(0, 0, document.getElementById('ctx_canvas').width, document.getElementById('ctx_canvas').height);
	
	//작업자 그리기
	for(var i = 0; i < personArray.length; i++){
		var midX = personArray[i].x + (personArray[i].width/2);

		if(personArray[i].selected == true){
			ctx.strokeStyle = 'rgb(0,0,0)';
			//테두리
			ctx.beginPath();
			ctx.moveTo(personArray[i].x, personArray[i].y);
			ctx.lineTo(personArray[i].x + personArray[i].width, personArray[i].y);
			ctx.lineTo(personArray[i].x + personArray[i].width, personArray[i].y + personArray[i].height);
			ctx.lineTo(personArray[i].x, personArray[i].y + personArray[i].height);
			ctx.lineTo(personArray[i].x, personArray[i].y);
			ctx.stroke();
			ctx.closePath();
			/*
			//크기 변경을 위한 사각형
			ctx.fillStyle = 'rgb(0,0,0)';
			ctx.fillRect(midX-3, personArray[i].y-6, 6, 6);
			ctx.fillRect(personArray[i].x + personArray[i].width, midY-3, 6, 6);
			ctx.fillRect(midX-3, personArray[i].y + personArray[i].height, 6, 6);
			ctx.fillRect(personArray[i].x-6, midY-3, 6, 6);
			*/
		}
		//사용자 이미지를 캔버스에 그린다
		ctx.drawImage(personArray[i].img, personArray[i].x, personArray[i].y, personArray[i].width, personArray[i].height);
		//사용자 이름을 캔버스에 그린다
		var metrics = ctx.measureText(personArray[i].name);
		var fontWidth = metrics.width;
		var fontMidX = fontWidth / 2;
		ctx.font = '12px san-serif';
		ctx.fillText(personArray[i].name, midX - fontMidX, personArray[i].y + personArray[i].height + 15);
	}
	//할일 그리기
	for(var i = 0; i < todoArray.length; i++){
//		var midX = todoArray[i].x + (todoArray[i].width/2);
		var midY = todoArray[i].y + (todoArray[i].height/2);
		if(todoArray[i].selected == true){
			ctx.strokeStyle = 'rgb(0,0,0)';
			//테두리
			ctx.beginPath();
			ctx.moveTo(todoArray[i].x, todoArray[i].y);
			ctx.lineTo(todoArray[i].x + todoArray[i].width, todoArray[i].y);
			ctx.lineTo(todoArray[i].x + todoArray[i].width, todoArray[i].y + todoArray[i].height);
			ctx.lineTo(todoArray[i].x, todoArray[i].y + todoArray[i].height);
			ctx.lineTo(todoArray[i].x, todoArray[i].y);
			ctx.stroke();
			ctx.closePath();
			/*
			//크기 변경을 위한 사각형
			ctx.fillStyle = 'rgb(0,0,0)';
			ctx.fillRect(midX-3, todoArray[i].y-6, 6, 6);
			ctx.fillRect(todoArray[i].x + todoArray[i].width, midY-3, 6, 6);
			ctx.fillRect(midX-3, todoArray[i].y + todoArray[i].height, 6, 6);
			ctx.fillRect(todoArray[i].x-6, midY-3, 6, 6);
			*/
		}
		//할 일 이미지를 캔버스에 그린다
		ctx.drawImage(todoArray[i].img, todoArray[i].x, todoArray[i].y, todoArray[i].width, todoArray[i].height);
		//해야할 일을 캔버스에 그린다
		var metrics = ctx.measureText(todoArray[i].todo);
		var todoWidth = todoArray[i].width - 60;
		var fontWidth = metrics.width;
		ctx.font = '12px san-serif';
		if(fontWidth > todoWidth){
			var strLen = todoArray[i].todo.length;
			todoWidth -= 10;
			while(1){
				var subStr = todoArray[i].todo.substring(0,strLen);
				var subMetrics = ctx.measureText(subStr);
				var subWidth = subMetrics.width;
				if(todoWidth < subWidth)	strLen--;
				else{
					ctx.fillText(subStr + '...', todoArray[i].x+30, midY);
					break;
				}
			}
		}
		else{
			ctx.fillText(todoArray[i].todo, todoArray[i].x+30, midY);
		}
	}
}

/**
 * 마우스 커서가 객체 위에 있는지 검사하는 함수
 */
function cursorOnElement(curX, curY){
	for(var i = 0; i < personArray.length; i++){
		if((personArray[i].x < curX && curX < personArray[i].x+personArray[i].width)
				&& (personArray[i].y < curY && curY < personArray[i].y+personArray[i].height)){
			return personArray[i];
		}
	}
	for(var i = 0; i < todoArray.length; i++){
		if((todoArray[i].x < curX && curX < todoArray[i].x+todoArray[i].width)
				&& (todoArray[i].y < curY && curY < todoArray[i].y+todoArray[i].height)){
			return todoArray[i];
		}
	}
	return null;
}

/**
 * 팝업창에서 확인 버튼이 눌렸을 때 호출되는 함수
 */
function okButton_down(popupId){
	if(popupId == 'personPopup'){
		var personPopup = document.getElementById(popupId);
		var name = document.getElementById('personName').value;
		var add = new personClass(canvasCurX, canvasCurY, String(name));
		personArray.push(add);
		personPopup.style.display = 'none';
	}
	if(popupId == 'todoPopup'){
		var todoPopup = document.getElementById(popupId);
		var task = document.getElementById('todoTask').value;
		var start = document.getElementById('todoStart').value;
		var finish = document.getElementById('todoFinish').value;
		var add = new todoClass(canvasCurX, canvasCurY, String(task), String(start), String(finish));
		todoArray.push(add);
		todoPopup.style.display = 'none';
	}
	windowAddEvent();
	drawAll();
}

/**
 * 팝업창에서 취소 버튼이 눌렸을 때 호출되는 함수
 */
function cancelButton_down(popupId){
	document.getElementById(popupId).style.display = 'none';
	windowAddEvent();
}