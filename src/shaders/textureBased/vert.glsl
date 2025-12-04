#version 300 es

layout(location=0) in vec4 a_position;
uniform mat4 u_matrix_projection;
uniform mat4 u_matrix_camera_translation;
uniform mat4 u_matrix_translation;


out vec4 cam_rel_pos;

void main() {
  mat4 worldToLocal = inverse(u_matrix_translation);
  mat4 camToWorld = inverse(u_matrix_camera_translation);
  mat4 camToLocal = worldToLocal * camToWorld;

  cam_rel_pos = camToLocal * a_position;
  gl_Position = u_matrix_projection * a_position;
}

