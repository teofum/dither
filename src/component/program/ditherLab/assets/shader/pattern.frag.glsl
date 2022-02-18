precision mediump float;

#define PALETTE_SIZE $ // $ is replaced in JS before compiling

#define CE 0.1 // Error multiplier, [0.0, 1.0] higher = more dither
#define CLIST_SIZE % // Candidate list size, higher is better quality but slower

uniform vec3 u_palette[PALETTE_SIZE];
uniform vec2 u_texSize;
uniform float u_gamma;
uniform sampler2D u_image;
uniform sampler2D u_threshold;
uniform float u_thres_size;
uniform float u_err_mult;

varying vec2 v_texCoord;

vec3 gamma(vec3 color) {
  return vec3(
    pow(color.x, u_gamma),
    pow(color.y, u_gamma),
    pow(color.z, u_gamma)
  );
}

vec3 ungamma(vec3 color) {
  float ungamma = 1.0 / u_gamma;
  return vec3(
    pow(color.x, ungamma),
    pow(color.y, ungamma),
    pow(color.z, ungamma)
  );
}

float compare(vec3 c1, vec3 c2) {
  return length(c1 - c2);
}

float luma(vec3 color) {
  return color.x * 0.299 + color.y * 0.587 + color.z * 0.114;
}

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / u_thres_size);
  float threshold = texture2D(u_threshold, thresholdCoord).x;

  vec3 color = texture2D(u_image, v_texCoord).xyz;
  color = gamma(color);

  // Build a list of potential candidates
  vec3 error = vec3(0.0);
  vec3 clist[CLIST_SIZE];
  for (int i = 0; i < CLIST_SIZE; i++) {
    vec3 target = color + error * u_err_mult;
    vec3 candidate = vec3(0.0);
    float dMin = 999999999.0; // Absurdly large number

    // Find the closest color from palette
    for (int j = 0; j < PALETTE_SIZE; j++) {
      vec3 test = u_palette[j];
      test = gamma(test);
      float d = compare(target, test);
      if (d < dMin) {
        dMin = d;
        candidate = test;
      }
    }

    // And add it to the candidate list
    clist[i] = candidate;

    // By adding the candidate's error to the next iteration,
    // the next candidate will compensate for that error thus
    // getting closer to the original color.
    error += color - candidate;
  }

  // Insertion sort the candidate list by luma
  for (int i = 1; i < CLIST_SIZE; i++) {
    for (int j = CLIST_SIZE; j > 0; j--) {
      if (j > i) continue; // silly GLSL won't let me do j = i, next best thing
      if (luma(clist[j-1]) <= luma(clist[j])) break;
      vec3 temp = clist[j-1];
      clist[j-1] = clist[j];
      clist[j] = temp;
    }
  }

  int index = int(threshold * float(CLIST_SIZE));
  if (threshold == 1.0) index = CLIST_SIZE - 1;

  // Silly workaround for GLSL not allowing indexing by variables
  for (int i = 0; i < CLIST_SIZE; i++) {
    if (i == index) color = clist[i];
  }

  color = ungamma(color);

  gl_FragColor = vec4(color, 1.0);
}
