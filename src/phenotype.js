class PhysPayload{
    constructor(type){
        this.type = type;
    }
}

class PhysBlock{
    constructor(x, y, theta, sides, radius, mass, payload){
        this.x = x;
        this.y = y;
        this.theta = theta;
        this.sides = sides;
        this.radius = radius;
        this.mass = mass;
        this.payload = payload
    }
}

class PhysPile{
    constructor(settings, blocks, meta){
        let pheno = settings.phenotype;
        let rootSettings = pheno.rootBlock;
        let mass = rootSettings.radius*rootSettings.radius*rootSettings.density;
        this.rootBlock = new PhysBlock(0, 0, 0, rootSettings.sides, rootSettings.radius, mass, new PhysPayload("none"));
        this.blocks = blocks;
        this.meta = meta;
    }

    massCentre(){
        var xs = 0;
        var ys = 0;
        var mass = 0;
        for(block of [this.blocks, [this.rootBlock]].flat()){
            mass += block.mass;
            xs += block.x*block.mass;
            ys += block.y*block.mass;
        }

        return({x: xs/mass, y:ys/mass});
    }

    removeCollisions(){

    }

    drawConnections(){

    }
}

export {PhysPayload, PhysBlock, PhysPile}
