import {pickCircle} from './selector.js'
import {DesignPile, PilePart, PileMeta} from './direct-pile.js'
import {randChoice, randWeights, randFloat, randFloatRange, randInt} from '../rand.js'
import {logger} from '../logging.js'
let log = logger('pile-mutation');

let applyMap = {
    'partValue': doPartValueMutation,
    'metaValue': doMetaValueMutation,
    'partTranslate': doPartTranslateMutation,
    'groupTranslate': doGroupTranslateMutation,
    'groupSymmetry': doGroupSymmetryMutation,
    'groupScale': doGroupScaleMutation,
    'globalScale': doGlobalScaleMutation,
}

function doMutation(settings, pile){
    let mode = randWeights(settings.genotype.mutationWeights.mode);
    return applyMap[mode](settings, pile);
}

function isolateRandomPart(pile){
    let result = {
        'rest': []
    };

    let targetIndex = randInt(pile.parts.length);
    for(let i=0; i<pile.parts.length; i++){
        if(i == targetIndex){
            result.part = pile.parts[i];
        }else{
            result.rest.push(pile.parts[i]);
        }
    }

    return result;
}

function isolateBySelector(pile, selector){
    let result = {
        'included': [],
        'excluded': [],
    }

    for(let part of pile.parts){
        if(selector.includes(part)){
            result.included.push(part);
        }else{
            result.excluded.push(part);
        }
    }

    return result;
}

function doPartValueMutation(settings, pile){
    log.debug('doing part value mutation');
    let weights = settings.genotype.mutationWeights;
    let split = isolateRandomPart(pile);
    log.trace(`old part: ${split.part.pretty()}`);

    let newValues = {};
    Object.assign(newValues, split.part.parameters);
    let toMutate = randWeights(weights.partValue);
    newValues[toMutate] = pile.partTemplate[toMutate].mutate(newValues[toMutate], weights.mutationAmplitude);

    let newPart = new PilePart(newValues);
    log.debug(`changed ${toMutate} ${split.part.parameters[toMutate]} => ${newPart.parameters[toMutate]}`);

    return new DesignPile(settings, [split.rest, newPart].flat(), pile.meta);

}

function doMetaValueMutation(settings, pile){
    log.debug('doing meta value mutation');
    let weights = settings.genotype.mutationWeights;
    let newValues = {};
    Object.assign(newValues, pile.meta.parameters);
    let toMutate = randWeights(weights.meta);
    newValues[toMutate] = pile.metaTemplate[toMutate].mutate(newValues[toMutate], weights.mutationAmplitude);
    log.debug(`meta value ${toMutate} changed ${pile.meta.parameters[toMutate]} => ${newValues[toMutate]}`);

    return new DesignPile(settings, pile.parts, new PileMeta(newValues));
}

function doPartTranslateMutation(settings, pile){
    log.debug('doing part translation mutation');

    let theta = randFloat(Math.PI*2);
    let linear = randFloat(settings.genotype.mutationWeights.linearDistanceAmplitude);
    let dx = Math.sin(theta)*linear;
    let dy = Math.cos(theta)*linear;

    let split = isolateRandomPart(pile);

    log.trace(`dx ${dx}, dy ${dy} on part ${split.part.pretty()}`);

    return new DesignPile(settings, [split.rest, translatePart(split.part, dx, dy)].flat(), pile.meta);
}

function translatePart(part, dx, dy){
    let newValues = {};
    Object.assign(newValues, part.parameters);
    newValues.x += dx;
    newValues.y += dy;

    return new PilePart(newValues);
}

function doGroupTranslateMutation(settings, pile){
    log.debug('doing group translation mutation');
    let weights = settings.genotype.mutationWeights
    let selector = pickCircle(weights.groupRadiusSamples, weights.groupRadiusIndex, pile);
    let split = isolateBySelector(pile, selector);

    let theta = randFloat(Math.PI*2);
    let linear = randFloat(settings.genotype.mutationWeights.linearDistanceAmplitude);
    let dx = Math.sin(theta)*linear;
    let dy = Math.cos(theta)*linear;

    log.debug(`dx ${dx}, dy ${dy} on ${split.included.length} parts`);

    let newParts = [split.excluded, split.included.map(part => translatePart(part, dx, dy))].flat();

    return new DesignPile(settings, newParts, pile.meta);
}

function doGroupSymmetryMutation(settings, pile){
    log.debug('doing group symmetry mutation');
    let weights = settings.genotype.mutationWeights
    let selector = pickCircle(weights.groupRadiusSamples, weights.groupRadiusIndex, pile);

    let newValue = randChoice(['a', 'b', 'both']);
    let split = isolateBySelector(pile, selector);

    log.debug(`${split.excluded.length} parts moved to symmetry ${newValue}`);

    let parts = split.excluded;
    for(let part of split.included){
        let newValues = {};
        Object.assign(newValues, part.parameters);
        newValues.symmetry = newValue;

        parts.push(new PilePart(newValues));
    }

    return new DesignPile(settings, parts, pile.meta);
}

function scalePart(part, scaleFactor){
    let newValues = {};
    Object.assign(newValues, part.parameters);
    newValues.x *= scaleFactor;
    newValues.y *= scaleFactor;
    newValues.radius *= scaleFactor;

    return new PilePart(newValues);
}


function doGroupScaleMutation(settings, pile){
    log.debug('doing group scale mutation');
    let weights = settings.genotype.mutationWeights
    let selector = pickCircle(weights.groupRadiusSamples, weights.groupRadiusIndex, pile);
    let split = isolateBySelector(pile, selector);

    let amp = settings.genotype.mutationWeights.mutationAmplitude;
    let scale = randFloatRange(1-amp, 1+amp);

    log.debug(`${split.excluded.length} parts scaled by ${scale}`);

    let newParts = [split.excluded, split.included.map(part => translatePart(part, scale))].flat();
    return new DesignPile(settings, newParts, pile.meta);
}

function doGlobalScaleMutation(settings, pile){
    log.debug('doing global scale mutation');

    let amp = settings.genotype.mutationWeights.mutationAmplitude;
    let scale = randFloatRange(1-amp, 1+amp);

    log.debug(`${pile.parts.length} parts scaled by ${scale}`);

    let newParts = pile.parts.map(part => scalePart(part, scale));
    return new DesignPile(settings, newParts, pile.meta);
}

export {doMutation}
