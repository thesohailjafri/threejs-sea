

uniform vec3 uSurfaceColor;
uniform vec3 uDeepColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

varying vec2 vUv;
varying float vElevation;

float pi=3.14;

void main()
{
float colorStrenght= uColorMultiplier + uColorOffset;
vec3 waterColorMix = mix(uDeepColor, uSurfaceColor, vElevation * colorStrenght);
gl_FragColor = vec4(waterColorMix,1.0);

} 