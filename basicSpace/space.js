const glCanvas = document.getElementById("glCanvas");
const gl = glCanvas.getContext("webgl2");

glCanvas.width = 800;
glCanvas.height = 600;

function frame() {
  

  gl.clearColor(0.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
requestAnimationFrame(frame);