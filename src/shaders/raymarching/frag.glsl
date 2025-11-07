#version 300 es
precision highp int;
precision highp float;

uniform highp sampler3D volume;
uniform highp sampler2D transfer_fn;

uniform ivec3 u_volume_size;

uniform mat4 u_matrix_translation;
uniform mat4 u_matrix_camera_translation;

in vec4 cam_rel_pos;
out vec4 color;


vec2 rayBoxIntersect(vec3 rayOrigin, vec3 rayDir) {
    vec3 invDir = 1.0 / (rayDir + 0.0000001);
    vec3 t0 = (vec3(-0.5, -0.5, -0.5) - rayOrigin) * invDir;
    vec3 t1 = (vec3(0.5, 0.5, 0.5) - rayOrigin) * invDir;

    vec3 tMin = min(t0, t1);
    vec3 tMax = max(t0, t1);

    float tNear = max(max(tMin.x, tMin.y), tMin.z);
    float tFar = min(min(tMax.x, tMax.y), tMax.z);

    return vec2(tNear, tFar);
}


void main() {
    vec3 rayDir_cam = normalize(cam_rel_pos.xyz);

    mat4 worldToLocal = inverse(u_matrix_translation);
    mat4 camToWorld = inverse(u_matrix_camera_translation);
    mat4 camToLocal = worldToLocal * camToWorld;

    vec3 rayOrigin_local = (camToLocal * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 rayDir_local = normalize((camToLocal * vec4(rayDir_cam, 0.0)).xyz);

	vec2 t_hit = rayBoxIntersect(rayOrigin_local, rayDir_local);

	color = vec4(0.0);
	if (t_hit.x > t_hit.y) {
		discard;
	}
	t_hit.x = max(t_hit.x, 0.0);
	float travelDistance = t_hit.y - t_hit.x ;

	vec3 size = vec3(u_volume_size) * abs(rayDir_local);
	vec3 dt_vec = 1.0 / size;
	float dt = min(dt_vec.x, min(dt_vec.y, dt_vec.z));

	for (float t = t_hit.x; t < t_hit.y; t += dt) {
       	vec3 samplePos = rayOrigin_local + rayDir_local * t + vec3(0.5);
		float val = texture(volume, samplePos).r;
		vec4 voxel_color = texture(transfer_fn, vec2(val, 0.5));
		// voxel_color = vec3(1,0,1); // debug
		float a = val * voxel_color.a;
		color.rgb += (1.0 - color.a) * a * voxel_color.rgb;
		color.a += (1.0 - color.a) * a;


		if (color.a >= 0.95) {
			break;
		}
	}
}
