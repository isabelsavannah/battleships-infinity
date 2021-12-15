import {pickCircle, AllSelector} from 'selector.js'
import {DesignPile, DesignPart} from 'direct-pile.js'
import {randWeights} from '../rand.js'
import {logger} from '../logging.js'
let logger = logger('pile-mutation');

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

function doPartValueMutation(settings, pile){
    logger.debug('doing part value mutation');
    let newParts = [];
    let mutationIndex = randInt(pile.parts.length);
    let weights = settings.genotype.mutationWeights;
    for(let i=0; i<pile.parts.length; i++){
        if(i == mutationIndex){
            let oldPart = pile.parts[i];
            logger.trace(`old part: ${oldPart.pretty()}`);
            let newValues = {};
            Object.assign(newValues, oldPart.parameters);
            let toMutate = randWeights(weights.partValue);
            newValues[toMutate] = pile.partTemplate[toMutate].mutate(newValues[toMutate], weights.mutationAmplitude);

            let newPart = new DesignPart(newValues);
            logger.trace(`new part: ${newPart.pretty()}`);
            newParts.push(newPart);
        }else{
            newParts.push(pile.parts[i]);
        }
    }

    return new DesignPile(newParts, pile.meta);
}

function doMetaValueMutation(settings, pile){
    logger.debug('doing meta value mutation');
    let weights = settings.genotype.mutationWeights;
    let newValues = {};
    Object.assign(newValues, pile.meta.parameters);
    let toMutate = randWeights(weights.meta);
    newValues[toMutate] = pile.metaTemplate[toMutate].mutate(newValues[toMutate], weights.mutationAmplitude);
    logger.trace(`meta value ${toMutate} changed ${pile.meta.parameters[toMutate]}=>${newValues[toMutate]}`);

    return new DesignPile(pile.parts, new DesignMeta(newValues));
}

function doPartTranslateMutation(settings, pile){

}

function doGroupTranslateMutation(settings, pile){

}

function doGroupSymmetryMutation(settings, pile){

}

function doGroupScaleMutation(settings, pile){

}

function doGlobalScaleMutation(settings, pile){

}

export {doMutation}
