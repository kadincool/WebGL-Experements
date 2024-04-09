var plane = {
  v: new Float32Array([
    1, 0, 1,
    -1, 0, 1,
    -1, 0, -1,
    1, 0, -1,
  ]),
  i: new Uint16Array([
    0, 1, 2,
    0, 2, 3,
  ]),
  c: new Float32Array([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  ])
};

var planeButSide = {
  v: new Float32Array([
    1, 1, 1,
    -1, 1, 1,
    -1, -1, 1,
    1, -1, 1,
  ]),
  i: new Uint16Array([
    0, 1, 2,
    0, 2, 3,
  ]),
  c: new Float32Array([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
  ])
}