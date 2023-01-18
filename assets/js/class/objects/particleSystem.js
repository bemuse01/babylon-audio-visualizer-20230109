export default class{
    constructor({
        capacity,
        size = {minSize: 1, maxSize: 1},
        emitRate = 50,
        lifeTime = {minLifeTime: 1, maxLifeTime: 1},
        emitPower = {minEmitPower: 1, maxEmitPower: 1},
        updateSpeed = 0.005,
        angularSpeed = {minAngularSpeed: 0, maxAngularSpeed: 0},
        initRotation = 0,
        texture,
        scene
    }){
        this.capacity = capacity
        this.size = size
        this.emitRate = emitRate
        this.lifeTime = lifeTime
        this.texture = texture
        this.emitPower = emitPower
        this.updateSpeed = updateSpeed
        this.angularSpeed = angularSpeed
        this.initRotation = initRotation
        this.scene = scene

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.ps = new BABYLON.ParticleSystem('particleSystem', this.capacity, this.scene)

        this.ps.particleTexture = this.texture

        this.ps.emitter = BABYLON.Vector3.Zero()

        this.ps.emitRate = this.emitRate
        
        this.ps.color1 = new BABYLON.Color4(1, 1, 1, 1.0)
        this.ps.color2 = new BABYLON.Color4(1, 1, 1, 1.0)
        this.ps.colorDead = new BABYLON.Color4(1, 1, 1, 0.0)

        this.ps.minSize = this.size.minSize
        this.ps.maxSize = this.size.maxSize

        this.ps.minLifeTime = this.lifeTime.minLifeTime
        this.ps.maxLifeTime = this.lifeTime.maxLifeTime

        this.ps.minEmitPower = this.emitPower.minEmitPower
        this.ps.maxEmitPower = this.emitPower.maxEmitPower
        this.ps.updateSpeed = this.updateSpeed

        this.ps.minAngularSpeed = this.angularSpeed.minAngularSpeed
        this.ps.maxAngularSpeed = this.angularSpeed.maxAngularSpeed

        this.ps.minInitialRotation = 0
        this.ps.maxInitialRotation = this.initRotation

        console.log(this.ps)

        this.ps.start()
    }


    // set
    setShapeEmitter(type, params){
        this.ps[type](...params)
    }
    setCustomEmitter(emitter){
        this.ps.particleEmitterType = emitter
    }
    setColor(color1, color2, colorDead){
        this.ps.color1 = color1
        this.ps.color2 = color2
        this.ps.colorDead = colorDead

    }
    setRampGradients(gradients){

        const len = gradients.length
        const step = 1 / (len - 1)

        gradients.forEach((g, i) => {
            const t = step * i

            this.ps.addRampGradient(t, new BABYLON.Color3(g, g, g))

            console.log(g, g, g, t)
        })

        this.ps.useRampGradients = true
    }


    // get
    get(){
        return this.ps
    }
}