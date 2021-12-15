function randFloat(max){
    return Math.random() * max;
}

function randFloatRange(min, max){
    return min + Math.random()*(max-min);
}

function randInt(max){
    return Math.floor(Math.random() * max);
}

function randIntRange(min, max){
    return min + randInt(max-min);
}

function randIntDecaying(max, rate){
    let soFar = 0;
    while(Math.random() < rate){
        soFar++;
    }

    return soFar;
}

function randChoice(array){
    return array[randInt(array.length)];
}

function randWeights(weightMap){
    let total = weightMap.values().reduce((x, y) => x+y, 0);
    var choice = Math.random() * total;
    for(let key of weightMap.keys()){
        choice -= weightMap[key];
        if(choice <= 0){
            return key;
        }
    }

    return randChoice(weightMap.keys());
}

export {randWeights, randChoice, randFloat, randFloatRange, randInt, randIntDecaying, randIntRange}
