let debugAnnounceData = {}

function debugAnnounce(data){
    Object.assign(debugAnnounceData, data);

    let lines = [];
    for(let key in debugAnnounceData){
        lines.push(`${key}: ${debugAnnounceData[key]}`);
    }
    document.getElementById('debug').innerHTML = lines.join('\n');
}

export {debugAnnounce}
