import {randFloatRange} from './rand.js'

class GenotypeValueSpec{

}

class ExponentialScaling extends RealScalingModel{
    constructor(min, max){


class PolyScaling extends RealScalingModel{
    constructor(min, max, exponent){
        this.min = min;
        this.max = max;
        this.exponent = exponent;
    }

    random(){
        let scaledMin = Math.pow(this.min, this.exponent);
        let scaledMax = Math.pow(this.min, this.exponent);
        let scaledChoice = randFloatRange(scaledMin, scaledMax);
        return Math.pow(scaledChoice, 1/this.exponent);
    }
}

class LinearScaling extends PolyScaling{
    constructor(min, max){
        super(min, max, 1);
    }
}

class GenotypeReal extends GenotypeValueSpec{
    constructor(scaling){
        this.scaling = scaling;
    }
}

class GenotypeInteger extends GenotypeValueSpec{

}

class GenotypeWeightedEnum extends GenotypeValueSpec{
    constructor(weightedValues){
        this.totalWeight = Object.values(weightedValues).reduce((x, y)=>x+y, 0);
        this.weightedValues = weightedValues;
    }

    random(){
        var choice = randFloat(this.totalWeight);
        for(value in this.weightedValues){
            choice-= this.weightedValues[value];
            if(choice <= 0){
                return value;
            }
        }

        return randChoice(object.keys(this.weightedValues));
    }
}

class GenotyopeEnum extends GenotypeWeightedEnum{
    constructor(values){
        let weightedValues = {};
        for(value of values){
            weightedValues[value] = 1;
        }
        super(weightedValues);
    }
}


}

export {GenotypeReal, GenotypeInteger, GenotypeEnum}
