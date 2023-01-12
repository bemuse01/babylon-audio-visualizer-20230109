import Method from '../../../method/method.js' 
import GetShaderName from '../shader/line3.shader.js'
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
        const {scene, engine} = this
        const {lines, center, direction, audioData, degs, coord} = this.createAttribute()
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

        this.line.setVerticesBuffer('center', center, 3)
        this.line.setVerticesBuffer('direction', direction, 1)
        this.line.setVerticesBuffer('audioData', audioData, 1)
        this.line.setVerticesBuffer('deg', degs, 1)
        this.line.setVerticesBuffer('coord', coord, 2)
    }
    createAttribute(){
        const {radius, count} = this
        const lines = []
        const center = []
        const direction = []
        const audioData = []
        const degs = []
        const coord = []

        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN
            const x = Math.cos(deg) * radius
            const y = Math.sin(deg) * radius

            lines.push([
                new BABYLON.Vector3(x, y, 0),
                new BABYLON.Vector3(x, y, 0)
            ])

            center.push(x, y, 0)
            center.push(x, y, 0)

            direction.push(1)
            direction.push(-1)

            audioData.push(0)
            audioData.push(0)

            degs.push(deg)
            degs.push(deg)

            coord.push(0, i)
            coord.push(1, i)
        }

        return{
            lines,
            center,
            direction,
            audioData,
            degs,
            coord
        }
    }
    createMaterial(){
        const shaderName = GetShaderName()

        const {points} = this.createTexture()
        this.tPoint = points

        const material = new BABYLON.ShaderMaterial('material', this.scene,
            {
                vertex: shaderName,
                fragment: shaderName
            },
            {
                attributes: ['position', 'uv', 'center', 'direction', 'deg', 'audioData'],
                uniforms: ['worldViewProjection', 'uColor', 'rw', 'rh', 'vw', 'vh', 'radius', 'audioBoost', 'tPoint'],
                needAlphaBlending: true,
                needAlphaTesting: true,
            }
        )

        material.setColor3('uColor', this.color)
        material.setFloat('rw', this.rw)
        material.setFloat('rh', this.rh)
        material.setFloat('vw', this.vw)
        material.setFloat('vh', this.vh)
        material.setFloat('radius', this.radius)
        material.setFloat('audioBoost', this.audioBoost)
        material.setTexture('tPoint', this.tPoint)

        return material
    }
    createTexture(){
        const {count, rw, rh, vw, vh, scene} = this
        const points = []

        for(let i = 0; i < count; i++){

            for(let j = 0; j < 2; j++){
                points.push(0, 0, 0, 0)
            }

        }

        return {
            points: BABYLON.RawTexture.CreateRGBATexture(
                new Float32Array(points), 
                count, 
                2, 
                scene,
                false,
                false,
                BABYLON.Texture.NEAREST_SAMPLINGMODE,
                BABYLON.Engine.TEXTURETYPE_FLOAT
            )
        }
    }


    // animate
    animate(audioData){
        this.audioData = audioData

        this.render()
    }
    render(){
        const {radius, audioBoost, count, audioData} = this

        if(!audioData) return

        const material = this.line.getMaterial()
        const position = this.line.getVerticesData('position')
        // const directionBuffer = this.line.getVertexBuffer('dist')
        // const direction = directionBuffer.getData()
        const point = new Float32Array(count * 2 * 4)

        const degree = 360 / count

        for(let i = 0; i < count; i++){
            const deg = degree * i * RADIAN

            for(let j = 0; j < 2; j++){
                const idx = i * 3 * 2 + j * 3
                const idx2 = i * 4 * 2 + j * 4

                const direction = this.direction[j]
                const rad = radius + audioData[i] * audioBoost * direction
                const x = Math.cos(deg) * rad
                const y = Math.sin(deg) * rad

                position[idx + 0] = x
                position[idx + 1] = y

                point[idx2 + 0] = x
                point[idx2 + 1] = y
                // dist[idx2 + 0] = audioData[i] * audioBoost
                // dist[idx2 + 1] = audioData[i] * audioBoost
            }

        }

        this.line.updateVerticesData('position', position)

        this.tPoint.update(point)
        material.setTexture('tPoint', this.tPoint)
    }
}