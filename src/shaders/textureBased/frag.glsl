#version 300 es
precision highp int;
precision highp float;

out vec4 color;
in vec4 cam_rel_pos;

uniform highp sampler3D volume;
uniform highp sampler2D transfer_fn;

void main() {
    float val = texture(volume, cam_rel_pos.xyz + vec3(0.5)).r;
		color = texture(transfer_fn, vec2(val, 0.5));
    color.a = val;
}
