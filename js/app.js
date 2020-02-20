import Translation from './translation.class.js';

function getRadius(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

var canvas = new fabric.Canvas('canvas');
canvas.selection = false;
canvas.preserveObjectStacking = true;
var translation = new Translation(canvas);

var imageUrl = './images/background.jpg';
canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
    // Optionally add an opacity lvl to the image
    backgroundImageOpacity: 0.5,
    // should the image be resized to fit the container?
    backgroundImageStretch: false
});
console.log(canvas.getWidth(), canvas.getHeight());
var context = canvas.getContext("2d");
console.log("Starting app.js ..... ");


var startPosition, isDown, currentPositionX, currentPositionY, tool = 'select', savedData;
var rect, circle, triangle;

var download = document.querySelector('#download');
download.addEventListener('click', function () {
    processDownload();  //Original
    translation.translateTop(); //Top
    processDownload();
    translation.translateDown();
    translation.translateDown();   // Down
    processDownload();
    translation.translateTop();
    translation.translateLeft();    //Left
    processDownload();
    translation.translateRight();
    translation.translateRight();   // Right
    processDownload();
    translation.translateLeft();
    
    //Rotate Left and shift top down left right
    translation.translateRotateLeft(); //Rotate Left
    processDownload();
    translation.translateTop(); //Top
    processDownload();
    translation.translateDown();
    translation.translateDown();   // Down
    processDownload();
    translation.translateTop();
    translation.translateLeft();    //Left
    processDownload();
    translation.translateRight();
    translation.translateRight();   // Right
    processDownload();
    translation.translateLeft();

    translation.translateRotateRight(); //Rotate Right to get original image

    //Rotate Right and shift left right top down
    translation.translateRotateRight(); //Rotate Right
    processDownload();
    translation.translateTop(); //Top
    processDownload();
    translation.translateDown();
    translation.translateDown();   // Down
    processDownload();
    translation.translateTop();
    translation.translateLeft();    //Left
    processDownload();
    translation.translateRight();
    translation.translateRight();   // Right
    processDownload();
    translation.translateLeft();
    translation.translateRotateLeft(); //Rotate Left to get original image
    //doneDownload();
    zipDownloads();
});
var links = [];
function processDownload() {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = canvas.toDataURL("image/jpg");
    a.download = 'myimg.jpg';
    links.push(a.href.replace(/^data:image\/(png|jpg);base64,/, ""));
    //links.push(a.href);
    //console.log(a.href);
    //a.click();
    document.body.removeChild(a);
}
function zipDownloads() {
    var zip = new JSZip();
    //zip.folder("images");
    var img = zip.folder("images");
    var ind = 1;
    console.log(links.length);
    for ( var i = 0; i < links.length; i++){
        console.log('hello bangladesh');
        img.file('mmp'+ind.toString()+'.jpg', links[i], {base64: true});
        console.log(ind);
        ind += 1;
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
        content.download = 'download';
        saveAs(content, "mmd1.zip");
    });
}


$("#select").click(function () {
    mode = "select";
    canvas.selection = true;
    canvas.perPixelTargetFind = true;
    canvas.targetFindTolerance = 4;
    canvas.renderAll();
});

$("#removeall").click(function () {
    canvas.clear();
    var imageUrl = './images/background.jpg';
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
        // Optionally add an opacity lvl to the image
        backgroundImageOpacity: 0.5,
        // should the image be resized to fit the container?
        backgroundImageStretch: false
    });
    //document.getElementById("inpform").reset();
    var inputArray = document.querySelectorAll('input');
    inputArray.forEach(function (input) {
        input.value = "";
    });

});


$("#back").click(function () {
    console.log('back button alert');
    canvas.sendToBack(canvas.getActiveObject());
    canvas.renderAll();
});

function openImage() {
    document.getElementById('open').onchange = function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                var image = new fabric.Image(imgObj);
                image.set({
                    angle: 0,
                    padding: 10,
                    cornersize: 10,

                    selectable: false
                });
                canvas.centerObject(image);
                canvas.add(image);
                canvas.sendToBack(image);
                canvas.renderAll();
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }
}
function deleteObjects() {
    canvas.remove(canvas.getActiveObject());
}


canvas.on('mouse:down', function (event) {
    isDown = true;
    if (tool == 'select') {
        // canvas.selection = true;
        // canvas.forEachObject(function (event) {
        //     event.selectable = true;
        // });
        // canvas.renderAll();
    } else {
        var pointer = canvas.getPointer(event.e);
        startPosition = { x: pointer.x, y: pointer.y };
        var pointer = canvas.getPointer(event.e);
        if (tool == 'rectangle') {
            rect = new fabric.Rect({
                left: startPosition.x,
                top: startPosition.y,
                originX: 'left',
                originY: 'top',
                width: pointer.x - startPosition.x,
                height: pointer.y - startPosition.y,
                stroke: 'black',
                fill: 'rgba(0,0,0,0)',
                selectable: false
            });
            canvas.add(rect);
        } else if (tool == 'circle') {
            circle = new fabric.Ellipse({
                left: startPosition.x,
                top: startPosition.y,
                originX: 'left',
                originY: 'top',
                rx: 0,
                ry: 0,
                stroke: 'black',
                fill: 'rgba(0,0,0,0)',
                selectable: false
            });
            canvas.add(circle);
        } else if (tool == 'triangle') {
            triangle = new fabric.Triangle({
                left: startPosition.x,
                top: startPosition.y,
                originX: 'left',
                originY: 'top',
                stroke: 'black',
                width: 2,
                height: 2,
                fill: 'rgba(0,0,0,0)',
                selectable: false
            });
            canvas.add(triangle);
        }
        canvas.renderAll();
    }
});

canvas.on('mouse:move', function (event) {
    if (!isDown) return;
    if (tool == 'select') {
        //canvas.selection = true;
        //canvas.forEachObject(function (event) {
        //    event.selectable = true;
        //});
        //canvas.renderAll();
    } else {
        var pointer = canvas.getPointer(event.e);
        if (tool == 'rectangle') {
            if (startPosition.x > pointer.x) {
                rect.set({
                    left: Math.abs(pointer.x)
                });
            }
            if (startPosition.y > pointer.y) {
                rect.set({
                    top: Math.abs(pointer.y)
                });
            }
            rect.set({
                width: Math.abs(startPosition.x - pointer.x)
            });
            rect.set({
                height: Math.abs(startPosition.y - pointer.y)
            });
            rect.setCoords();
        } else if (tool == 'circle') {
            if (startPosition.x > pointer.x) {
                circle.set({
                    left: Math.abs(pointer.x)
                });
            }
            if (startPosition.y > pointer.y) {
                circle.set({
                    top: Math.abs(pointer.y)
                });
            }

            circle.set({
                rx: Math.abs(startPosition.x - pointer.x) / 2
            });
            circle.set({
                ry: Math.abs(startPosition.y - pointer.y) / 2
            });
            circle.setCoords();
        } else if (tool == 'triangle') {
            triangle.set({ width: Math.abs(startPosition.x - pointer.x), height: Math.abs(startPosition.y - pointer.y) });
            triangle.setCoords();
        }
        canvas.renderAll();

    }
});

canvas.on('mouse:up', function (event) {
    isDown = false;
});

document.querySelectorAll("[data-tool]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-tool].active").classList.toggle("active");
            item.classList.add("active");
            console.log(item.getAttribute("data-tool"));

            let selectedTool = item.getAttribute("data-tool");
            console.log("From app js ", selectedTool);
            tool = selectedTool;
            if (tool != 'select') {
                canvas.selection = false;
                canvas.forEachObject(function (event) {
                    event.selectable = false;
                });
                canvas.renderAll();
            }
            if (tool == 'select') {
                canvas.selection = true;
                canvas.forEachObject(function (event) {
                    event.selectable = true;
                    console.log(event.selectable);
                });
                canvas.renderAll();
            }
        });


    }
)

document.querySelectorAll("[data-command]").forEach(
    item => {
        item.addEventListener("click", e => {
            console.log(item.getAttribute("data-command"));

            let selectedCommand = item.getAttribute("data-command");
            console.log(typeof (selectedCommand));
            if (selectedCommand == "open") {
                openImage();
            } else if (selectedCommand == 'remove') {
                deleteObjects();
            } else if (selectedCommand == 'download') {
                downloadCanvas();
            }
        });
    }
)