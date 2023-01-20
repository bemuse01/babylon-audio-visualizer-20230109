import Circle from '../../objects/circle.js'

export default class{
    constructor({
        engine,
        scene,
        camera,
        count,
        radius,
        color,
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.count = count
        this.radius = radius
        this.color = color

        this.size = 2.5
        this.tessellation = 3
        this.countStep = 4
        this.moveDist = 1.5
        this.circles = []
        this.opacityStep = [0, 0.25, 0.5, 1, 1, 0]
        this.positionStep = [1, 1.6]
        this.animDuration = 5000
        this.animeDelay = {base: 0, rand: 6000}
        this.gpu = new GPU()
        this.data = this.createData()

        this.init()
    }


    // init
    init(){
        this.create()
        this.createGPGPU()
    }


    // create
    create(){
        const {count, countStep, radius, size, tessellation, scene, engine} = this

        const len = ~~(count / countStep)
        const degree = 360 / len

        for(let i = 0; i < len; i++){
            const material = this.createMaterial()

            const circle = new Circle({
                geometryOpt: {
                    radius: size,
                    tessellation,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE
                },
                scene,
                engine
            })

            circle.setMaterial(material)

            const deg = degree * i * RADIAN
            const x = Math.cos(deg) * radius
            const y = Math.sin(deg) * radius

            circle.get().position.x = x
            circle.get().position.y = y
            circle.get().rotation.x = Math.random() * 360 * RADIAN
            circle.get().rotation.y = Math.random() * 360 * RADIAN
            circle.get().rotation.z = Math.random() * 360 * RADIAN

            circle.deg = deg

            this.circles.push(circle)
        }
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = this.color
        material.alpha = 0
        return material
    }


    // gpgpu
    createGPGPU(){
        this.createGpuKernels()
    }
    createGpuKernels(){
        this.movePosition = this.gpu.createKernel(function(data, positionStep, opacityStep, currentTime){
            const i = this.thread.x
            const idx = i * 3

            const deg = data[idx + 0]
            const delay = data[idx + 1]
            const startTime = data[idx + 2]

            const opacityLen = this.constants.opacityLen
            const positionLen = this.constants.positionLen
            const duration = this.constants.duration
            const radius = this.constants.radius

            const p = (currentTime - startTime - delay) / duration
            const t = clamping(p, 0, 1)

            const len1 = positionLen - 1
            const k1 = len1 * t
            const idx1 = Math.floor(k1)

            const len2 = opacityLen - 1
            const k2 = len2 * t
            const idx2 = Math.floor(k2)

            const currentPos = interpolate(positionStep[idx1], positionStep[idx1 + 1 > len1 ? len1 : idx1 + 1], k1 - idx1)
            const currentOpacity = interpolate(opacityStep[idx2], opacityStep[idx2 + 1 > len2 ? len2 : idx2 + 1], k2 - idx2)

            const x = Math.cos(deg) * radius * currentPos
            const y = Math.sin(deg) * radius * currentPos
            const opacity = currentOpacity
            const animDone = t === 1 ? 1 : 0

            return [x, y, opacity, animDone]
        }).setDynamicOutput(true)

        // this.moveParticle.setInjectedNative(ShaderMethod2.snoise3DHelper())
        this.movePosition.addNativeFunction('interpolate', `
            float interpolate(float p0, float p1, float t){
                return mix(p0, p1, t);
            }
        `)
        this.movePosition.addNativeFunction('clamping', `
            float clamping(float v, float mn, float mx){
                return clamp(v, mn, mx);
            }
        `)
    }
    createData(){
        const {count, countStep, animeDelay} = this
        const len = ~~(count / countStep)
        const degree = 360 / len

        const data = []

        for(let i = 0; i < len; i++){
            const deg = degree * i * RADIAN
            const delay = Math.random() * animeDelay.rand + animeDelay.base
            const startTime = 0

            data.push(deg, delay, startTime)
        }

        return data
    }


    // animate
    animate(){
        this.updatePosition()
    }
    updatePosition(){
        const {opacityStep, positionStep, animDuration, radius, count, countStep} = this

        const len = ~~(count / countStep)
        const degree = 360 / len
        const currentTime = window.performance.now()

        this.movePosition.setOutput([len])
        this.movePosition.setConstants({
            // opacityStep: new Float32Array(opacityStep),
            opacityLen: opacityStep.length,
            // positionStep: [0, 1],
            positionLen: positionStep.length,
            duration: animDuration,
            radius,
        })

        const res = this.movePosition(this.data, positionStep, opacityStep, currentTime)

        for(let i = 0; i < len; i++){
            const item = res[i]
            const idx2 = i * 3
            const circle = this.circles[i]
            const material = circle.getMaterial()

            const x = item[0]
            const y = item[1]
            const opacity = item[2]
            const animDone = item[3]

            if(animDone){
                // this.data[idx2 + 0] = degree * (Math.random() * 360) * RADIAN
                this.data[idx2 + 2] = currentTime
            }
            
            circle.get().position.x = x
            circle.get().position.y = y
            // circle.get().rotation.x += 0.01
            // circle.get().rotation.y += 0.01
            // circle.get().rotation.z += 0.01
            material.alpha = opacity
        }
    }
}