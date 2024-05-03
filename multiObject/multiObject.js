var perspective = makePerspective(90, 2);

var camPos = {x: 0, y: 0, z: 0};
var camRot = {x: 0, y: 0, z: 0};

var keys = {};

loadModel(plane, new DOMMatrix().scaleSelf(2, 2, 2).translateSelf(0, -1, 0), [1, 0, 0]);
loadModel(plane, new DOMMatrix().translateSelf(0, -5, 0), [0, 1, 0]);
loadModel(plane, new DOMMatrix(), [0, 0, 1]);
// loadModel(plane);

function frame() {
  const rotSpeed = 1;
  if (keys.ArrowRight) {
    camRot.y += rotSpeed;
  }
  if (keys.ArrowLeft) {
    camRot.y -= rotSpeed;
  }
  if (keys.ArrowDown) {
    camRot.x += rotSpeed;
  }
  if (keys.ArrowUp) {
    camRot.x -= rotSpeed;
  }

  let moveMatrix = new DOMMatrix();
  moveMatrix.rotateSelf(0, -camRot.y, 0);

  // camera.translateSelf(0, 0.01, 0);
  const moveSpeed = 0.05;
  if (keys.KeyW) {
    camPos.x += moveMatrix.m13 * moveSpeed;
    camPos.z += moveMatrix.m33 * moveSpeed;
  }
  if (keys.KeyS) {
    camPos.x -= moveMatrix.m13 * moveSpeed;
    camPos.z -= moveMatrix.m33 * moveSpeed;
  }
  if (keys.KeyD) {
    camPos.x += moveMatrix.m11 * moveSpeed;
    camPos.z += moveMatrix.m31 * moveSpeed;
  }
  if (keys.KeyA) {
    camPos.x -= moveMatrix.m11 * moveSpeed;
    camPos.z -= moveMatrix.m31 * moveSpeed;
  }
  if (keys.KeyE || keys.Space) {
    camPos.y += moveSpeed;
  }
  if (keys.KeyQ || keys.ShiftLeft) {
    camPos.y -= moveSpeed;
  }

  let camera = new DOMMatrix();
  camera.rotateSelf(-camRot.x, 0, 0);
  camera.rotateSelf(0, -camRot.y, 0);
  camera.rotateSelf(0, 0, -camRot.z);
  camera.translateSelf(-camPos.x, -camPos.y, -camPos.z);

  render(perspective, camera);
  requestAnimationFrame(frame);
}
frame();

// let camera = new DOMMatrix();
// camera.rotateSelf(-camRot.x, 0, 0);
// camera.rotateSelf(0, -camRot.y, 0);
// camera.rotateSelf(0, 0, -camRot.z);
// camera.translateSelf(-camPos.x, -camPos.y, -camPos.z);


// render(perspective, camera);

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});