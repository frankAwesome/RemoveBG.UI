var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var BGimage = "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmxvY2slMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80";
var FGimage = "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODUwMTAwNXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=420&q=60";

var backgroundUpload = document.getElementById("background-upload");
var imageUpload = document.getElementById("image-upload");

// Download the canvas as an image when the user clicks the download button
var downloadBtn = document.getElementById("download-btn");

canvas.style = "background: red;";

// Load the image
var img = new Image();
img.crossOrigin = 'Anonymous';
img.src = "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODUwMTAwNXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=420&q=60";

// Set initial position and size of image
var imgX = canvas.width/2 - img.width/2;
var imgY = canvas.height/2 - img.height/2;
var imgWidth = img.width/2;
var imgHeight = img.height/2;

// Draw the image on the canvas
ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

// Resize the image when the user clicks and drags the bottom right corner of the image
var isResizing = false;
canvas.addEventListener("mousedown", function(e) {
    if (e.offsetX >= imgX + imgWidth - 10 && e.offsetX <= imgX + imgWidth && e.offsetY >= imgY + imgHeight - 10 && e.offsetY <= imgY + imgHeight) {
        isResizing = true;
    }
});

canvas.addEventListener("mouseup", function(e) {
    isResizing = false;
});

canvas.addEventListener("mousemove", function(e) {
    if (isResizing) {
        imgWidth = e.offsetX - imgX;
        imgHeight = e.offsetY - imgY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    }
});

// Load the resizable/movable image when the user selects a file
imageUpload.addEventListener("change", function() {
    // Load the selected file as a data URL
    var reader = new FileReader();
    reader.onload = function(event) {
        // img.src = "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODUwMTAwNXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=420&q=60";
        img.src = event.target.result;
        FGimage = event.target.result;
        // Set initial position and size of image
        // Set initial position and size of image
        imgX = canvas.width/2 - img.width/2;
        imgY = canvas.height/2 - img.height/2;
        imgWidth = img.width/2;
        imgHeight = img.height/2;

        // Draw the image on the canvas
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight)

    };
    reader.readAsDataURL(imageUpload.files[0]);
});

// Load the background image when the user selects a file
backgroundUpload.addEventListener("change", function() {
    // Load the selected file as a data URL
    var reader = new FileReader();
    reader.onload = function(event) {
        BGimage = event.target.result;
        canvas.style = "background: url(\'" + event.target.result + "\'); background-repeat: no-repeat;";
        
    };
    reader.readAsDataURL(backgroundUpload.files[0]);
});

// Move the image when the user clicks and drags anywhere on the image
var isDragging = false;
var prevX, prevY;
canvas.addEventListener("mousedown", function(e) {
    if (e.offsetX >= imgX && e.offsetX <= imgX + imgWidth && e.offsetY >= imgY && e.offsetY <= imgY + imgHeight) {
        isDragging = true;
        prevX = e.offsetX;
        prevY = e.offsetY;
    }
});

canvas.addEventListener("mouseup", function(e) {
    isDragging = false;
    isResizing = false;
});

canvas.addEventListener("mousemove", function(e) {
    if (isDragging && !isResizing) {
        var deltaX = e.offsetX - prevX;
        var deltaY = e.offsetY - prevY;
        imgX += deltaX;
        imgY += deltaY;
        prevX = e.offsetX;
        prevY = e.offsetY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

        
    }
});



download_img = function(el) {

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    const link = document.createElement('a');
    link.download = 'download.png';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var img3 = new Image();
    img3.crossOrigin = 'Anonymous';
    img3.src = BGimage

    var saveWidth = img3.height / 800 * img.width;

    ctx.drawImage(img3, 0, 0, 800, 800)
    


    var img2 = new Image();
    img2.crossOrigin = 'Anonymous';
    img2.src = FGimage
    ctx.drawImage(img2, imgX, imgY, imgWidth, imgHeight)

    link.href = canvas.toDataURL();
    link.click();
    link.delete;
};