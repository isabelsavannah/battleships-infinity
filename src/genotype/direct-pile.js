import {GenotypeReal, GenotypeInteger, LinearScaling, PolyScaling, GenotypeWeightedEnum} from './value.js';
import {PhysPile, PhysBlock, PhysPayload} from '../phenotype.js';
import {assert} from '../assert.js';
import {pickCrossoverSelector}

let DesignPileModel = {
    seed: function(settings){
        return DesignPile.seed(settings);
    },

    reproduce: function(settings, parentA, parentB){
        if(Math.rand() < 0.5){
            let temp = parentA;
            parentA = parentA;
            parentB = temp;
        }
        let selector = pickCrossoverSelector(settings, parentA);
        let newParts = [selector.allIn(parentA), selector.allOut(parentB)].flat();
        let newMeta = new PileMeta(crossoverValues(parentA.meta.parameters, parentB.meta.parameters));

        var newPile = new DesignPile(settings, newParts, newMeta);

        while(Math.rand() < settings.mutationWeights.globalChance){
            newPile = DesignPileModel.mutate(settings, newPile);
        }

        return newPile;
    },

    mutate: function(settings, individual){
        return individual;
    },
}

function crossoverValues(valsA, valsB){
    valsResult = {};
    for(key in valsA){
        valsResult[key] = Math.rand() < 0.5 ? valsA[key] : valsB[key];
    }

    return valsResult;
}

class DesignPile{

    constructor(settings, parts, meta){
        this.settings = settings;
        this.parts = parts;
        this.meta = meta;

        this.metaTemplate = DesignMeta.template(settings);
        this.partTemplate = DesignPart.template(settings);
    }

    pretty(){
        let lines = this.parts.map(x => x.pretty());
        lines.push(this.meta.pretty());
        return lines;
    }

    build(){
        let parts = [];
        for(let part of this.parts){
            let params = phenotypesFromTemplate(part.parameters, this.partTemplate);
            let mass = params.radius*params.radius*params.density;
            let payload = new PhysPayload(params.payload);

            if(params.symmetry === 'a' || params.symmetry === 'both'){
                parts.push(new PhysBlock(params.x, params.y, params.theta, params.sides, params.radius, mass, payload));
            }

            if(params.symmetry === 'b' || params.symmetry === 'both'){
                parts.push(new PhysBlock(-1*params.x, params.y, -1*params.theta, params.sides, params.radius, mass, payload));
            }
        }

        let meta = phenotypesFromTemplate(this.meta.parameters, this.metaTemplate);
        return new PhysPile(this.settings, parts, meta);
    }

    static seed(settings){
        let parts = [];
        let partTemplate = PilePart.template(settings);
        for(let i=0; i<settings.genotype.seedParts; i++){
            parts.push(new PilePart(randFromTemplate(partTemplate)));
        }

        let meta = new PileMeta(randFromTemplate(PileMeta.template(settings)));

        return new DesignPile(settings, parts, meta);
    }
}

function randFromTemplate(template){
    let res = {};
    for(let key in template){
        res[key] = template[key].random();
    }

    return res;
}

function phenotypesFromTemplate(genotypes, template){
    let res = {}
    for(let key in template){
        res[key] = template[key].phenotype(genotypes[key]);
    }

    return res;
}


class PileMeta{

    constructor(params){
        this.parameters = params;
    }

    pretty(){
        let p = roundTo(this.parameters.p, 5);
        let d = roundTo(this.parameters.d, 4);
        let i = roundTo(this.parameters.i, 6);
        return `angular control parameters: [p: ${p}, d: ${d}, i: ${i}]`
    }

    static template(settings){
        let pid = settings.genotype.pid;
        return {
            p: new GenotypeReal(new PolyScaling(pid.pMin, pid.pMax, pid.pExp), 'relative'),
            d: new GenotypeReal(new PolyScaling(pid.dMin, pid.dMax, pid.dExp), 'relative'),
            i: new GenotypeReal(new PolyScaling(pid.iMin, pid.iMax, pid.iExp), 'relative'),
        }
    }
}

class PilePart{

    constructor(params){
        assert(params);
        this.parameters = params;
    }

    pretty(){
        let theta = `${Math.round(this.parameters.theta / Math.PI * 180)}°`;
        let coords = `(${Math.round(this.parameters.x)}, ${Math.round(this.parameters.y)}, ${theta})`;
        let radius = Math.round(this.parameters.radius);
        let density = roundTo(this.parameters.density, 1);
        let sides = Math.round(this.parameters.sides);
        let symmetry = {'a': "", 'b': ", flipped about y", "both": ", mirrored about y"}[this.parameters.symmetry];
        let payload = this.parameters.payload === 'none' ? "" : `, carrying a ${this.parameters.payload}`;
        return `radius ${radius} ${polygonName(sides)}, at ${coords}, with density ${density}${symmetry}${payload}`;
    }

    static template(settings){
        let geno = settings.genotype
        return {
            x: new GenotypeReal(new LinearScaling(-1*geno.xBound, geno.xBound), 'relative'),
            y: new GenotypeReal(new LinearScaling(-1*geno.yBound, geno.yBound), 'relative'),
            theta: new GenotypeReal(new LinearScaling(-Math.PI, Math.PI), 'absolute'),
            radius: new GenotypeReal(new PolyScaling(geno.minBlockRadius, geno.maxBlockRadius, 2), 'relative'),
            density: new GenotypeReal(new LinearScaling(geno.minDensity, geno.maxDensity), 'relative'),
            sides: new GenotypeInteger(new LinearScaling(geno.minSides, geno.maxSides), 'absolute'),
            symmetry: new GenotypeWeightedEnum({'a': (1-geno.symmetryChance)/2, 'b': (1-geno.symmetryChance)/2, 'both': geno.symmetryChance}),
            payload: new GenotypeWeightedEnum({'thruster': geno.payloadWeights.thruster, 'turret': geno.payloadWeights.turret, 'none': 1}),
        }
    }
}

function polygonName(n){
    switch(n) {
        case 3: return 'triangle'
        case 4: return 'square'
        case 5: return 'pentagon'
        case 6: return 'hexagon'
        case 7: return 'heptagon'
        case 8: return 'octagon'
        case 9: return 'nonagon'
        case 10: return 'decagon'
        default: return (n+"-gon")
    }
}

function roundTo(n, places){
    let factor = 10**places;
    return Math.round(n*factor)/factor;
}

export {DesignPileModel}
