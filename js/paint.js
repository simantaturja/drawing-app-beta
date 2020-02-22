export function init() {
    var startPosition, isDown, currentPositionX, currentPositionY, savedData;
    this.canvas.on('mouse:move', function (event) {
        if (!isDown) return;
        if (this.tool == 'select') {
            //canvas.selection = true;
            //canvas.forEachObject(function (event) {
            //    event.selectable = true;
            //});
            //canvas.renderAll();
        } else {
            var pointer = canvas.getPointer(event.e);
            if (this.tool == 'rectangle') {
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
            } else if (this.tool == 'circle') {
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
            } else if (this.tool == 'triangle') {
                triangle.set({ width: Math.abs(startPosition.x - pointer.x), height: Math.abs(startPosition.y - pointer.y) });
                triangle.setCoords();
            }
            canvas.renderAll();
    
        }
    });
    
    canvas.on('mouse:up', function (event) {
        isDown = false;
    });

}