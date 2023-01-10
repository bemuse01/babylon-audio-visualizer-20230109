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
        audio
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.audio = audio

        this.count = 120
        this.radius = 25
        this.color = BABYLON.Color3.FromHexString('#00ffe4')
        this.splineSmooth = 0.6
        this.audioDataLen = this.audio.fftSize / 2
        this.audioBoost = 25
        // this.audioStep = 60
        this.audioStep = ~~(this.audioDataLen / this.count)
        this.audioIndexOffset = 0
        this.xs = Array.from({length: this.count}, (_, i) => i * 1)
        this.lines = []
        this.params = [
            {
                boost: 1,
            },
            {
                boost: -1,
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
    animate(){
        this.render()
    }
    render(){
        const {radius, params, audioBoost, count} = this
        const {audioData} = this.audio

        if(!audioData) return

        const stepData = this.createStepAudioData(audioData)
        const splinedData = this.createSplinedAudioData(stepData)

        this.lines.forEach((line, idx) => {
            const {boost} = params[idx]
            const position = line.getVerticesData('position')
            const len = position.length / 3

            const degree = 360 / count

            for(let i = 0; i < len; i++){
                const index = i * 3
                const deg = degree * i * RADIAN
                const rad = radius + splinedData[i] * boost * audioBoost

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
    createStepAudioData(audioData){
        return Array.from({length: this.count}, (_, i) => audioData[this.audioIndexOffset + i * this.audioStep] / 255)
    }
    createSplinedAudioData(audioData){
        const len = audioData.length
        const ats = []

        const xs = this.xs
        const ys = audioData
        // ys[0] = 0

        const spline = new Spline(xs, ys)
        
        for(let i = 0; i < len; i++){
            ats.push(spline.at(i * this.splineSmooth))
        }
        
        // const hats = ats.slice(0, ats.length / 2)
        const avg = (ats.reduce((p, c) => p + c) / len) * 0.9
        const temp = ats.map((e, i) => Math.max(0, e - avg))

        // const reverse = [...temp]
        // reverse.reverse()

        // return [...temp, ...reverse]
        return temp
    }
}