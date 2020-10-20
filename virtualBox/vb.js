let fs = require('fs');
const { exit } = require('process');
let mem = new Array();

let text = fs.readFileSync('nod.jss').toString();
mem = text.split(/\s/);
for (let i = 0; i < mem.length; i++)
    if (mem[i] === '')
        mem.splice(i, 1);
mem.push('exit');
ip = 0;
wip = 0;
while (ip < mem.length){
    switch(mem[ip]){
        case 'max_min':
            max = Math.max(mem[mem[ip + 1]], mem[mem[ip + 2]]);
            min = Math.min(mem[mem[ip + 1]], mem[mem[ip + 2]]);
            mem[mem[mem[ip + 1]]] = max;
            mem[mem[mem[ip + 2]]] = min;
            ip += 3;
            break;
        case 'inc':
            mem[mem[ip + 1]]++;
            ip += 2;
            break;
        case 'input':
            console.log('Введи значение');
            ip += 2;
            break;
        case 'set':
            mem[mem[ip + 1]] = parseFloat(mem[ip + 2]);
            ip += 3;
            break;
        case 'output':
            console.log(mem[mem[ip + 1]]);
            ip += 2;
            break;
        case 'add':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] + mem[mem[ip + 2]];
            ip += 4;
            break;
        case 'mul':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] * mem[mem[ip + 2]];
            ip += 4;
            break;
        case 'sub':
            mem[mem[ip + 3]] = mem[mem[ip + 1]] - mem[mem[ip + 2]];
            ip += 4;
            break;
        case 'cmp':
            if (mem[mem[ip + 1]] != mem[mem[ip + 2]]){
                while(mem[ip] != 'jz')
                    ip++;
                ip++;
            } else {
                console.log(ip);
                ip += 3;
            }
            break;
        case 'jz':
            ip++;
            break;
        case 'while':
            if (mem[mem[ip + 1]] != mem[mem[ip + 2]]){
                wip = ip;
                ip += 3;
            } else {
                while(mem[ip] != 'jnz')
                    ip++;
                ip++;
            }
            break;
        case 'jnz':
            ip++;
            if (mem[mem[wip + 1]] != mem[mem[wip + 2]])
                ip = wip;
            break;
        case 'exit':
            exit();
    }
}
