import {randFloat, randFloatRange} from '../rand.js';

class PolyScaling{
    constructor(min, max, exponent){
        this.min = min;
        this.max = max;
        this.exponent = exponent;
    }

    random(){
        let scaledMin = Math.pow(this.min, 1/this.exponent);
        let scaledMax = Math.pow(this.max, 1/this.exponent);
        let scaledChoice = randFloatRange(scaledMin, scaledMax);
        return Math.pow(scaledChoice, this.exponent);
    }
}

class LinearScaling extends PolyScaling{
    constructor(min, max){
        super(min, max, 1);
    }
}

class GenotypeReal{
    constructor(scaling){
        this.scaling = scaling;
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
        this.totalWeight = Object.values(weightedValues).reduce((x, y)=>x+y, 0);
        this.weightedValues = weightedValues;
    }

    random(){
        var choice = randFloat(this.totalWeight);
        for(let value in this.weightedValues){
            choice-= this.weightedValues[value];
            if(choice <= 0){
                return value;
            }
        }

        return randChoice(object.keys(this.weightedValues));
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
