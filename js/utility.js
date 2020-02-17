import Point from './point.model.js';

export default function getMouseCoordinatesonCanvas(event, canvas) {
    let rect = canvas.getPointer(event.e);
    return rect;
    let x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    let y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    return new Point(x, y);
}
export function findDistance(coord1, coord2) {
    let exp1 = Math.pow(coord2.x - coord1.x, 2);
    let exp2 = Math.pow(coord2.y - coord1.y, 2);
    let dis = Math.sqrt(exp1 + exp2);
    return dis;
}

export function get(event, canvas) {
    let rect = canvas.getPointer(event.e);
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return new Point(x, y);
}