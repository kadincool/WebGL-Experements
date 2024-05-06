var keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

glCanvas.addEventListener("click", async () => {
  await glCanvas.requestPointerLock();
});


glCanvas.addEventListener("mousemove", (e) => {
  camRot.y += e.movementX / glCanvas.width * rotSpeed;
  camRot.x += e.movementY / glCanvas.width * rotSpeed;
})

var camPos = {x: 0, y: 0, z: 0};
var camRot = {x: 0, y: 0, z: 0};

var moveSpeed = 5;
var rotSpeed = 90;

function movePlayer(delta) {
  if (keys.ArrowRight) {
    camRot.y += rotSpeed * delta;
  }
  if (keys.ArrowLeft) {
    camRot.y -= rotSpeed * delta;
  }
  if (keys.ArrowDown) {
    camRot.x += rotSpeed * delta;
  }
  if (keys.ArrowUp) {
    camRot.x -= rotSpeed * delta;
  }

  let moveMatrix = new DOMMatrix();
  moveMatrix.rotateSelf(0, -camRot.y, 0);

  if (keys.KeyW) {
    camPos.x += moveMatrix.m13 * moveSpeed * delta;
    camPos.z += moveMatrix.m33 * moveSpeed * delta;
  }
  if (keys.KeyS) {
    camPos.x -= moveMatrix.m13 * moveSpeed * delta;
    camPos.z -= moveMatrix.m33 * moveSpeed * delta;
  }
  if (keys.KeyD) {
    camPos.x += moveMatrix.m11 * moveSpeed * delta;
    camPos.z += moveMatrix.m31 * moveSpeed * delta;
  }
  if (keys.KeyA) {
    camPos.x -= moveMatrix.m11 * moveSpeed * delta;
    camPos.z -= moveMatrix.m31 * moveSpeed * delta;
  }
  if (keys.KeyE || keys.Space) {
    camPos.y += moveSpeed * delta;
  }
  if (keys.KeyQ || keys.ShiftLeft) {
    camPos.y -= moveSpeed * delta;
  }
}

function camPosMat() {
  let camera = new DOMMatrix();
  camera.rotateSelf(-camRot.x, 0, 0);
  camera.rotateSelf(0, -camRot.y, 0);
  camera.rotateSelf(0, 0, -camRot.z);
  camera.translateSelf(-camPos.x, -camPos.y, -camPos.z);
  return camera;
}