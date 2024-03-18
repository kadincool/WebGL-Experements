const glCanvas = document.getElementById("glCanvas");
glCanvas.width = 800;
glCanvas.height = 600;
const gl = glCanvas.getContext("webgl2");

function makePerspective(fov = 45, aRatio = 1, near = 0.01, far = 100) {
  fov = fov / 180 * Math.PI;
  let fovMult = 1 / Math.tan(fov);
  let clipMult = 1 / (near - far);
  return new DOMMatrix([
    fovMult, 0, 0, 0,
    0, fovMult * aRatio, 0, 0,
    0, 0, (near + far) * clipMult, 1,
    0, 0, -(2 * near * far) * clipMult, 0
  ]);
}

camPos = {x: 0, y: 0, z: 0};
camRot = {x: 0, y: 0, z: 0};

keys = {};

const vShaderSRC = `#version 300 es
uniform mat4 perspective;
uniform mat4 trans;
in vec4 vertex;

void main() {
  gl_Position = perspective * trans * vertex;
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

if (gl.getShaderInfoLog(vShader)) console.log("vertex: ", gl.getShaderInfoLog(vShader));
if (gl.getShaderInfoLog(fShader)) console.log("fragment: ", gl.getShaderInfoLog(fShader));
if (gl.getProgramInfoLog(program)) console.log("program: ", gl.getProgramInfoLog(program));

const plane = {
  v: new Float32Array([
    1, 1, 1,  
    -1, 0, 1,  
    -1, 0, -1,  
    1, 0, -1
  ]),
  i: new Uint16Array([
    0, 1, 2,  
    0, 2, 3
  ])
};

var mesh = {
  v: new Float32Array([
    1, 1, 0,  
    -1, 1, 0,  
    -1, -1, 0,  
    1, -1, 0
  ]),
  i: new Uint16Array([
    0, 1, 2,  
    0, 2, 3
  ])
}

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
var perspectiveMatrix = makePerspective();
gl.uniformMatrix4fv(perspectiveUniform, false, perspectiveMatrix.toFloat32Array());

var transUniform = gl.getUniformLocation(program, "trans");
var transMatrix = new DOMMatrix();
gl.uniformMatrix4fv(transUniform, false, transMatrix.toFloat32Array());

function frame() {
  if (keys.KeyW) camPos.z+=0.1;
  if (keys.KeyS) camPos.z-=0.1;
  if (keys.KeyD) camPos.x+=0.1;
  if (keys.KeyA) camPos.x-=0.1;
  if (keys.KeyE) camPos.y+=0.1;
  if (keys.KeyQ) camPos.y-=0.1;

  if (keys.ArrowRight) camRot.y += 3;
  if (keys.ArrowLeft) camRot.y -= 3;
  if (keys.ArrowDown) camRot.x += 3;
  if (keys.ArrowUp) camRot.x -= 3;
  let transMatrix = new DOMMatrix();
  transMatrix.rotateSelf(-camRot.x, 0, 0);
  transMatrix.rotateSelf(0, -camRot.y, 0);
  transMatrix.rotateSelf(0, 0, -camRot.z);
  transMatrix.translateSelf(-camPos.x, -camPos.y, -camPos.z);
  gl.uniformMatrix4fv(transUniform, false, transMatrix.toFloat32Array());
  gl.clearColor(0.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

document.addEventListener("keydown", (e) => {
  // switch (e.code) {
  //   case "KeyE":
  //     camPos.y+=0.1;
  //     break;
  //   case "KeyQ":
  //     camPos.y-=0.1;
  //     break
  //   case "KeyW":
  //     camPos.z+=0.1;
  //     break;
  //   case "KeyS":
  //     camPos.z-=0.1;
  //     break;
  //   case "KeyD":
  //     camPos.x+=0.1;
  //     break;
  //   case "KeyA":
  //     camPos.x-=0.1;
  //     break;
  //   case "ArrowDown":
  //   case "KeyK":
  //     camRot.x += 5;
  //     break;
  //   case "ArrowUp":
  //   case "KeyI":
  //     camRot.x -= 5;
  //     break;
  //   case "ArrowRight":
  //   case "KeyL":
  //     camRot.y += 5;
  //     break;
  //   case "ArrowLeft":
  //   case "KeyJ":
  //     camRot.y -= 5;
  //     break;
  //   case "KeyO":
  //     camRot.z -= 5;
  //     break;
  //   case "KeyU":
  //     camRot.z += 5;
  //     break;
  // }
  keys[e.code] = true;
  // requestAnimationFrame(frame);
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});