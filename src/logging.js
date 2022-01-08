let levelNames = {
    5: 'trace',
    4: 'debug',
    3: 'info ',
    2: 'user ',
    1: 'error',
}

var globalLevel = 3;
var keyLevels = {};

let buffer = [];
let bufferCap = 1000;

class Logger{
    constructor(name){
        this.name = name;
    }

    log(level, text){
        let targetLevel = keyLevels[this.name] ? keyLevels[this.name] : globalLevel;
        if(targetLevel <= level){
            let time = Math.round(performance.now());
            let formatted = `[${time}][${levelNames[level]}][${this.name}]: ${text}`;
            console.log(formatted);

            buffer.push(formatted);
            while(buffer.length > bufferCap){
                buffer.pop();
            }

            document.getElementById('log').innerHTML = buffer.join('\n')
        }
    }

    trace(text){
        this.log(5, text);
    }

    debug(text){
        this.log(4, text);
    }

    info(text){
        this.log(3, text);
    }

    user(text){
        this.log(2, text);
    }

    error(text){
        this.log(1, text);
    }
}

function applyLogSettings(settings){
    globalLevel = settings.logging.globalLevel;
    Object.assign(keyLevels, settings.logging.moduleLevels);
}

function logger(name){
    return new Logger(name);
}

export {applyLogSettings, logger}
