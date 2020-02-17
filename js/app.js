function getRadius(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

var canvas = new fabric.Canvas('canvas');

//canvas.selection = false;

console.log(canvas.getWidth(), canvas.getHeight());
var context = canvas.getContext("2d");
console.log("Starting app.js ..... ");


var startPosition, isDown, currentPositionX, currentPositionY, tool = 'select', savedData;
var rect, circle;

download_img = function(el) {
    var image = canvas.toDataURL("image/jpg");
    el.href = image;
};

function downloadCanvas() {
    var link = document.getElementById('download');
  link.setAttribute('download', 'MintyPaper.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
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

