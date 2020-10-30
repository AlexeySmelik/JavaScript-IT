let s = 'abcbcbc';
let t = 'bc';
let M = [];
for (let i = 0; i < s.length - t.length + 1; i++){
    let j = 0;
    while (s[j + i] == t[j] && j - 1 < t.length){
        if (j == t.length - 1) M.push(i);
        j++;
    }
}
console.log(M);