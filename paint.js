function Shape(x, y) {
	this.x = x;
	this.y = y;
	this.sx = x;
	this.sy = y;
	this.updateAttributes();
}
Shape.prototype.move = function(x, y) {
	this.x = x;
	this.y = y;
	this.setSelector();
}
Shape.prototype.updateAttributes = function () {
	this.outlineColor = outlineColor;
	this.fillColor    = fillColor;
	this.outlineWidth = outlineWidth;
	this.alpha        = alpha;
}
Shape.prototype.setDrawAttributes = function(context) {
	context.globalAlpha = this.alpha;
	context.fillStyle   = this.fillColor;
	context.strokeStyle = this.outlineColor;
	context.lineWidth   = this.outlineWidth;
}
Shape.prototype.drawSelector = function(context) {
	context.globalAlpha = 1;
	context.fillStyle   = "red"
	context.strokeStyle = "black"
	context.lineWidth   = 2;
	context.beginPath();
	context.arc(this.sx, this.sy, 6, 0, Math.PI*2);
	context.fill();
	context.stroke();
}
Shape.prototype.selectorContains = function(x, y) {
	return (Math.sqrt(Math.pow(x-this.sx, 2) + Math.pow(y-this.sy, 2)) <= 6);
}

function Line(x, y) {
	Shape.call(this, x, y);
	this.dx  = 0;
	this.dy  = 0;
	this.nx  = 0;
	this.ny  = 0;
}
Line.prototype = new Shape();
Line.prototype.constructor = Line;
Line.prototype.resize = function(x, y) {
	this.dx = x - this.x;
	this.dy = y - this.y;
	this.setSelector();
}
Line.prototype.setSelector = function() {
	this.sx = this.x + this.dx;
	this.sy = this.y + this.dy;
}
Line.prototype.draw = function(context) {
	this.setDrawAttributes(context);
	context.beginPath();
	context.moveTo(this.x, this.y);
	context.lineTo(this.x + this.dx, this.y + this.dy);
	context.stroke();
}
Line.prototype.contains = function(x, y) {
	var n  = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
	var dv = Math.sqrt(this.dx*(x-this.x) + this.dy*(y-this.y));
	var dn = Math.abs((x-this.x)*(-this.dy/n) + (y-this.y)*(this.dx/n));
	return (dn <= Math.max(this.outlineWidth/2, 4) && dv >= 0 && dv <= n);
}

function Rectangle(x, y) {
	Shape.call(this, x, y);
	this.dx = 0;
	this.dy = 0;
}
Rectangle.prototype = new Shape();
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.resize = function(x, y) {
	this.dx = x - this.x;
	this.dy = y - this.y;
	this.setSelector();
}
Rectangle.prototype.setSelector = function() {
	this.sx = this.x + this.dx;
	this.sy = this.y + this.dy;
}
Rectangle.prototype.draw = function(context) {
	this.setDrawAttributes(context);
	context.beginPath();
	context.rect(this.x, this.y, this.dx, this.dy);
	context.fill();
	context.stroke();
}
Rectangle.prototype.contains = function(x, y) {
	var w = this.outlineWidth/2;
	return (
		((x > this.x-w && x < this.x+this.dx+w) || (x-w < this.x && x > this.x+this.dx+w))  && 
		((y > this.y-w && y < this.y+this.dy+w) || (y < this.y-w && y > this.y+this.dy+w)));
}

function Circle(x, y) {
	Shape.call(this, x, y);
	this.r = 0;
}
Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;
Circle.prototype.resize = function(x, y) {
	this.r = Math.sqrt(Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2));
	this.setSelector();
}
Circle.prototype.setSelector = function() {
	this.sx = this.x;
	this.sy = this.y - this.r;
}
Circle.prototype.draw = function(context) {
	this.setDrawAttributes(context);
	context.beginPath();
	context.arc(this.x, this.y, this.r, 0, Math.PI*2);
	context.fill();
	context.stroke(); 
}
Circle.prototype.contains = function(x, y) {
	return (Math.sqrt(Math.pow(x-this.x, 2) + Math.pow(y-this.y, 2)) <= this.r + this.outlineWidth/2)
}


var mainCanvas;
var mainContext;
var selectedCanvas;
var selectedContext;
var shapes = [];
var selectedShape = null;
var copiedShape = null;

function drawMain() {
	mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	for(var i = 0; i < shapes.length; i++)
		shapes[i].draw(mainContext);
}
function drawSelected() {
	selectedContext.clearRect(0, 0, selectedCanvas.width, selectedCanvas.height);
	if (selectedShape != null) {
		selectedShape.draw(selectedContext);
		selectedShape.drawSelector(selectedContext);
	}
}
function clearCanvas() {
	shapes = [];
	selectedShape = null;
	drawMain();
	drawSelected();
}

var mode         = 0;
var outlineColor = "#000000";
var fillColor    = "#FFFFFF";
var outlineWidth = 2;
var alpha        = 0.85;

var mouseDown    = false;
var offsetX      = 0;
var offsetY      = 0;
var resizing     = false;

function setMode(newMode) {
	mode = newMode;
}
function updateSelected() {
	if (selectedShape != null)
		selectedShape.updateAttributes();
	drawSelected();
}

function mouseDownHandler(e) {
	mouseDown = true;
	var x = e.pageX - canvas.offsetLeft - 1;
	var y = e.pageY - canvas.offsetTop - 1;

	if (mode == 0 && selectedShape != null && selectedShape.selectorContains(x, y)) {
		resizing = true;
		return;
	}

	if (selectedShape != null) {
		shapes.push(selectedShape);
		selectedShape = null;
	}
	switch(mode) {
		case 0:
			for(var i = shapes.length-1; i >= 0 && selectedShape == null; i--) {
				if (shapes[i].contains(x, y)) {
					selectedShape = shapes.splice(i,1)[0];
					offsetX = selectedShape.x - x;
					offsetY = selectedShape.y - y;
					outlineColor = selectedShape.outlineColor;
					fillColor    = selectedShape.fillColor;
					outlineWidth = selectedShape.outlineWidth;
					alpha        = selectedShape.alpha;
					updateUI();
				}
			}
			break;
		case 1:
			selectedShape = new Line(x, y);
			break;
		case 2:
			selectedShape = new Rectangle(x, y);
			break;
		case 3:
			selectedShape = new Circle(x, y);
			break;
	}
	drawMain();
	drawSelected();
}

function mouseMoveHandler(e) {
	var x = e.pageX - canvas.offsetLeft - 1;
	var y = e.pageY - canvas.offsetTop - 1;
	if (mouseDown && selectedShape != null) {
		if (mode == 0) {
			if (resizing) 
				selectedShape.resize(x, y);
			else 
				selectedShape.move(x + offsetX, y + offsetY);
		}
		else {
			selectedShape.resize(x, y);
		}
		drawSelected();
	}
}

function mouseUpHandler(e) {
	mouseDown = false;
	resizing = false;
}

function copyShape() {
	copiedShape = jQuery.extend(true, {}, selectedShape);
}

function pasteShape() {
	if (selectedShape != null)
		shapes.push(selectedShape);
	selectedShape = jQuery.extend(true, {}, copiedShape);
	drawMain();
	drawSelected();
}

function deleteShape() {
	selectedShape = null;
	drawSelected();
}

$(function() {
	mainCanvas = document.getElementById("mainCanvas");
	mainContext = mainCanvas.getContext("2d");
	mainContext.stroke();

	selectedCanvas = document.getElementById("selectedCanvas");
	selectedContext = selectedCanvas.getContext("2d");
	selectedCanvas.onmousedown = mouseDownHandler;
	selectedCanvas.onmouseup   = mouseUpHandler;
	selectedCanvas.onmousemove = mouseMoveHandler;
	selectedContext.stroke();
});

