var perspective = makePerspective();

var camPos = {x: 0, y: 0, z: 0};
var camRot = {x: 0, y: 0, z: 0};

let camera = new DOMMatrix();
camera.rotateSelf(-camRot.x, 0, 0);
camera.rotateSelf(0, -camRot.y, 0);
camera.rotateSelf(0, 0, -camRot.z);
camera.translateSelf(-camPos.x, -camPos.y, -camPos.z);

loadModel(plane);

render(perspective, camera);

document.addEventListener("keydown", (e) => {
  camera.translateSelf(0, 0.01, 0);
  render(perspective, camera);
})