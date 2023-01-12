import Method from '../../../method/method.js' 
import GetShaderName from '../shader/line4.shader.js'
import Line from '../../objects/line.js'

export default class{
    constructor({
        engine,
        scene,
        camera,
        count,
        radius,
        color,
        audioBoost
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.count = count
        this.radius = radius
        this.color = color
        this.audioBoost = audioBoost

        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)
        this.audioData = null
        this.direction = [1, -1]
        this.tPoint = null

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {scene, engine, count} = this

        const material = this.createMaterial()

        this.line = new Line({
            geometryOpt: {
                points: [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0)],
                updatable: true
            },
            scene,
            engine
        })
        this.line.get().isVisible = false
        this.line.setMaterial(material)

        const {audioData, degs} = this.createAttribute()

        // this.line.setVerticesBuffer('aPosition', position, 3, true)
        this.line.setVerticesBuffer('audioData', audioData, 1, true)
        this.line.setVerticesBuffer('deg', degs, 1, true)
        this.line.setVerticesBuffer('direction', [1, -1], 1)

        for(let i = 0; i < count; i++){
            const instance = this.line.get().createInstance('l' + i)
        }
    }
    createAttribute(){
        const {count, radius} = this
        // const position = []
        const audioData = []
        const degs = []

        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN
            // const x = Math.cos(deg) * radius
            // const y = Math.sin(deg) * radius

            // position.push(x, y, 0)
            audioData.push(0)
            degs.push(deg)
        }

        return{
            // position
            audioData,
            degs
        }
    }
    createMaterial(){
        const shaderName = GetShaderName()

        const material = new BABYLON.ShaderMaterial('material', this.scene,
            {
                vertex: shaderName,
                fragment: shaderName
            },
            {
                attributes: ['position', 'uv', 'aPosition', 'direction', 'deg', 'audioData'],
                uniforms: ['worldViewProjection', 'viewProjection', 'uColor', 'rw', 'rh', 'vw', 'vh', 'radius', 'audioBoost'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            }
        )

        material.setFloat('radius', this.radius)
        material.setFloat('audioBoost', this.audioBoost)
        material.setColor3('uColor', this.color)
        material.setFloat('rw', this.rw)
        material.setFloat('rh', this.rh)
        material.setFloat('vw', this.vw)
        material.setFloat('vh', this.vh)

        return material
    }


    // animate
    animate(audioData){
        this.audioData = audioData

        this.render()
    }
    render(){
        const {audioData} = this

        if(!audioData) return

        const audioDataBuffer = this.line.getVertexBuffer('audioData')

        audioDataBuffer.update(audioData)
    }
}