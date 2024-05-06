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

var cube = {
  v: new Float32Array([
    1, 1, 1,
    -1, 1, 1,
    1, -1, 1,
    -1, -1, 1,
    1, 1, -1,
    -1, 1, -1,
    1, -1, -1,
    -1, -1, -1,
  ]),
  i: new Uint16Array([
    1, 0, 2,  1, 2, 3,
    4, 5, 7,  4, 7, 6,
    0, 4, 6,  0, 6, 2,
    5, 1, 3,  5, 3, 7,
    0, 1, 5,  0, 5, 4,
    3, 2, 6,  3, 6, 7,
  ]),
  c: new Float32Array([
    1, 1, 1,
    0, 1, 1,
    1, 0, 1,
    0, 0, 1,
    1, 1, 0,
    0, 1, 0,
    1, 0, 0,
    0, 0, 0,
  ]),
}