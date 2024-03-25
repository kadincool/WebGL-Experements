var perspective = makePerspective();

var camPos = {x: 0, y: 1, z: -2};
var camRot = {x: 0, y: 0, z: 0};

let camera = new DOMMatrix();
camera.rotateSelf(-camRot.x, 0, 0);
camera.rotateSelf(0, -camera.y, 0);
camera.rotateSelf(0, 0, -camera.z);
camera.translateSelf(-camPos.x, -camPos.y, -camPos.z);

render(perspective, camera);