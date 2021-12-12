import {DesignPileModel} from './genotype/direct-pile.js'
import {defaults} from './settings.js'
let seed = DesignPileModel.seed(defaults);
console.dir(seed);
console.log(seed.pretty().join('\n'));
console.log(seed.build());



//
//import {MatterJsPhysics} from './physics.js'
//import {Simulation} from './simulation.js'
//import {Pool} from './pool.js'
//
//
////import {reproduceDesign} from './design-tree.js'
////console.dir(seed, reproduceDesign(seed, seed, defaults));
//
//let phys = new MatterJsPhysics(defaults);
//phys.render();
//
//let pool = new Pool(phys, defaults, [seed, seed, seed]);
//
//await pool.runRealtime(Infinity);
