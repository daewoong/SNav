window.onload = windowAddEvent;

var TMDowned = false;
var TMDownedTop = 0;
var TMDownedLeft = 0;
var prevX = 0;
var prevY = 0;
var toolSelected = -1;	//1:선택, 2:드래그, 3:연결
var addSelected = -1;	//1:작업자 추가, 2:할일 추가

/**
 * 윈도우 이벤트를 등록한다
 */
function windowAddEvent(){	
	window.addEventListener('mousemove', window_move, false);
	window.addEventListener('mouseup', window_up, false);
	//canvas에도 이벤트 등록
	canvasAddEvent();
}

/**
 * 윈도우 이벤트를 제거한다
 */
function windowRemoveEvent(){
	window.removeEventListener('mousemove', window_move, false);
	window.removeEventListener('mouseup', window_up, false);
	//canvas에도 이벤트 제거
	canvasRemoveEvent();
}

/**
 * 마우스가 down되었을 때의 윈도우 이벤트
 */
function window_down(param){
	TMDownedId = document.getElementById(param);
	prevX = window.event.x;
	prevY = window.event.y;
	TMDownedTop = document.getElementById(param).offsetTop;
	TMDownedLeft = document.getElementById(param).offsetLeft;
	TMDowned = true;
}

/**
 * 마우스가 move 되었을 때의 윈도우 이벤트
 */
function window_move(ev){
	if(TMDowned == true){
		if(document.getElementById('top').offsetHeight <= TMDownedTop){
			TMDownedId.style.top = TMDownedTop + (window.event.y-prevY) + 'px';
			TMDownedId.style.left = TMDownedLeft + (window.event.x-prevX) + 'px';

			TMDownedTop = TMDownedId.offsetTop;
			TMDownedLeft = TMDownedId.offsetLeft;
			prevX = window.event.x;
			prevY = window.event.y;
		}
		else{
			TMDownedId.style.top = document.getElementById('top').offsetHeight + 1 + 'px';
		}
	}
}

/**
 * 마우스가 up 되었을 때의 윈도우 이벤트
 */
function window_up(ev){
	TMDowned = false;
}

/**
 * 도구가 선택 되었을 때의 배경색 변경
 */
function tools_down(param){
	//모든 도구의 배경색을 초기화한다
	for(var i = 1; i < 4; i++){
		var tools = 'tools_' + i;
		document.getElementById(tools).style.background = '#2b2b2b';
	}	
	//클릭된 도구의 배경색을 바꾼다
	document.getElementById(param).style.background = '#828282';
	//어떤 도구가 선택되었는지 변수에 저장한다
	toolSelected = Number(param.charAt(param.length-1));
}

/**
 * 추가리스트가 선택 되었을 때의 이벤트
 */
function adds_down(param){
	var url = "url('cursor/" + param + ".png'), pointer";
	var canvasId = document.getElementById('bound');
	//마우스 커서 모양을 변경한다
	canvasId.style.cursor = url;
	//어떤 추가리스트가 선택되었는지 변수에 저장한다
	addSelected = Number(param.charAt(param.length-1));
}