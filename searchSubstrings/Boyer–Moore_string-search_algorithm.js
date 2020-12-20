function strings_compare(s1, s2){
    for (let i = 0; i < s1.length; i++)
        if (s1[i] != s2[i] && s1[i] != '*')
            return false;
    return true;
}

let s = 'If today were the last day of your life, would you want to do what you are about to do today?';
let t = 'life';
// s = 'bcdbcabcdbcabcabcabcabcabcbc'; t = 'bcdbcabcabc';
// s = 'abcdefg'; t = 'f';
// s = 'ab ab ab ab ab ab'; t = 'ab';
// s = 'ssssssssssss'; t = 's'; 
let m = t.length;
positions = new Array();

// для эвристики "плохого символа"
let shift1 = []; // таблица для сдвига по правилу "плохого символа"
for (let j = 0; j < m; j++){
    shift1[t.charAt(j)] = Math.max(m - 2 * j - 1, 1)
}


// для эвристики "хороших суффиксов"
//                                          65432101234567
// t = 'abccdbccabcc';//'abcdabc'; // tt = '*******abcdabc' => tt.length = 2 * m 
// m = t.length;
let tt = new Array(m).fill('*').join('') + t; // расширенная t, то есть m любых символов(*) + cтрока t
let rpr = []; // вспомогательная таблица
let shift2 = []; // таблица для сдвига по правилу "хороших суффиксов"
for (let l = 0; l < m; l++){
    let k = m - l;
    let flag = true;
    while(flag){
        let a = tt.substring(m + k - 1, m + k + l - 1);
        let b = t.substring(m - l, m);
        // console.log(`l = ${l}, k = ${k}, ${a} vs ${b}\n`);
        if (strings_compare(a, b) && (k <= 1 || k > 1 && t[k - 2] != t[m - l - 1]))
            flag = false;
        k--;
    }
    rpr[l] = k + 1;
    shift2[l] = m - rpr[l] - l + 1;
}
// console.log(rpr);
// console.log(shift2);


index = m - 1;
while (index < s.length){
    let shift = 1;
    if (s[index] == t[m - 1]){
        let flag = true;
        for (let j = 1; j < m; j++) // посимвольное сравнение справо налево, где j - кол-во совпавших символов
            if (s[index - j] != t[m - 1 - j]){
                flag = false;
                if (shift1[s[index - j]] == undefined)
                    shift = m - j;
                else
                    shift = Math.max(shift1[s[index - j]], shift2[j]);
                break;
            }
        if (flag){
            positions.push(index - m + 1);
            shift = 1;
        }
    } else if (shift1[s[index]] == undefined){
        shift = m;
    } else {
        shift = Math.max(shift1[s[index]], shift2[0]);
    }
    index += shift;
}
console.log(positions);
