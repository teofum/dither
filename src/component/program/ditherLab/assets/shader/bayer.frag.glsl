precision mediump float;

#define PALETTE_SIZE $ // $ is replaced in JS before compiling

uniform vec3 u_palette[PALETTE_SIZE];
uniform vec2 u_texSize;
uniform float u_gamma;
uniform sampler2D u_image;
uniform sampler2D u_threshold;

varying vec2 v_texCoord;

struct ColorMix {
  vec3 color1;
  vec3 color2;
  float ratio;
};

float mixError(vec3 target, vec3 cmix, float compDist, float rmh) {
  return length(target - cmix) + compDist * (abs(rmh) + 0.5) / (40.0 / float(PALETTE_SIZE));
}

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

void main() {
  vec2 thresholdCoord = fract(v_texCoord * u_texSize / 8.0);
  float threshold = texture2D(u_threshold, thresholdCoord).x;

  vec3 color = texture2D(u_image, v_texCoord).xyz;

  vec3 cmix = vec3(0.0);
  vec3 c1 = vec3(0.0);
  vec3 c2 = vec3(0.0);
  vec3 g1 = vec3(0.0);
  vec3 g2 = vec3(0.0);
  ColorMix bestMix = ColorMix(vec3(0.0), vec3(0.0), 0.33);
  float minError = 999999999.0; // absurdly large number

  for(int i1 = 0; i1 < PALETTE_SIZE; i1++) {
    for(int i2 = 0; i2 < PALETTE_SIZE; i2++) {
      if(i2 < i1)
        continue;

      c1 = u_palette[i1];
      c2 = u_palette[i2];

      g1 = gamma(c1);
      g2 = gamma(c2);
      
      for(int ratio = 0; ratio < 64; ratio++) {
        if(i1 == i2 && ratio > 0)
          break;
        float r64 = float(ratio) / 64.0;
        cmix = g1 + r64 * (g2 - g1);

        float cdist = length(c2 - c1);
        float error = mixError(color, ungamma(cmix), cdist, r64 - 0.5);
        if(error < minError) {
          minError = error;
          bestMix = ColorMix(c1, c2, r64);
        }
      }
    }
  }

  color = threshold < bestMix.ratio ? bestMix.color2 : bestMix.color1;

  gl_FragColor = vec4(color, 1.0);
}