const glCanvas = document.getElementById("glCanvas");
glCanvas.width = 800;
glCanvas.height = 600;
const gl = glCanvas.getContext("webgl2");

camPos = {x: 0, y: 0, z: 0};
camRot = {x: 0, y: 0, z: 0};

const vShaderSRC = `#version 300 es
in vec4 vertex;

void main() {
  gl_Position = vertex;
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
  // v: new Float32Array([
  //   1, 0, 1,  
  //   -1, 0, 1,  
  //   -1, 0, -1,  
  //   1, 0, -1
  // ]),
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
};

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, plane.v, gl.STATIC_DRAW);
const vertex = gl.getAttribLocation(program, "vertex");
gl.vertexAttribPointer(vertex, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertex);

var indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, plane.i, gl.STATIC_DRAW);

function frame() {
  gl.clearColor(0.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
}
requestAnimationFrame(frame);