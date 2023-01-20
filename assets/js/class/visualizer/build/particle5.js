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
        this.twAnimLength = 3000
        this.twAnimDelay = {base: 0, rand: 3000}

        this.init()
    }


    // init
    init(){
        this.create()
        this.createAnimation()
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
    
    
    // animation
    createAnimation(){
        this.circles.forEach(circle => {
            const mesh = circle.get()
            const pos = mesh.position

            const framePerSec = 10
            const frame = 30

            // alpha anim
            const alphaAnim = new BABYLON.Animation('alphaAnim', 'material.alpha', framePerSec, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)

            const alphaKeys = []
            alphaKeys.push({frame: 0, value: 0})
            alphaKeys.push({frame: frame, value: 1})
            alphaKeys.push({frame: frame * 2, value: 0})
            alphaAnim.setKeys(alphaKeys)

            mesh.animations.push(alphaAnim)

            // position anim
            const posFrom = pos.clone()
            const posTo = new BABYLON.Vector3(pos.x * 1.75, pos.y * 1.75, pos.z)
            const posAnim = new BABYLON.Animation('posAnim', 'position', framePerSec, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
            const posKeys = []
            posKeys.push({frame: 0, value: posFrom})
            posKeys.push({frame: frame * 2, value: posTo})
            posAnim.setKeys(posKeys)

            const animGroup = new BABYLON.AnimationGroup('animGroup')
            animGroup.addTargetedAnimation(alphaAnim, mesh)
            animGroup.addTargetedAnimation(posAnim, mesh)

            // animGroup.onAnimationGroupLoopObservable.add(() => {
            //      console.log('loop')
            // })

            setTimeout(() => {
                // this.scene.beginAnimation(mesh, 0, frame * 2, true), Math.random() * 3000
                animGroup.play(true)

            }, Math.random() * 6000)
        })
    }
}