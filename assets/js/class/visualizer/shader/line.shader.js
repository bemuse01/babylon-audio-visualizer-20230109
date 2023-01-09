// import ShaderMethod from '../../../method/method.shader.js'

const name = 'visualizerLine'

const getShaderName = () => {
    const vertex = `
        attribute vec3 position;
        attribute vec2 uv;
        attribute float audio;

        uniform mat4 worldViewProjection;

        void main(){
            vec3 nPosition = position;

            nPosition.xy += audio;

            gl_Position = worldViewProjection * vec4(nPosition, 1.0);
        }
    `
    const fragment = `
        void main(){
            gl_FragColor = vec4(1);
        }
    `
    
    BABYLON.Effect.ShadersStore[name + 'VertexShader'] = vertex
    BABYLON.Effect.ShadersStore[name + 'FragmentShader'] = fragment

    return name
}

export default getShaderName