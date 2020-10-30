let getNewHash = (str, len, hash = 0, index = 0) => {
    if (hash == 0){
        for (let i = 0; i < len; i++) 
            hash = 2 * hash + str.charCodeAt(i);
    } else {
        hash = 2 * hash - str.charCodeAt(index) * Math.pow(2, len) + str.charCodeAt(len + index);
    }
    return hash;
}

let s = 'ccabcab';
let t = 'cab';
let M = [];
let realM = [];
let hashT = getNewHash(t, t.length);
let hashS = getNewHash(s, t.length);
for (let i = 0; i < s.length - t.length + 1; i++){
    if (hashT == hashS){
        realM.push(i + 1)
        let j = 0;
        while (s[j + i] == t[j] && j - 1 < t.length){
            if (j == t.length - 1) M.push(i + 1);
            j++;
        }
    }
    hashS = getNewHash(s, t.length, hashS, i);
}

console.log(`массив без коллизий: ${M} \nреальный массив: ${realM}`);