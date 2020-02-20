import Translation from './translation.class.js';

function getRadius(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

var canvas = new fabric.Canvas('canvas');

var translation = new Translation(canvas);

//canvas.selection = false;
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
var rect, circle;

document.getElementById('open').addEventListener("change", function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
        var data = f.target.result;
        fabric.Image.fromURL(data, function (img) {
            // add background image
            /*canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height,
                selectable: true
            });*/
            var img1 = img.set({ left: 0, top: 0 ,width:450,height:550});
            canvas.add(img);
            img.sendToBack();
            img.selectable = false;
        });
    };
    reader.readAsDataURL(file);
    canvas.renderAll();
    
});

document.getElementById('removebg').addEventListener("click", function (e) {
    var objects = canvas.getObjects();
    canvas.remove(objects[0]);


});

var download = document.querySelector('#download');
download.addEventListener('click', function () {
    processDownload();
    translation.translateRotateLeft();
    processDownload();
    translation.translateRotateRight();
    translation.translateRotateRight();
    processDownload();
    translation.translateRotateLeft();
    translation.translateTop();
    processDownload();
    translation.translateDown();
    translation.translateDown();
    processDownload();
    translation.translateTop();
    translation.translateLeft();
    processDownload();
    translation.translateRight();
    translation.translateRight();
    processDownload();
    translation.translateLeft();
});
function processDownload() {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = canvas.toDataURL();
    a.download = 'myimg.jpg';
    a.click();
}
$("#select").click(function () {
    mode = "select";
    canvas.selection = true;
    canvas.perPixelTargetFind = true;
    canvas.targetFindTolerance = 4;
    canvas.renderAll();
});

$("#undo").click(function () {
    console.log("flip");
    canvas.forEachObject(function (event) {
        event.set({
            left: event.getScaledWidth
        });
        event.set('flipX', true);

    });
    canvas.renderAll();
});

$("#removeall").click(function () {
    canvas.clear();
});

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

