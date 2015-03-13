// Taken from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function updateOutlineColor() {
	var red   = $("#outlineSlider .red").slider("value");
	var green = $("#outlineSlider .green").slider("value");
	var blue  = $("#outlineSlider .blue").slider("value");
	outlineColor = rgbToHex(red, green, blue);
	updateSelected();
}

function updateFillColor() {
	var red   = $("#fillSlider .red").slider("value");
	var green = $("#fillSlider .green").slider("value");
	var blue  = $("#fillSlider .blue").slider("value");
	fillColor = rgbToHex(red, green, blue);
	updateSelected();
}

function updateWidth() {
	outlineWidth = $("#widthSlider .slider").slider("value");
	updateSelected();
}

function updateAlpha() {
	alpha = $("#alphaSlider .slider").slider("value")/100;
	updateSelected();
}

function updateUI() {
	var outlineRGB = hexToRgb(outlineColor);
	$("#outlineSlider .colorSelector .red").slider("value", outlineRGB.r);
	$("#outlineSlider .colorSelector .green").slider("value", outlineRGB.g);
	$("#outlineSlider .colorSelector .blue").slider("value", outlineRGB.b);
	var fillRGB = hexToRgb(fillColor);
	$("#fillSlider .colorSelector .red").slider("value", fillRGB.r);
	$("#fillSlider .colorSelector .green").slider("value", fillRGB.g);
	$("#fillSlider .colorSelector .blue").slider("value", fillRGB.b);
	$("#widthSlider .slider").slider("value", outlineWidth);
	$("#alphaSlider .slider").slider("value", alpha*100);
}
	

$(function() {
	$("#modeMenu").buttonset();
	$("#clear").button();
	$("#delete").button();
	$("#copy").button();
	$("#paste").button();
	$("#outline").button();
	$("#width").button();
	$("#fill").button();
	$("#alpha").button();

	$(".colorSelector").append('<div class="red"/><div class="green"/><div class="blue"/>');

	$("#outline").click(function() {$("#outlineSlider .colorSelector").toggle();});
	$("#outlineSlider .red, #outlineSlider .green, #outlineSlider .blue").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 255,
		slide: updateOutlineColor,
		change: updateOutlineColor
	});
	$("#fill").click(function() {$("#fillSlider .colorSelector").toggle();});
	$("#fillSlider .red, #fillSlider .green, #fillSlider .blue").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 255,
		slide: updateFillColor,
		change: updateFillColor
	});

	$("#width").click(function() {$("#widthSlider .slider").toggle();});
	$("#widthSlider .slider").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		slide: updateWidth,
		change: updateWidth
	});

	$("#alpha").click(function() {$("#alphaSlider .slider").toggle();});
	$("#alphaSlider .slider").slider({
		orientation: "vertical",
		range: "min",
		
		min: 0,
		max: 100,
		slide: updateAlpha,
		change: updateAlpha
	});
	updateUI();
	
	$("#outlineSlider .colorSelector").hide();
	$("#fillSlider .colorSelector").hide();
	$("#widthSlider .slider").hide();
	$("#alphaSlider .slider").hide();
});
