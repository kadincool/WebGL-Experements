const glCanvas = document.getElementById("glCanvas");
glCanvas.width = 800;
glCanvas.height = 600;
const gl = glCanvas.getContext("webgl2");

function makePerspective(fov=90, aRatio=1, near=0.01, far=100) {
  fov = fov / 360 * Math.PI;
  let fovMult = 1 / Math.tan(fov);
  let clipMult = 1 / (near - far);
  return new DOMMatrix([fovMult, 0, 0, 0, 0, fovMult * aRatio, 0, 0, 0, 0, (near + far) * clipMult, 1, 0, 0, -(2 * near * far) * clipMult, 0]);
}

camPos = {
  x: 0,
  y: 1,
  z: 0
};
camRot = {
  x: 0,
  y: 0,
  z: 0
};

keys = {};

const vShaderSRC = `#version 300 es
uniform mat4 perspective;
uniform mat4 camera;
in vec4 vertex;

void main() {
  gl_Position = perspective * camera * vertex;
}
`;

const fShaderSRC = `#version 300 es
precision mediump float;
out vec4 fragColor;

void main() {
  fragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`;

const vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, vShaderSRC);
gl.compileShader(vShader);

const fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fShader, fShaderSRC);
gl.compileShader(fShader);

const program = gl.createProgram();
gl.attachShader(program, fShader);
gl.attachShader(program, vShader);
gl.linkProgram(program);
gl.useProgram(program);

if (gl.getShaderInfoLog(vShader))
  console.log("vertex: ", gl.getShaderInfoLog(vShader));
if (gl.getShaderInfoLog(fShader))
  console.log("fragment: ", gl.getShaderInfoLog(fShader));
if (gl.getProgramInfoLog(program))
  console.log("program: ", gl.getProgramInfoLog(program));

//meshes
const plane = {
  v: new Float32Array([1, 0, 1, -1, 0, 1, -1, 0, -1, 1, 0, -1]),
  i: new Uint16Array([0, 1, 2, 0, 2, 3])
};

var mesh = {
  v: new Float32Array([1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0]),
  i: new Uint16Array([0, 1, 2, 0, 2, 3])
}

//buffer positions
var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, plane.v, gl.STATIC_DRAW);
const vertex = gl.getAttribLocation(program, "vertex");
gl.vertexAttribPointer(vertex, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertex);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, plane.i, gl.STATIC_DRAW);

//uniforms
var perspectiveUniform = gl.getUniformLocation(program, "perspective");
var perspectiveMatrix = makePerspective(90, glCanvas.width/glCanvas.height);
gl.uniformMatrix4fv(perspectiveUniform, false, perspectiveMatrix.toFloat32Array());

var cameraUniform = gl.getUniformLocation(program, "camera");
let cameraMatrix = new DOMMatrix();
gl.uniformMatrix4fv(cameraUniform, false, cameraMatrix.toFloat32Array());

function frame() {
  const rotSpeed = 3;
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

  const moveSpeed = 0.1;
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
  if (keys.KeyE) {
    camPos.y += moveSpeed;
  }
  if (keys.KeyQ) {
    camPos.y -= moveSpeed;
  }

  let cameraMatrix = new DOMMatrix();
  cameraMatrix.rotateSelf(-camRot.x, 0, 0);
  cameraMatrix.rotateSelf(0, -camRot.y, 0);
  cameraMatrix.rotateSelf(0, 0, -camRot.z);
  
  cameraMatrix.translateSelf(-camPos.x, -camPos.y, -camPos.z);
  gl.uniformMatrix4fv(cameraUniform, false, cameraMatrix.toFloat32Array());

  gl.clearColor(0.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

document.addEventListener("keydown", (e)=>{
  keys[e.code] = true;
}
);

document.addEventListener("keyup", (e)=>{
  keys[e.code] = false;
}
);
