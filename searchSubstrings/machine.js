let fs = require('fs');
let arg = process.argv;
let t = arg[2].toLowerCase();
let s = fs.readFileSync('forTest.txt').toString().toLowerCase();
let sumOfTime = 0;
let max_time = -1;
let min_time = 100000;
let limit = 10
for (_ = 0; _ < limit; _++){
    const start = new Date().getTime();
    machine(t, s, _);
    const end = new Date().getTime();
    let time = end - start;
    sumOfTime += time;
    if (max_time < time) 
        max_time = time;
    if (min_time > time) 
        {min_time = time;}
}
console.log(`max time: ${max_time}, min time: ${min_time}, average time: ${sumOfTime / limit}`)

function machine(t, s, flag){
    let m = t.length;
    let e = s.length;
    let M = new Array();
    let alph = new Array();
    let alphLength = 0;
    for(i = 0; i < m; i++){
        alph[t.charAt(i)] = 0;
        alphLength++;
    }
    let del = new Array(m + 1);
    for(j = 0; j <= m; j++)
        del[j] = new Array();
    for(i in alph)
        del[0][i] = 0;
    for(j = 0; j < m; j++){
        prev = del[j][t.charAt(j)];
        del[j][t.charAt(j)] = j + 1;
        for(i in alph)
            del[j + 1][i] = del[prev][i];
    }
    let pos = 0;
    for (let _ = 0; _ < e; _++){
        if (s[_] in alph){
            pos = del[pos][s[_]]
            if (pos == alphLength){
                M.push(_ - m + 2);
            }
        } else {
            pos = 0;
        }
    }
    if (flag == 0) 
        console.log(M);
}