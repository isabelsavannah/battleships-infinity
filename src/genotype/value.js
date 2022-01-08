import {randWeights, randFloat, randFloatRange} from '../rand.js';
import {logger} from '../logging.js'
import {assert} from '../assert.js'

class PolyScaling{
    constructor(min, max, exponent){
        this.exponent = exponent;
        this.scaledMin = this.scale(min);
        this.scaledMax = this.scale(max);
    }

    scale(val){
        return Math.pow(val, 1/this.exponent);
    }

    unscale(val){
        return Math.pow(val, this.exponent);
    }


    random(){
        let scaledChoice = randFloatRange(this.scaledMin, this.scaledMax);
        return this.unscale(scaledChoice);
    }

    scaleAbsolute(current, scale){
        let delta = scale * (this.scaledMax - this.scaledMin);
        let newScaled = Math.max(this.scaledMin, Math.min(this.scaledMax, delta + this.scale(current)));
        return this.unscale(newScaled);
    }

    scaleRelative(current, scale){
        let delta = scale * this.scale(current);
        let newScaled = Math.max(this.scaledMin, Math.min(this.scaledMax, delta + this.scale(current)));
        return this.unscale(newScaled);
    }
}

class LinearScaling extends PolyScaling{
    constructor(min, max){
        super(min, max, 1);
    }
}

class GenotypeReal{
    constructor(scaling, mutation){
        this.scaling = scaling;
        this.mutation = mutation;
    }

    mutate(current, amplitude){
        let scale = randFloatRange(-1, 1) * amplitude;
        if(this.mutation === 'absolute'){
            return this.scaling.scaleAbsolute(current, scale);
        }else if(this.mutation === 'relative'){
            return this.scaling.scaleRelative(current, scale);
        }else{
            assert(false);
        }
    }

    random(){
        return this.scaling.random();
    }

    phenotype(gene){
        return gene;
    }
}

class GenotypeInteger extends GenotypeReal{
    phenotype(gene){
        return Math.round(gene);
    }
}

class GenotypeWeightedEnum{
    constructor(weightedValues){
        this.weightedValues = weightedValues;
    }

    random(){
        return randWeights(this.weightedValues);
    }

    mutate(current, amplitude){
        return this.random();
    }

    phenotype(gene){
        return gene;
    }
}

class GenotypeEnum extends GenotypeWeightedEnum{
    constructor(values){
        let weightedValues = {};
        for(value of values){
            weightedValues[value] = 1;
        }
        super(weightedValues);
    }
}

export {GenotypeReal, GenotypeInteger, GenotypeEnum, GenotypeWeightedEnum, LinearScaling, PolyScaling}
