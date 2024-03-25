function makePerspective(fov=90, aRatio=1, near=0.01, far=100) {
  fov = fov / 360 * Math.PI;
  let fovMult = 1 / Math.tan(fov);
  let clipMult = 1 / (near - far);
  return new DOMMatrix([
    fovMult, 0, 0, 0,
    0, fovMult * aRatio, 0, 0,
    0, 0, (near + far) * clipMult, 1,
    0, 0, -(2 * near * far) * clipMult, 0
  ]);
}

function compile(vShaderSRC, fShaderSRC) {
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

  if (gl.getShaderInfoLog(vShader)) console.log("vertex: ", gl.getShaderInfoLog(vShader));
  if (gl.getShaderInfoLog(fShader)) console.log("fragment: ", gl.getShaderInfoLog(fShader));
  if (gl.getProgramInfoLog(program)) console.log("program: ", gl.getProgramInfoLog(program));

  return program;
}

function multiplyByMatrix(vector, matrix) {
  // console.log(vector, matrix)
  if (!vector[3]) vector[3] = 1;
  return [
    vector[0] * matrix.m11 + vector[1] * matrix.m21 + vector[2] * matrix.m31 + vector[3] * matrix.m41,
    vector[0] * matrix.m12 + vector[1] * matrix.m22 + vector[2] * matrix.m32 + vector[3] * matrix.m42,
    vector[0] * matrix.m13 + vector[1] * matrix.m23 + vector[2] * matrix.m33 + vector[3] * matrix.m43,
    vector[0] * matrix.m14 + vector[1] * matrix.m24 + vector[2] * matrix.m34 + vector[3] * matrix.m44
  ]
}

const primModels = {
  plane: {
    v: new Float32Array([
      1, 0, 1,
      -1, 0, 1,
      -1, 0, -1,
      1, 0, -1
    ]),
    i: new Uint16Array([
      0, 1, 2,
      0, 2, 3
    ]),
    c: new Float32Array([
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    ])
  }
};

const specialModels = {
  bowl: {
    v: new Float32Array([
      1, 0, 1,
      -1, 0, 1,
      -1, 0, -1,
      1, 0, -1,
      1.5, 1, 1.5,
      -1.5, 1, 1.5,
      -1.5, 1, -1.5,
      1.5, 1, -1.5,
    ]),
    i: new Uint16Array([
      0, 1, 2,  0, 2, 3,
      0, 4, 1,  1, 4, 5,
      1, 5, 2,  2, 5, 6,
      2, 6, 3,  3, 6, 7,
      3, 7, 0,  0, 7, 4
    ]),
    c: new Float32Array([
      0.8, 0.8, 0.8,
      0.8, 0.8, 0.8,
      0.8, 0.8, 0.8,
      0.8, 0.8, 0.8,
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
      1, 1, 1,
    ])
  }
};

var renderModel = {
  v: new Float32Array(),
  i: new Uint16Array(),
  c: new Float32Array()
};

function addModel(model, matrix) {
  let modelBegin = renderModel.v.length;
  
}

const glCanvas = document.getElementById("glCanvas");
glCanvas.width = 800;
glCanvas.height = 600;
const gl = glCanvas.getContext("webgl2");

camPos = {x: 0, y: 1, z: 0};
camRot = {x: 0, y: 0, z: 0};

keys = {};

const vShaderSRC = `#version 300 es
uniform mat4 perspective;
uniform mat4 camera;
in vec4 vertex;
in vec4 color;

out vec4 v_color;

void main() {
  gl_Position = perspective * camera * vertex;
  v_color = color;
}
`;

const fShaderSRC = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = v_color;
  // fragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`;

program = compile(vShaderSRC, fShaderSRC);

//buffer positions
var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, specialModels.bowl.v, gl.STATIC_DRAW);
const vertex = gl.getAttribLocation(program, "vertex");
gl.vertexAttribPointer(vertex, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertex);

//buffer colors
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, specialModels.bowl.c, gl.STATIC_DRAW);
const color = gl.getAttribLocation(program, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, specialModels.bowl.i, gl.STATIC_DRAW);

//uniforms
var perspectiveUniform = gl.getUniformLocation(program, "perspective");
var perspectiveMatrix = makePerspective(90, glCanvas.width/glCanvas.height);
gl.uniformMatrix4fv(perspectiveUniform, false, perspectiveMatrix.toFloat32Array());

var cameraUniform = gl.getUniformLocation(program, "camera");
let cameraMatrix = new DOMMatrix();
gl.uniformMatrix4fv(cameraUniform, false, cameraMatrix.toFloat32Array());

gl.clearColor(0.0, 1.0, 1.0, 1.0);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

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

  let cameraMatrix = new DOMMatrix();
  cameraMatrix.rotateSelf(-camRot.x, 0, 0);
  cameraMatrix.rotateSelf(0, -camRot.y, 0);
  cameraMatrix.rotateSelf(0, 0, -camRot.z);
  cameraMatrix.translateSelf(-camPos.x, -camPos.y, -camPos.z);
  gl.uniformMatrix4fv(cameraUniform, false, cameraMatrix.toFloat32Array());
  if (keys.KeyL) console.log(multiplyByMatrix([0, 0, 0], cameraMatrix));

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.drawElements(gl.TRIANGLES, specialModels.bowl.i.length, gl.UNSIGNED_SHORT, 0);
  // console.log(cameraMatrix);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});
