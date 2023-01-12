// import ShaderMethod from '../../../method/method.shader.js'

const name = 'visualizerLine3'

const getShaderName = () => {
    const vertex = `
        attribute vec3 position;
        attribute vec2 uv;
        attribute vec3 center;
        attribute float direction;
        attribute float audioData;
        attribute float deg;
        attribute vec2 coord;

        uniform mat4 worldViewProjection;
        uniform float radius;
        uniform float audioBoost;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vCenter;
        varying float vDirection;
        varying vec2 vCoord;

        void main(){
            // vec3 nPosition = position;

            // float rad = radius + audioData * audioBoost * direction;
            // float x = cos(deg) * rad;
            // float y = sin(deg) * rad;

            // nPosition.xy = vec2(x, y);

            gl_Position = worldViewProjection * vec4(position, 1.0);

            // vPosition = nPosition;
            vUv = uv;
            vCenter = center;
            vDirection = direction;
            vCoord = coord;
        }
    `
    const fragment = `
        uniform vec3 uColor;
        uniform float rw;
        uniform float rh;
        uniform float vw;
        uniform float vh;
        uniform sampler2D tPoint;

        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vCenter;
        varying float vDirection;
        varying vec2 vCoord;

        void main(){
            // float opacity = distance(vUv, vec2(0.5)) * 2.0;
            // float dist = distance(vPosition, vPosition - 0.125 * vDirection) / 1.0;

            vec4 point = texelFetch(tPoint, ivec2(0, 0), 0);

            vec2 coord = gl_FragCoord.xy - (vec2(rw, rh) * 0.5);
            vec2 ratio = coord / (vec2(rw, rh) * 0.5);
            vec2 uv = (vec2(vw, vh) * 0.5) * ratio;
            
            float dist = distance(uv, point.xy);
            float opacity = 0.25;

            if(dist < 1.0) opacity = 1.0;

            gl_FragColor = vec4(uColor, opacity);
        }
    `
    
    BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
    BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

    return name
}

export default getShaderName