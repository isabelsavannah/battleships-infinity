import {MatterJsPhysics} from './physics.js'
import {Simulation} from './simulation.js'
import {Pool} from './pool.js'
import {defaults} from './settings.js'

let phys = new MatterJsPhysics(defaults);
phys.render();

let pool = new Pool(phys, defaults);

await pool.runRealtime(Infinity);
