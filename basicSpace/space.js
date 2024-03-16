const glCanvas = document.getElementById("glCanvas");
const gl = glCanvas.getContext("webgl2");

glCanvas.width = 800;
glCanvas.height = 600;
camPos = {x: 0, y: 0, z: 0};
camRot = {x: 0, y: 0, z: 0};

const vShaderSRC = `
attribute vec4 pos;

void main() {
  gl_Position = pos;
}
`;

const fShaderSRC = `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.0, 1.0, 0.0, 0.0);
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

function frame() {
  

  gl.clearColor(0.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
requestAnimationFrame(frame);