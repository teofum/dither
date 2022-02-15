precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
  vec3 color = texture2D(u_image, v_texCoord).xyz;

  gl_FragColor = vec4(color, 1.0);
}