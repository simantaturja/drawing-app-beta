import Point from './point.model.js';
import getMouseCoordinatesonCanvas, { findDistance, get } from './utility.js';
import { TOOL_CIRCLE, TOOL_OVAL, TOOL_RECTANGLE, TOOL_TRIANGLE, TOOL_SELECT } from './tool.js';
var rect = [{ sx: 0, sy: 0, cx: 0, cy: 0 }];
var oval = [];
var shapes = []

export default class Paint {
    constructor(canvasId) {
        //this.canvas = document.getElementById(canvasId);
        console.log("Inside Paint Constructor");
        this.canvas = new fabric.Canvas(canvasId);
        this.context = canvas.getContext("2d");

    }

    set activeTool(tool) {
        this.tool = tool;
        console.log("From paint active tool ", this.tool);
    }

    init(){
        this.canvas.on('mouse:down', function(event){
            if(canvas.getActiveObject()){
                return false;
            }
            isDown = true;
            var pointer = canvas.getPointer(event.e);
            console.log(pointer);
            startPosX = pointer.x;
            startPosY = pointer.y;
    
            if ( selectedTool == 'rectangle' ) {
                var rect = new fabric.Rect({
                    left: startPosX,
                    top: startPosY,
                    originX: 'left',
                    originY: 'top',
                    width: 0,
                    height: 0,
                    fill: 'white',
                    stroke: 'black'
                });
                canvas.add(rect);
                canvas.setActiveObject(rect); 
            }
            if ( selectedTool == 'circle' ) {
                var circle = new fabric.Circle({
                    left: startPosX,
                    top: startPosY,
                    originX: 'left',
                    originY: 'top',
                    radius: 0,
                    fill: 'white',
                    stroke: 'black'
                });
                canvas.add(circle);
                canvas.setActiveObject(circle); 
            }
        });
    
        this.canvas.on('mouse:move', function(event){
            if (!isDown) {
                return false;
            }
            if ( selectedTool == 'rectangle') {
                var pointer = canvas.getPointer(event.e);
                var w = Math.abs(pointer.x - startPosX);
                var h = Math.abs(pointer.y - startPosY);
                if ( w == 0 || h == 0 ) {
                    return false;
                }
                var rect = canvas.getActiveObject();
                rect.set('width', w).set('height', h);
            }
    
            if ( selectedTool == 'circle') {
                var pointer = canvas.getPointer(event.e);
                var w = Math.abs(pointer.x - startPosX);
                var h = Math.abs(pointer.y - startPosY);
                if ( w == 0 || h == 0 ) {
                    return false;
                }
                var circle = canvas.getActiveObject();
                circle.set('radius', w + h);
                //rect.set('width', w).set('height', h);
            }
            
            canvas.renderAll();
        
        });
    }




    onMouseDown(event) {
        console.log("Inside onMouseDown");

        //this.savedData = this.context.getImageData(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.canvas.on({
            "mouse:move": this.onMouseMove,
            "mouse:up": this.onMouseUp
        });
        //this.canvas.onmousemove = e => this.onMouseMove(e);
        //document.onmouseup = e => this.onMouseUp(e);
        //this.startPos = getMouseCoordinatesonCanvas(e, this.canvas);
        //this.startPos = get(e, this.canvas);
        //this.startPos.x = event.clientX;
        //this.startPos.y = event.clientY;
        var pointer = this.canvas.getPointer(event.e);
        this.startPos = pointer;
        //this.startPos = { x: event.e.clientX, y: event.e.clientY };
        //console.log(this.startPos);
    }

    onMouseMove(event) {
        //this.currentPos = getMouseCoordinatesonCanvas(e, this.canvas);
        console.log("hello mouse");
        //this.currentPos = get(e, this.canvas);
        //var pointer2 = this.canvas.getPointer(event);
        this.currentPos = { x: event.e.clientX, y: event.e.clientY };
        console.log("OnMouseMove Tool ", this.tool);
        //console.log(this.currentPos);
        //this.currentPos.x = event.clientX;
        //this.currentPos.y = event.clientY;
        //this.currentPos.x = this.canvas.e.clientX;
        switch (this.tool) {
            case TOOL_SELECT:
                this.drawShape();
                break;
            case TOOL_CIRCLE:
                console.log("Drawing Circle.....")
                var rect = new fabric.Rect({
                    left: this.startPos.x,
                    top: this.startPos.y,
                    fill: 'white',
                    stroke: 'black',
                    width: this.currentPos.x - this.startPos.x,
                    height: this.currentPos.y - this.startPos.y
                });
                this.canvas.add(rect);
                console.log("Hi");
                break;
            case TOOL_RECTANGLE:
                this.drawShape();
                break;
            case TOOL_OVAL:
                this.drawEllipse(this.startPos.x, this.startPos.y, this.currentPos.x, this.currentPos.y);
                break;
            case TOOL_TRIANGLE:
                this.drawShape();
                break;
            default:
                break;
        }
    }

    onMouseUp(e) {
        this.canvas.onmousemove = null;
        document.onmouseup = null;
    }

    drawShape() {
        this.context.putImageData(this.savedData, 0, 0);
        this.context.beginPath();
        if (this.tool == TOOL_SELECT) {
            console.log('tool select:', rect[1].sx, rect[1].sy, rect[1].cx, rect[1].cy);
        } else if (this.tool == TOOL_CIRCLE) {
            let radius = findDistance(this.startPos, this.currentPos);
            this.context.arc(this.startPos.x, this.startPos.y, radius, 0, 2 * Math.PI, false);
        } else if (this.tool == TOOL_RECTANGLE) {
            let sx = this.startPos.x,
                sy = this.startPos.y,
                cx = this.currentPos.x,
                cy = this.currentPos.y;
            console.log('hello', sx, sy, cx, cy);
            this.context.rect(this.startPos.x, this.startPos.y, this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y);
            rect.push({ sx, sy, cx, cy });
            shapes.push({ x: sx, y: sy, w: cx - sx, h: cy - sy });
        } else if (this.tool == TOOL_OVAL) {
            let rect = this.canvas.getBoundingClientRect();
            let mx = Math.max(rect.width, rect.height);
            let radiusX = rect.width / mx;
            let radiusY = rect.height / mx;
            let radius = findDistance(this.startPos, this.currentPos);
            this.context.ellipse(this.startPos.x, this.startPos.y, radiusX * radius, radiusY * radius, 0, 0, Math.PI * 2);
        }
        console.log(rect.length);
        this.context.stroke();
    }

    drawEllipse(x1, y1, x2, y2) {
        var radiusX = (x2 - x1) * 0.5,   /// radius for x based on input
            radiusY = (y2 - y1) * 0.5,   /// radius for y based on input
            centerX = x1 + radiusX,      /// calc center
            centerY = y1 + radiusY,
            step = 0.01,                 /// resolution of ellipse
            a = step,                    /// counter
            pi2 = Math.PI * 2 - step;    /// end angle

        /// start a new path
        this.context.putImageData(this.savedData, 0, 0);
        this.context.beginPath();

        /// set start point at angle 0
        this.context.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0));

        /// create the ellipse    
        for (; a < pi2; a += step) {
            this.context.lineTo(centerX + radiusX * Math.cos(a), centerY + radiusY * Math.sin(a));
        }
        this.context.stroke();
    }
    moveObject() {

    }
}

