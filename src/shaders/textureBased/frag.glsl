#version 300 es

precision highp float;
out vec4 color;
in vec4 cam_rel_pos;

void main() {
    
  color = vec4(1.0,-cam_rel_pos.z,0.0,0.5);
}
