import {MatterJsPhysics} from './physics.js'
import {Simulation} from './simulation.js'
import {Pool2} from './pool2.js'
import {defaults} from './settings.js'

let phys = new MatterJsPhysics(defaults);
phys.render();

let pool = new Pool2(defaults, () => new Simulation(phys, defaults));
pool.demo()

await pool.runRealtime(Infinity);
