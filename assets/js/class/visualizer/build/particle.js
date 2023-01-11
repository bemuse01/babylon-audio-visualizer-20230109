import Particle from '../../objects/particle.js'

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

        this.iter = 2
        this.size = 0.15
        this.tessellation = 6
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
        const {scene, engine, size, tessellation, count, iter} = this

        const material = this.createMaterial()
        const circle = BABYLON.MeshBuilder.CreateDisc('circle', {radius: size, tessellation}, this.scene)

        this.particle = new Particle({
            option: [
                {shape: circle, count: count * iter}
            ],
            scene,
            engine
        })

        this.particle.setMaterial(material)

        this.setPosition()
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = this.color
        // material.alpha = 0.5
        // material.alphaMode = BABYLON.Engine.ALPHA_ADD
        return material
    }
    

    // set
    setPosition(){
        const {radius, count, iter} = this
        const sps = this.particle.getSPS()

        const degree = 360 / count
        let n = 0

        for(let j = 0; j < iter; j++){

            for(let i = 0; i < count; i++){
                const particle = sps.particles[n++]

                const deg = degree * i * RADIAN
                const x = Math.cos(deg) * radius
                const y = Math.sin(deg) * radius

                particle.position.x = x
                particle.position.y = y
            }

        }

        sps.setParticles()
    }


    // animate
    animate(audioData){
        this.audioData = audioData

        this.render()
    }
    render(){
        const {radius, count, iter, audioBoost, audioData} = this

        if(!audioData) return

        const sps = this.particle.getSPS()

        const degree = 360 / count
        let n = 0

        for(let j = 0; j < iter; j++){

            const direction = this.direction[j]

            for(let i = 0; i < count; i++){
                const particle = sps.particles[n++]

                const rad = radius + audioData[i] * audioBoost * direction
                const deg = degree * i * RADIAN
                const x = Math.cos(deg) * rad
                const y = Math.sin(deg) * rad

                particle.position.x = x
                particle.position.y = y
            }

        }

        sps.setParticles()
    }
}