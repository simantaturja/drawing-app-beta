export default class Translation {

    constructor(canvasId) {
        this.canvas = canvasId;
    }

    translateLeft() {
        this.canvas.forEachObject(function (obj) {
            obj.set({
                left: obj.left - 20
            });
        });
    }

    translateRight() {
        this.canvas.forEachObject(function (obj) {
            obj.set({
                left: obj.left + 20
            });
        });
    }

    translateTop() {
        this.canvas.forEachObject(function (obj) {
            obj.set({
                top: obj.top - 20
            });
        });
    }

    translateDown() {
        this.canvas.forEachObject(function (obj) {
            obj.set({
                top: obj.top + 20
            });
        });
    }

    translateRotateLeft() {
        var canvasCenter = new fabric.Point(225, 275);
        var rads = -0.174532925;
        this.canvas.getObjects().forEach(function (obj) {
            var objectOrigin = new fabric.Point(obj.left, obj.top);
            var new_loc = fabric.util.rotatePoint(objectOrigin, canvasCenter, rads);
            obj.top = new_loc.y;
            obj.left = new_loc.x;
            obj.angle -= 10;
            //this.canvas.renderAll();
            console.log(new_loc, rads);
        });
    }

    translateRotateRight() {
        var canvasCenter = new fabric.Point(225, 275);
        var rads = 0.174532925;
        this.canvas.getObjects().forEach(function (obj) {
            var objectOrigin = new fabric.Point(obj.left, obj.top);
            var new_loc = fabric.util.rotatePoint(objectOrigin, canvasCenter, rads);
            obj.top = new_loc.y;
            obj.left = new_loc.x;
            obj.angle += 10;
            //this.canvas.renderAll();
            console.log(new_loc, rads);
        });
    }

}