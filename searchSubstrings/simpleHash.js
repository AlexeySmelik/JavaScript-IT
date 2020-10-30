let s = 'abcabdecab';
let t = 'cab';
let M = [];
let realM = [];
let hashT = 0;
for (let i = 0; i < t.length; i++) hashT += t.charCodeAt(i);
let hashS = 0;
for (let i = 0; i < t.length; i++) hashS += s.charCodeAt(i);

for (let i = 0; i < s.length - t.length + 1; i++){
    if (hashT == hashS){
        realM.push(i + 1)
        let j = 0;
        while (s[j + i] == t[j] && j - 1 < t.length){
            if (j == t.length - 1) M.push(i + 1);
            j++;
        }
    }
    hashS -= s.charCodeAt(i) - s.charCodeAt(i + t.length);
}

console.log(`массив без коллизий: ${M} \nреальный массив: ${realM}`);