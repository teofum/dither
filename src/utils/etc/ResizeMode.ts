enum ResizeMode {
  N = 1,
  E = 2,
  S = 4,
  W = 8,
  NE = N | E,
  SE = S | E,
  SW = S | W,
  NW = N | W
};

export default ResizeMode;