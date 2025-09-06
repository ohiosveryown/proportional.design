uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uGridSize;

void main()
{
  vec2 uv=gl_FragCoord.xy/resolution.xy;

  vec4 color=texture(uGrid,uv);

  // Smoother distance calculation with larger falloff
  float dist=distance(uv,uMouse);
  dist=1.-(smoothstep(0.,.4,dist));

  // Apply smoother displacement with less aggressive falloff
  color.rg+=uDeltaMouse*dist*.8;

  // Slower relaxation for more fluid movement
  float uRelaxation=.98;
  color.rg*=uRelaxation;

  gl_FragColor=color;
}
