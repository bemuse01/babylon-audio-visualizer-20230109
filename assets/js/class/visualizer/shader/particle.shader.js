// import ShaderMethod from '../../../method/method.shader.js'

const name = 'visualizerLine'

const getShaderName = () => {
    const vertex = `
        attribute vec3 position;
        attribute vec2 uv;
        attribute float audio;

        uniform mat4 worldViewProjection;

        varying vec2 vUv;

        void main(){
            gl_Position = worldViewProjection * vec4(position, 1.0);

            vUv = uv;
        }
    `
    const fragment = `
        uniform vec3 uColor;    

        varying vec2 vUv;

        void main(){
            // float opacity = distance(vUv, vec2(0.5)) * 2.0;

            gl_FragColor = vec4(uColor, 1.0);
        }
    `
    
    BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
    BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

    return name
}

export default getShaderName