import "./style.css";

function main() {
  const canvas = document.getElementById("root") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    alert("Cannot get webgl2 context");
    return;
  }
  gl.clearColor(1.0, 1.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

main();
