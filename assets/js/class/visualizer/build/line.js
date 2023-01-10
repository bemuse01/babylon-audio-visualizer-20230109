import Line from '../../objects/line.js'
import Spline from '../../../lib/cubic-spline.js'
import Plane from '../../objects/plane.js'
import GetShaderName from '../shader/line.shader.js'
import Method from '../../../method/method.js'

export default class{
    constructor({
        engine,
        scene,
        camera,
        audioBoost,
        count,
        radius,
        color
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.count = count
        this.radius = radius
        this.color = color
        this.audioBoost = audioBoost

        this.audioData = null
        this.lines = []
        this.params = [
            {
                direction: 1,
            },
            {
                direction: -1,
            },
        ]

        this.init()
    }

    
    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {scene, engine} = this

        this.params.forEach(_ => {
            const {points, audio} = this.createAttribute()

            const material = this.createMaterial()

            const line = new Line({
                geometryOpt: {
                    points,
                    updatable: true
                },
                scene,
                engine
            })

            line.setVerticesBuffer('audio', audio, 1)

            line.setMaterial(material)

            this.lines.push(line)
        })
    }
    createAttribute(){
        const {radius, count} = this
        const points = []
        const audio = []

        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN
            const x = Math.cos(deg) * radius 
            const y = Math.sin(deg) * radius

            points.push(new BABYLON.Vector3(x, y, 0))

            audio.push(0)
        }

        points.push(points[0])
        audio.push(0)

        return{
            points,
            audio
        }
    }
    createMaterial(){
        // const shaderName = GetShaderName()

        // const material = new BABYLON.ShaderMaterial('material', this.scene,
        //     {
        //         vertex: shaderName,
        //         fragment: shaderName
        //     },
        //     {
        //         attributes: ['position', 'uv', 'audio'],
        //         uniforms: ['worldViewProjection', 'viewProjection', 'uColor'],
        //         needAlphaBlending: true,
        //         needAlphaTesting: true,
        //     }
        // )
        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = this.color
        // material.disableLighting = true

        // material.setColor3('uColor', this.color)

        return material
    }


    // animate
    animate(audioData){
        this.audioData = audioData

        this.render()
    }
    render(){
        const {radius, params, audioBoost, count, audioData} = this

        if(!audioData) return

        this.lines.forEach((line, idx) => {
            const {direction} = params[idx]
            const position = line.getVerticesData('position')
            const len = position.length / 3

            const degree = 360 / count

            for(let i = 0; i < len; i++){
                const index = i * 3
                const deg = degree * i * RADIAN
                const rad = radius + audioData[i] * audioBoost * direction

                const x = Math.cos(deg) * rad
                const y = Math.sin(deg) * rad

                position[index + 0] = x
                position[index + 1] = y
            }

            position[(len - 1) * 3 + 0] = position[0]
            position[(len - 1) * 3 + 1] = position[1]

            line.updateVerticesData('position', position)
        })
    }
}