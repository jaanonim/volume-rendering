// an attribute will receive data from a buffer
attribute vec4 a_position;
attribute vec3 a_normal;
uniform mat4 u_matrix;
varying vec3 normal;
varying vec4 pos;

void main() {
  pos = u_matrix * a_position;
  normal = a_normal;
  gl_Position = pos;
}
