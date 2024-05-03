function newModel() {
  return {
    v: new Array(),
    i: new Array(),
    c: new Array()
  };
}

var renderModel = newModel();

function clearModel(toModel = renderModel) {
  if (!toModel.v || !toModel.i || !toModel.c) {
    console.error("Model lacks writable data");
    return;
  }

  toModel.v = new Array();
  toModel.i = new Array();
  toModel.c = new Array();
};

function setModel(model, toModel = renderModel) {
  if (!model.v || !model.i || !model.c) {
    console.error("Model lacks necessary information");
    return;
  }
  if (!toModel.v || !toModel.i || !toModel.c) {
    console.error("Model lacks writable data");
    return;
  }

  toModel.v = Array.from(model.v);
  toModel.i = Array.from(model.i);
  toModel.c = Array.from(model.c);
}

function loadModel(model, transform = new DOMMatrix(), color, toModel = renderModel) {
  if (!model.v || !model.i || !model.c) {
    console.error("Model lacks necessary information");
    return;
  }
  if (!toModel.v || !toModel.i || !toModel.c) {
    console.error("Model lacks writable data");
    return;
  }
  let modelBegin = toModel.v.length / 3;
  for (let i = 0; i < model.v.length; i+=3) {
    let transPos = multiplyByMatrix([model.v[i], model.v[i+1], model.v[i+2], 1], transform);
    toModel.v.push(transPos[0], transPos[1], transPos[2]);
  }
  for (let i = 0; i < model.i.length; i++) {
    toModel.i.push(model.i[i] + modelBegin);
  }
  for (let i = 0; i < model.c.length; i++) {
    if (color) {
      toModel.c.push(color[i%3]);
    } else {
      toModel.c.push(model.c[i]);
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

function render(perspectiveMatrix, cameraMatrix, data = [renderModel]) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (let i in data) {
    bufferData(program, "vertex", new Float32Array(data[i].v), 3, gl.FLOAT);
    bufferData(program, "color", new Float32Array(data[i].c), 3, gl.FLOAT);
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data[i].i), gl.STATIC_DRAW);
    //gl.deleteBuffer(indexBuffer);

    let perspectiveUniform = gl.getUniformLocation(program, "perspective");
    gl.uniformMatrix4fv(perspectiveUniform, false, perspectiveMatrix.toFloat32Array());

    let cameraUniform = gl.getUniformLocation(program, "camera");
    gl.uniformMatrix4fv(cameraUniform, false, cameraMatrix.toFloat32Array());

    gl.drawElements(gl.TRIANGLES, data[i].i.length, gl.UNSIGNED_SHORT, 0);
  }
}