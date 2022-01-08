import {modCircleDelta, navigate} from '../geometry.js';
import {randChoice, randFloat} from '../rand.js';

function pickCircle(samples, index, pile){
    let source = randChoice(pile.parts);
    let radiusCandidates = [];
    for(let i=0; i<samples; i++){
        let other = randChoice(pile.parts);
        let dx = source.parameters.x - other.parameters.x;
        let dy = source.parameters.y - other.parameters.y;
        radiusCandidates.push(Math.pow(dx*dx + dy*dy, 0.5));
    }
    radiusCandidates.sort();
    return new CircleSelector(source.parameters.x, source.parameters.y, radiusCandidates[index]);
}

function pickLine(pile){
    let source = randChoice(pile.parts);
    let theta = randFloat(2*Math.PI);
    return new LineSelector(source.parameters.x - 0.5 + Math.random(), source.parameters.y - 0.5 + Math.random(), theta);
}

class Selector{
    allIn(pile){
        return pile.parts.filter(x => this.includes(x));
    }

    allOut(pile){
        return pile.parts.filter(x => !this.includes(x));
    }
}

class CircleSelector extends Selector{
    constructor(x, y, radius){
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.r2 = radius*radius;
    }

    includes(part){
        let sym = part.parameters.symmetry;

        if(sym === 'a' || sym === 'both'){
            let dx = part.parameters.x - this.x;
            let dy = part.parameters.y - this.y;
            if(dx*dx + dy*dy <= this.r2){
                return true;
            }
        }

        if(sym === 'b' || sym === 'both'){
            let dx = (-1*part.parameters.x) - this.x;
            let dy = part.parameters.y - this.y;
            if(dx*dx + dy*dy <= this.r2){
                return true;
            }
        }

        return false;
    }
}

class LineSelector extends Selector{
    constructor(x, y, normalTheta){
        super();
        this.x = x;
        this.y = y;
        this.theta = normalTheta;
    }

    includes(part){
        let sym = part.parameters.symmetry;

        if(sym === 'a' || sym === 'both'){
            let targetTheta = navigate({x: this.x, y: this.y}, {x: part.parameters.x, y: part.parameters.y});
            let thetaDelta = modCircleDelta(this.theta - targetTheta);
            if(Math.abs(thetaDelta) <= Math.PI/2){
                return true;
            }
        }

        if(sym === 'b' || sym === 'both'){
            let targetTheta = navigate({x: this.x, y: this.y}, {x: -1*part.parameters.x, y: part.parameters.y});
            let thetaDelta = modCircleDelta(this.theta - targetTheta);
            if(Math.abs(thetaDelta) <= Math.PI/2){
                return true;
            }
        }

        return false;
    }
}

class AllSelector extends Selector{
    includes(part){
        return true;
    }
}

export {pickCircle, pickLine, CircleSelector, AllSelector}
