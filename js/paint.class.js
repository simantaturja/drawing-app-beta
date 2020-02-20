export default class Paint {
    constructor(canvasId) {
        this.canvas = canvasId;
        this.mouseDown = this.canvas.on('mousedown');
    }

    mouseDown() {
        
    }
}