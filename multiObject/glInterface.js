var renderModel = {
  v: new Array(),
  i: new Array(),
  c: new Array()
};

function loadModel(model, transform = new DOMMatrix(), color) {
  if (!model.v || !model.i || !model.c) {
    console.error("Model lacks necessary information");
    return;
  }
  let modelBegin = renderModel.v.length / 3;
  for (let i = 0; i < model.v.length; i+=3) {
    let transPos = multiplyByMatrix([model.v[i], model.v[i+1], model.v[i+2], 1], transform);
    renderModel.v.push(transPos[0], transPos[1], transPos[2]);
  }
  for (let i = 0; i < model.i.length; i++) {
    renderModel.i.push(model.i[i] + modelBegin);
  }
  for (let i = 0; i < model.c.length; i++) {
    if (color) {
      renderModel.c.push(color[i%3]);
    } else {
      renderModel.c.push(model.c[i]);
    }
  }
};

const vShader = `#version 300 es
uniform mat4 perspective;
uniform mat4 camera;
in vec4 vertex;
in vec4 color;

out vec4 v_color;

void main() {
  // gl_Position = perspective * camera * vertex;
  gl_Position = perspective * camera * vertex;
  v_color = color;
}`;

const fShader = `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = v_color;
}`

var program = compile(vShader, fShader);
gl.useProgram(program);
// console.log(program);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

function render(perspectiveMatrix, cameraMatrix) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  bufferData(program, "vertex", new Float32Array(renderModel.v), 3, gl.FLOAT);
  bufferData(program, "color", new Float32Array(renderModel.c), 3, gl.FLOAT);
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderModel.i), gl.STATIC_DRAW);
  //gl.deleteBuffer(indexBuffer);

  let perspectiveUniform = gl.getUniformLocation(program, "perspective");
  gl.uniformMatrix4fv(perspectiveUniform, false, perspectiveMatrix.toFloat32Array());

  let cameraUniform = gl.getUniformLocation(program, "camera");
  gl.uniformMatrix4fv(cameraUniform, false, cameraMatrix.toFloat32Array());

  gl.drawElements(gl.TRIANGLES, renderModel.i.length, gl.UNSIGNED_SHORT, 0);
}