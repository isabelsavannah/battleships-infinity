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
    let total = Object.values(weightMap).reduce((x, y) => x+y, 0);
    var choice = Math.random() * total;
    for(let key in weightMap){
        choice -= weightMap[key];
        if(choice <= 0){
            return key;
        }
    }

    return randChoice(weightMap.keys());
}

function shuffle(list){
    keyedList = list.map(x => [Math.random(), x]);
    keyedList.sort();
    return keyedList.map(x => x[1]);
}

export {randWeights, randChoice, randFloat, randFloatRange, randInt, randIntDecaying, randIntRange, shuffle}
