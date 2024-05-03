const glCanvas = document.getElementById("glCanvas");
const gl = glCanvas.getContext("webgl2");

function compile(vShaderSRC, fShaderSRC) {
  let vShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vShader, vShaderSRC);
  gl.compileShader(vShader);

  let fShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fShader, fShaderSRC);
  gl.compileShader(fShader);

  let program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  
  // if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  //   console.log("Vertex Shader:", gl.getShaderInfoLog(vShader));
  //   console.log("Fragment Shader:", gl.getShaderInfoLog(fShader));
  //   console.log("Program:", gl.getProgramInfoLog(program));
  // }

  if (gl.getShaderInfoLog(vShader)) console.log("vertex: ", gl.getShaderInfoLog(vShader));
  if (gl.getShaderInfoLog(fShader)) console.log("fragment: ", gl.getShaderInfoLog(fShader));
  if (gl.getProgramInfoLog(program)) console.log("program: ", gl.getProgramInfoLog(program));

  return program;
}

function bufferData(program, attribute, data, length, type) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  let attributeLocation = gl.getAttribLocation(program, attribute);
  gl.vertexAttribPointer(attributeLocation, length, type, false, 0, 0);
  gl.enableVertexAttribArray(attributeLocation);
  // gl.deleteBuffer(buffer);
}