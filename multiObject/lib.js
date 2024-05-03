function multiplyByMatrix(vector, matrix) {
  return [
    vector[0] * matrix.m11 + vector[1] * matrix.m21 + vector[2] * matrix.m31 + vector[3] * matrix.m41,
    vector[0] * matrix.m12 + vector[1] * matrix.m22 + vector[2] * matrix.m32 + vector[3] * matrix.m42,
    vector[0] * matrix.m13 + vector[1] * matrix.m23 + vector[2] * matrix.m33 + vector[3] * matrix.m43,
    vector[0] * matrix.m14 + vector[1] * matrix.m24 + vector[2] * matrix.m34 + vector[3] * matrix.m44
  ]
}

function makePerspective(fov=90, aRatio=1, near=0.01, far=100) {
  fov = fov / 360 * Math.PI;
  let fovMult = 1 / Math.tan(fov);
  let clipMult = 1 / (far - near);
  return new DOMMatrix([
    fovMult, 0, 0, 0,
    0, fovMult * aRatio, 0, 0,
    0, 0, (near + far) * clipMult, 1,
    0, 0, -(2 * near * far) * clipMult, 0
  ]);
}

var keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
})

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
})