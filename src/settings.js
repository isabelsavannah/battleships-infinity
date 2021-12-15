let defaults = {
    food: {
        sides: 3,
        radius: 30,
        omega: .1,
        concurrent: 20,
        initial: 3,
        value: 5000,
    },

    field: {
        xSize: 8000,
        ySize: 8000,
        renderScale: 8,
    },

    pool: {
        recordsStable: 1000,
        recordsUnstable: 20,
        concurrentPopulation: 1,
        concurrentStablePopulation: 2,
        stableRuns: 5,
        minStableForReproduction: 40,
    },

    ship: {
        initialFood: 0.08,
        metabolisim: 0,
        agingBasis: 5000,
        scoringRatio: 0.001,
        scoreThreshold: 5,
        thrusterPowerMassRatio: 0.1,
        massMetabolisimMin: 1000,
        collisionDamagePerTick: 1,
        shootingTargetInterval: 100,
    },

    turret: {
        omegaMax: 1,
        spread: Math.PI/32,
        maxCooldown: 100,
        range: 5000,
    },

    bullet: {
        massDamageRatio: 0.1,
        radius: 20,
        sides: 4,
        omega: 0.2,
        spread: Math.PI/16,
        velocity: 50,
        fuseDuration: 0.05,
        timeout: 2,
    },

    phenotype: {
        rootBlock: {
            radius: 32,
            sides: 6,
            density: 1,
        },
    },

    genotype: {
        xBound: 400,
        yBound: 400,
        minBlockRadius: 8,
        maxBlockRadius: 256,
        minDensity: 0.3,
        maxDensity: 3,
        minSides: 3,
        maxSides: 12,
        symmetryChance: 0.95,
        payloadWeights: {
            'thruster': 0.4,
            'turret': 0.2,
        },
        seedParts: 8,
        pid: {
            pMin: 0.02, 
            pMax: 0.5,
            pExp: 1,
            dMin: 0.001,
            dMax: 0.3,
            dExp: 2,
            iMin: 0,
            iMax: 0.001,
            iExp: 2,
        },
        crossover: {
            lineWeight: 2,
            circleWeight: 1,
        },
        mutationWeights: {
            globalChance: 0.25,
            groupRadiusSamples: 5,
            groupRadiusIndex: 0,
            mutationAmplitude: 0.2,
            linearDistanceAmplitude: 50,
            mode: {
                partValue: 5,
                metaValue: 1,
                partTranslate: 5,
                groupTranslate: 1,
                groupSymmetry: 1,
                groupScale: 1,
                globalScale: 1,
            },
            partValue: {
                theta: 0,
                x: 0,
                y: 0,
                radius: 1,
                density: 1,
                sides: 1,
                symmetry: 0,
                payload: 1,
            },
            meta: {
                p: 1,
                d: 1,
                i: 1,
            },
        }
    },

    logging: {
        globalLevel: 4,
        moduleLevels: {

        },
    }

    physicsTickTime: 0.01,
    displayTickTime: (1/120),

    mutationChance: 0.015,
    mutationAmountMax: 0.4,
}

export {defaults}
