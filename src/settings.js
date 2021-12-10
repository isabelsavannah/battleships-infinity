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
        xSize: 16000,
        ySize: 16000,
        renderScale: 16,
    },

    pool: {
        recordsStable: 1000,
        recordsUnstable: 20,
        concurrentPopulation: 4,
        concurrentStablePopulation: 2,
        stableRuns: 5,
        minStableForReproduction: 40,
    },

    ship: {
        initialFood: 0.08,
        metabolisim: .00001,
        agingBasis: 5000,
        scoringRatio: 0.001,
        scoreThreshold: 5,
        thrusterPowerMassRatio: 0.02,
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

    genotype: {
        xBound: 1600,
        yBound: 1600,
        minBlockRadius: 8,
        maxBlockRadius: 256,
        minDensity: 0.3,
        maxDensity: 3,
        minSides: 3,
        maxSides: 12,
        symmetryChance: 0.9,
        payloadWeights: {
            'thruster': 0.2,
            'turret': 0.2,
        }
        seedParts: 6,
        pid: {
            pMin: 0.001, 
            pMax: 0.1,
            pExp: 2,
            dMin: 0.01,
            dMax: 2,
            dExp: 2,
            iMin: 0,
            iMax: 0.01,
            iExp: 4,
            tiMin: 10,
            tiMax: 1000,
            tiExp: 4,
        }
    },

    physicsTickTime: 0.01,
    displayTickTime: (1/120),

    mutationChance: 0.015,
    mutationAmountMax: 0.4,
}

export {defaults}
