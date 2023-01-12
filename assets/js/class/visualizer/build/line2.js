import LineSystem from '../../objects/lineSystem.js'

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

        this.audioData = null
        this.direction = [1, -1]

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {scene, engine} = this
        const {lines} = this.createAttribute()
        const material = this.createMaterial()

        this.line = new LineSystem({
            geometryOpt: {
                lines,
                updatable: true
            },
            scene,
            engine
        })

        this.line.setMaterial(material)
    }
    createAttribute(){
        const {radius, count} = this
        const lines = []

        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN
            const x = Math.cos(deg) * radius
            const y = Math.sin(deg) * radius

            lines.push([
                new BABYLON.Vector3(x, y, 0),
                new BABYLON.Vector3(x, y, 0)
            ])
        }

        return{
            lines
        }
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = this.color
    	material.diffuseColor = this.color
        material.alpha = 0.5
        material.alphaMode = BABYLON.Engine.ALPHA_ADD

        return material
    }


    // animate
    animate(audioData){
        this.audioData = audioData

        this.render()
    }
    render(){
        const {radius, audioBoost, count, audioData} = this

        if(!audioData) return

        const position = this.line.getVerticesData('position')

        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN

            for(let j = 0; j < 2; j++){
                const idx = i * 3 * 2 + j * 3
                const direction = this.direction[j]
                const rad = radius + audioData[i] * audioBoost * direction
                const x = Math.cos(deg) * rad
                const y = Math.sin(deg) * rad

                position[idx + 0] = x
                position[idx + 1] = y
            }

        }

        this.line.updateVerticesData('position', position)
    }
}