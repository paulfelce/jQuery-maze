var canMove;
var inMaze = false;
var entryX;
var entryY;
var canvas = document.getElementById("mazecanvas");
var context = canvas.getContext("2d");
var currRectX = 0;
var currRectY = 0;

//Maze parameters
var columns = 10;
var rows = 10;
var pathWidth = 20;
var rectSize = pathWidth;
var wallWidth = 2;
var straightLinePercentage = 5; //higher is easier

var moveDistance =(pathWidth + wallWidth)/2;
console.log("move: " +moveDistance);
var bottom = ((pathWidth + wallWidth)*rows)+pathWidth-wallWidth;
console.log("Bot"+ bottom);
var right = ((pathWidth + wallWidth)*columns)+pathWidth-wallWidth;
console.log("right"+ right);

var mazeWidth = right+(2*rectSize);
var mazeHeight = bottom+(2*rectSize);

function drawMazeAndRectangle(rectX, rectY) {
	makeWhite(0, 0, canvas.width, canvas.height);
	var mazeImg = new Image();
	mazeImg.onload = function () {
		context.drawImage(mazeImg, 0, 0);
		drawRectangle(rectX, rectY, "#0000FF");
	};
	var ImgSrc = "http://www.hereandabove.com/cgi-bin/maze?"+columns+"+"+rows+"+"+pathWidth+"+"+wallWidth+"+"+straightLinePercentage+"+0+0+0+255+255+255";
	 //http://www.hereandabove.com/maze/mazeorig.form.html; 
	
	 //from web:
	 mazeImg.src = ImgSrc;
	 // for local img:
	 //mazeImg.src = "maze.gif";
	 //if using local img ensure Maze parameters match img
}
function drawRectangle(x, y, style) {
	makeWhite(currRectX, currRectY, rectSize, rectSize);
	currRectX = x;
	currRectY = y;
	context.beginPath();
	context.rect(x, y, rectSize, rectSize);
	context.closePath();
	context.fillStyle = style;
	context.fill();
}
function moveRect(e) {
	var newX;
	var newY;
	var movingAllowed;
	e = e || window.event;
	switch (e.keyCode) {
		case 38:   // arrow up key
		case 87: // W key
			newX = currRectX;
			newY = currRectY - moveDistance;
			break;
		case 37: // arrow left key
		case 65: // A key
			newX = currRectX - moveDistance;
			newY = currRectY;
			break;
		case 40: // arrow down key
		case 83: // S key
			newX = currRectX;
			newY = currRectY + moveDistance;
			break;
		case 39: // arrow right key
		case 68: // D key
			newX = currRectX + moveDistance;
			newY = currRectY;
			break;
	}
	
	if (currRectX >= pathWidth && currRectY >= pathWidth && currRectX <= right && currRectY <= bottom && inMaze===false){
		inMaze = true;
		entryX = currRectX;
		entryY = currRectY;
		console.log("INMAZE");
	}
	
	
	movingAllowed = canMoveTo(newX, newY);
	if (movingAllowed === 1) { // 1 means 'the rectangle can move'
		drawRectangle(newX, newY, "#0000FF");
		currRectX = newX;
		currRectY = newY;
	}
	else if (movingAllowed === 2) { // 2 means 'the rectangle reached the end point'
		//<<<<<FINISHED>>>>>
		$('.next').addClass("active");
		window.removeEventListener("keydown", moveRect, true);
	}
	
}
function canMoveTo(destX, destY) {
	var imgData = context.getImageData(destX, destY, rectSize, rectSize);
	var data = imgData.data;
	canMove = 1; // 1 means: the rectangle can move
	if (destX >= 0 && destX <= mazeWidth - rectSize && destY >= 0 && destY <= mazeHeight - rectSize) {
		for (var i = 0; i < 4 * rectSize * rectSize; i += 4) {
			if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) { // black
				canMove = 0; // 0 means: the rectangle can't move
				break;
			}
			
			else if ((currRectX <= pathWidth || currRectY <= pathWidth || currRectX >= right || currRectY >= bottom) && inMaze===true) {
				canMove = 2;
				if(entryX === currRectX || entryY === currRectY){
					
					canMove = 1; // 2 means: the end point is reached
					console.log("NU");
				}
				console.log("Exit");
				console.log("canMove"+canMove);
				inMaze = false;
			}
		}
	}
	else {
		canMove = 0;
	}
	return canMove;
}

function makeWhite(x, y, w, h) {
	context.beginPath();
	context.rect(x, y, w, h);
	context.closePath();
	context.fillStyle = "white";
	context.fill();
}
drawMazeAndRectangle(0, 0);
window.addEventListener("keydown", moveRect, true);