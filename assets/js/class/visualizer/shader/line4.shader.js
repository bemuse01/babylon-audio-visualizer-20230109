// import ShaderMethod from '../../../method/method.shader.js'

const name = 'visualizerLine3'

const getShaderName = () => {
    const vertex = `
        #include<instancesDeclaration>

        attribute vec3 position;
        attribute vec3 aPosition;
        attribute vec2 uv;
        attribute float direction;
        attribute float audioData;
        attribute float deg;
        attribute vec2 coord;

        // uniform mat4 worldViewProjection;
        uniform mat4 viewProjection;
        uniform float radius;
        uniform float audioBoost;

        varying vec3 vPosition;
        varying float vDirection;
        varying vec2 vCoord;
        varying float vX;
        varying float vY;

        void main(){
            #include<instancesVertex>
            
            vec3 nPosition = position;
            
            float rad = radius + audioData * audioBoost * direction;
            float x = cos(deg) * rad;
            float y = sin(deg) * rad;

            // nPosition += aPosition * direction;
            nPosition.x += x;
            nPosition.y += y;

            gl_Position = viewProjection * finalWorld * vec4(nPosition, 1.0);

            vDirection = direction;
            vX = x;
            vY = y;
            vCoord = coord;
        }
    `
    const fragment = `
        uniform vec3 uColor;
        uniform float rw;
        uniform float rh;
        uniform float vw;
        uniform float vh;

        varying float vX;
        varying float vY;

        void main(){
            // vec2 coord = gl_FragCoord.xy - (vec2(rw, rh) * 0.5);
            vec2 ratio = gl_FragCoord.xy / vec2(rw, rh);
            vec2 uv = vec2(vw, vh) * ratio;
            vec2 pos = vec2(vX, vY) + vec2(vw, vh) * 0.5;
            
            float opacity = 0.0;
            float dist = distance(pos, uv);

            // if(dist < 0.01) opacity = 1.0;

            gl_FragColor = vec4(uColor, 1.0);
        }
    `
    
    BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
    BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

    return name
}

export default getShaderName