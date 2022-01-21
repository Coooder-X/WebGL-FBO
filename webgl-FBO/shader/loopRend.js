var bufferA = `#version 300 es
precision mediump float;

uniform vec2    iResolution;
uniform float   iTime;
uniform float   iChannelTime[4];
uniform vec3    iMouse;
uniform vec4    iDate;
uniform float   iSampleRate;
uniform vec3    iChannelResolution[4];
uniform int     iFrame;
uniform float   iTimeDelta;
uniform float   iFrameRate;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

in  vec2 fragCoord;
out vec4 fragColor;

//Hash functions (randomized by frame #)
float hash(float n) {
    n+=0.1*float(iFrame);
    return fract(sin(n * 12.9898)*43758.5453);
}
float hash2(vec2 n){
    n+=0.1*float(iFrame);
    return fract(sin(dot(n, vec2(12.9898,78.233))) * 43758.5453);
}
float hash3(vec3 n) {
    n+=0.1*float(iFrame);
    return fract(sin(dot(n, vec3(12.9898,78.233,471.17))) * 43758.5453);
}

//Generate a random ray in a rotated unit hemisphere
/*vec3 hemi(vec3 d, float n){
    float a = hash(n) * 6.283 * 2.0;
    vec3 p = hash(-n) * vec3(sin(a), cos(a), 0.0);
    
    p.z = sqrt(1.0 - p.x*p.x - p.y*p.y);
    
    if (a < 6.283)
        p.z = -p.z;
    
    
    //if on wrong side of reflection plane
    if (dot(p, d) < 0.0) 
        return p - 2.0 * dot(p, d) / dot(d, d) * d;
    return p;
}*/
vec3 hemi(vec3 d, float n){
    float a = hash(n) * 6.283 * 2.0;
    float b = hash(-n) * 6.283 * 2.0;
    
    vec3 p = vec3(sin(a)*cos(b), sin(a)*sin(b), cos(a));
    
    //if on wrong side of reflection plane
    if (dot(p, d) < 0.0) 
        return p - 2.0 * dot(p, d) / dot(d, d) * d;
    return p;
}
//Generate a (non-uniform) random ray in a rotated unit hemisphere
vec3 hemi_spec(vec3 d, float n){
    float a = hash(n) * 6.283 * 2.0;
    vec3 p = pow(hash(-n), 4.0) * vec3(sin(a), cos(a), 0.0);
    
    p.z = sqrt(1.0 - p.x*p.x - p.y*p.y);
    
    if (a < 6.283)
        p.z = -p.z;
    
    
    //if on wrong side of reflection plane
    if (dot(p, d) < 0.0) 
        return p - 2.0 * dot(p, d) / dot(d, d) * d;
    return p;
}

//Analytical sphere
float sphere(vec3 ro, vec3 rd, vec4 sph) {
    vec3 o = ro - sph.xyz;
    float b = dot(o, rd);
    float c = dot(o, o) - sph.w * sph.w;
    float h = b*b - c;
    if (h > 0.0)
        return - sqrt(h) - b;
    return -1.0;
}
vec3 sphereNormal(vec4 sph, vec3 p) {
    return (p - sph.xyz) / sph.w;
}

//Scene function (cannot vary with time)
vec4 intersect(vec3 ro, vec3 rd, out vec3 col) {
    vec4 sph1 = vec4(+0.8, 0, 1.0, 1);
    vec4 sph2 = vec4(-1.2, -0.6, 1.5, 1);
    
    float t = 1000.0, i;
    vec3 n = vec3(0.0);
   
    
    //Intersect with spheres
    i = sphere(ro, rd, sph1);
    if (i > 0.0){
        t=i;
        n = sphereNormal(sph1, ro + rd * t);
        col = vec3(1.0, 0.75, 0.3);
    }
    
    i = sphere(ro, rd, sph2);
    if (i > 0.0 && i < t){
        t=i;
        n = sphereNormal(sph2, ro + rd * t);
        col = vec3(0.3, 0.9, 0.8);
    }
    
    //Ground
    i = -(ro.y - 1.0) / rd.y;
    if (i > 0.0 && i < t){
        t=i;
 		n = vec3(0.0, -1.0, 0.0);
        col = vec3(0.5, 0.8, 0.5);
    }
    
    //Wall
    /*i = -(ro.z - 2.0) / rd.z;
    if (i > 0.0 && i < t){
        t=i;
 		n = vec3(0.0, -1.0, 0.0);
        col = vec3(1.0, 1.0, 1.0);
    }*/
    
    i = -(ro.x - 2.0) / rd.x;
    if (i > 0.0 && i < t){
        t=i;
 		n = vec3(1.0, 0.0, 0.0);
        col = vec3(0.1, 0.1, 1.0);
    }
    
    i = -(ro.x + 2.0) / rd.x;
    if (i > 0.0 && i < t){
        t=i;
 		n = vec3(-1.0, 0.0, 0.0);
        col = vec3(1.0, 0.1, 0.1);
    }
    
    return vec4(n, t);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = (iResolution.xy - fragCoord * 2.0) / iResolution.y;
    vec2 mp = (iResolution.xy - iMouse.xy * 2.0) / iResolution.y;
    
    float rnd = 10.0 * hash2(uv);
    
    
    vec3 light = vec3(0.0, -.701, -.701);
    
    vec3 ro = vec3(0.0, 0.0, -1.0);
    vec3 rd = normalize(vec3(uv, 0.9));
    
    vec4 s = vec4(rd, 0);
    
    float rc = 1.0;
    
    vec3 col = vec3(0.0);
    vec3 mcol = vec3(0.0);
    vec3 scol = vec3(0.0);
    
    //trace
    for (int i = 0; i < 40; i++){
        s = intersect(ro, rd, mcol);
        if (s.w > 999.) break;
        
        
		
        ro += s.w * rd;
        rd = normalize(reflect(rd, s.xyz)*0.7+0.3*hemi(s.xyz, rnd + float(i)));
        ro += rd * 0.0001;
        
        
        if (intersect(ro, 
                      light, 
                      scol).w > 999.) {
            float d = max(0.0, dot(rd, light));
            d = 0.4 * d + 0.4 * d*d*d*d*d*d + 0.4;
        	col += rc * mcol * d / (1.0 + dot(ro, ro) * 0.03);
        }
        
        rc *= 0.45;
    }
    
    
    //accumulate image
    vec4 new = vec4(vec3(col), 1.0);
    vec4 old = texture(iChannel0, fragCoord / iResolution.xy);
    
    float frame = float(iFrame);
    if (frame > 0.5)
    	fragColor = ((frame - 1.0) * old + new) / frame;
    else 
        fragColor = new;
}

void main() 
{
    vec4 color = vec4(0.0,0.0,0.0,1.0);
    mainImage(color, gl_FragCoord.xy);
    if(fragColor.w<0.0) color=vec4(1.0,0.0,0.0,1.0);
    if(fragColor.x<0.0) color=vec4(1.0,0.0,0.0,1.0);
    if(fragColor.y<0.0) color=vec4(0.0,1.0,0.0,1.0);
    if(fragColor.z<0.0) color=vec4(0.0,0.0,1.0,1.0);
    if(fragColor.w<0.0) color=vec4(1.0,1.0,0.0,1.0);
    fragColor = vec4(color.xyz,1.0);
}`

var image = `#version 300 es
precision mediump float;

uniform vec2    iResolution;
uniform float   iTime;
uniform float   iChannelTime[4];
uniform vec3    iMouse;
uniform vec4    iDate;
uniform float   iSampleRate;
uniform vec3    iChannelResolution[4];
uniform int     iFrame;
uniform float   iTimeDelta;
uniform float   iFrameRate;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

in  vec2 fragCoord;
out vec4 fragColor;

//Display the buffer
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;
	fragColor = texture(iChannel0, uv);
}

void main() 
{
    vec4 color = vec4(0.0,0.0,0.0,1.0);
    mainImage(color, gl_FragCoord.xy);
    if(fragColor.w<0.0) color=vec4(1.0,0.0,0.0,1.0);
    if(fragColor.x<0.0) color=vec4(1.0,0.0,0.0,1.0);
    if(fragColor.y<0.0) color=vec4(0.0,1.0,0.0,1.0);
    if(fragColor.z<0.0) color=vec4(0.0,0.0,1.0,1.0);
    if(fragColor.w<0.0) color=vec4(1.0,1.0,0.0,1.0);
    fragColor = vec4(color.xyz,1.0);
}
`