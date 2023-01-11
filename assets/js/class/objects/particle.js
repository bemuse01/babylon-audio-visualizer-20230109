export default class{
    constructor({option, scene, engine}){
        this.option = option
        this.scene = scene
        this.engine = engine

        this.sps = null
        this.mesh = null

        this.init()
    }

    
    // init
    init(){
        this.create()
    }


    // create
    create(){        
        this.sps = this.createSPS()
        this.addShapes()

        const material = this.createMaterial()
        this.mesh = this.sps.buildMesh()
        this.mesh.material = material
    }
    createSPS(){
        const sps = new BABYLON.SolidParticleSystem('sps', this.scene)
        return sps
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial('material', this.scene)
        // const material = new BABYLON.PBRMaterial('material', this.scene)
        material.emissiveColor = new BABYLON.Color3(1, 1, 1)
        return material
    }


    // add
    addShapes(){
        for(const option of this.option){
            const {shape, count} = option
            this.sps.addShape(shape, count)
            shape.dispose()
        }

    }


    // set
    setMaterial(material){
        this.disposeMaterial()
        this.mesh.material = material
    }
    setVerticesBuffer(name, data, size, instanced = false){
        const buffer = new BABYLON.VertexBuffer(this.engine, data, name, true, false, size, instanced);
        this.mesh.setVerticesBuffer(buffer)
    }


    // get
    getSPS(){
        return this.sps
    }
    getMesh(){
        return this.mesh
    }
    getVerticesData(name){
        return this.mesh.getVerticesData(name)
    }
    getVertexBuffer(name){
        return this.mesh.getVertexBuffer(name)
    }
    getMaterial(){
        return this.mesh.material
    }

    
    // dispose
    disposeMaterial(){
        this.mesh.material.dispose()
    }


    // update
    updateVerticesData(name, data){
        this.mesh.updateVerticesData(name, data)
    }
}