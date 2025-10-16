// an attribute will receive data from a buffer
attribute vec4 a_position;
uniform mat4 u_matrix;
uniform vec4 u_color;

varying vec4 v_color;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = u_matrix * a_position;
  v_color = vec4((a_position.z + 1.0) /2.0,0,0,1) ;
}
