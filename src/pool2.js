import {DesignPileModel} from './genotype/direct-pile.js'
import {logger} from './logging.js'
import {shuffle, randChoice} from './rand.js'
let log = logger('pool2');

class Pool2{
    constructor(settings, simFactory){
        this.settings = settings;
        this.simFactory = simFactory;

        this.seed();
    }

    seed(){
        this.generationCount = 0;
        this.population = [];
        for(let i=0; i<this.settings.pool2.totalPopulation; i++){
            this.population.push(new Individual(DesignPileModel.seed(this.settings)));
        }
    }

    spawnNext(){
        var next;
        var record;

        if(this.spawnQueue.length > 0){
            next = this.spawnQueue.pop();
            record = true;
        }else{
            next = randChoice(this.population);
            record = false;
        }

        let ship = sim.spawnDesign(next.design);
        ship.onDestroy(() => {
            if(record){
                next.record(ship.score());
                this.scoresRemaining--;
            }
        });
    }
            
        

    runGeneration(){
        let queue = [];
        for(let i = 0; i < this.settings.pool2.runsPerIndividual; i++){
            for(let individual of this.population){
                queue.push(individual);
            }
        }

        this.spawnQueue = shuffle(queue);
        this.scoresRemaining = queue.length;

        let sim = this.simFactory();

        let spawnNext = (){



        


    //demo(){
    //    this.sim = this.simFactory();
    //    
    //    let a = new Individual(DesignPileModel.seed(this.settings));
    //    let b = new Individual(DesignPileModel.seed(this.settings));
    //    let c = DesignPileModel.reproduce(this.settings, a.design, b.design);

    //    let shipA = this.sim.spawnDesign(a.design);
    //    let shipB = this.sim.spawnDesign(b.design);
    //    let shipC = this.sim.spawnDesign(c);
    //}

    async runRealtime(ticks){
        for(let i=0; i<ticks; i++){
            let last = Date.now();
            this.sim.tick();
            let extraTime = this.settings.displayTickTime*1000 - (Date.now() - last)
            if(extraTime > 0){
                await this.sleep(extraTime);
            }
        }
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    runGeneration(){
        this.sim = this.simFactory();

        this.generateNextGeneration();
    }

    generateNextGeneration(){

    }

}

class Individual{
    constructor(design){
        this.design = design;
        this.recordedScores = [];
    }

    record(score){
        this.recordedScores = [];
    }

    score(){
        if(this.recordedScores.length == 0){
            return 0;
        }else{
            return this.recordedScores.reduce((x, y) => x+y, 0) / this.recordedScores.length;
        }
    }
}

export {Pool2}
