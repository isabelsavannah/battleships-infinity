class DesignPileModel(GenotypeModel){

    seed(settings){
        return DesignPile.seed(settings);
    }

    reproduce(parents){

    }

    mutate(individual){

    }
}


class DesignPile{

    constructor(parts, meta){
        this.parts = parts;
        this.meta = meta;
    }

    build(){

    }

    static seed(settings){
        let parts = [];
        let partTemplate = PilePart.template(settings);
        for(let i=0; i<settings.genotype.seedParts; i++){
            parts.push(new PilePart(randFromTemplate(partsTemplate)));
        }

        let meta = new PileMeta(randFromTemplate(PileMeta.template(settings)));

        return new DesignPile(parts, meta);
    }
}

function randFromTemplate(template){
    res = {};
    for(key in template){
        res[key] = template[key].random();
    }
}

class PileMeta{

    constructor(params){
        this.parameters = params;
    }

    static template(settings){
        let pid = settings.genotype.pid;
        return {
            p: new GenotypeReal(new polyScaling(pid.pMin, pid.pMax, pid.pExp)),
            d: new GenotypeReal(new polyScaling(pid.dMin, pid.dMax, pid.dExp)),
            i: new GenotypeReal(new PolyScaling(pid.iMin, pid.iMax, pid.iExp)),
            ti: new GenotypeReal(new PolyScaling(pid.tiMin, pid.tiMax, pid.tiExp)),
        }
    }
}

class PilePart{

    constructor(params){
        this.parameters = params;
    }

    static template(settings){
        let geno = settings.genotype
        return {
            x: new GenotypeReal(new LinearScaling(-1*geno.xBound, geno.xBound)),
            y: new GenotypeReal(new LinearScaling(-1*geno.yBound, geno.yBound)),
            theta: new GenotypeReal(new LinearScaling(-Math.PI, Math.PI)),
            radius: new GenotypeReal(new PolyScaling(geno.minBlockRadius, geno.maxBlockRadius, 2)),
            density: new GenotypeReal(new LinearScaling(geno.minDensity, geno.maxDensity)),
            sides: new GenotypeInteger(new LinearScaling(geno.minSides, geno.maxSides)),
            symmetry: new GenotypeWeightedEnum({'a': (1-geno.symmetryChance)/2, 'b': (1-geno.symmetryChance/2), 'both': geno.symmetryChance),
            payload: new GenotypeWeightedEnum({'thruster': geno.payloadWeights.thruster, 'turret': geno.payloadWeight.turret, 'none': 1}),
        }
    }
}
