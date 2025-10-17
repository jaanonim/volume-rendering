// an attribute will receive data from a buffer
attribute vec4 a_position;
uniform mat4 u_matrix_projection;
uniform mat4 u_matrix_camera_translation;
uniform mat4 u_matrix_translation;

varying vec3 v_ray_dir;

// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  vec4 cam_rel_pos = u_matrix_camera_translation * u_matrix_translation * a_position;
  gl_Position = u_matrix_projection * cam_rel_pos;

  v_ray_dir = (normalize(cam_rel_pos.xyz ) + vec3(0.5,0.5,0.5)) * vec3(1,1,-1);
}
