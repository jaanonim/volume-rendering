precision mediump float;

uniform vec4 u_color;
uniform vec3 u_lightPos;
uniform vec4 u_lightColor;
uniform float u_ambientLight;
uniform vec4 u_ambientColor;
varying vec3 normal;
varying vec4 pos;


void main() {
  vec3 norm = normalize(normal);
  vec3 lightDir = normalize(u_lightPos - pos.xyz);
  float diff = max(dot(norm, lightDir), 0.0);
  vec3 diffuse = diff * u_lightColor.rgb;
  vec3 ambient =  u_ambientLight * u_ambientColor.rgb;
  gl_FragColor = vec4(diffuse + ambient,1.0) * u_color;
}
