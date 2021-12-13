function assert(...vals){
    for(let val of vals){
        if(!val){
            throw "assertion failure";
        }
    }
}

export {assert}
