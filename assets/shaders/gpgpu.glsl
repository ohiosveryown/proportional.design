uniform vec2 uMouse;
uniform vec2 uDeltaMouse;
uniform float uGridSize;

void main()
{
  vec2 uv=gl_FragCoord.xy/resolution.xy;

  vec4 color=texture(uGrid,uv);

  float dist=distance(uv,uMouse);
  dist=1.-(smoothstep(0.,.22,dist));

  color.rg+=uDeltaMouse*dist;

  float uRelaxation=.965;
  color.rg*=uRelaxation;

  gl_FragColor=color;
}
