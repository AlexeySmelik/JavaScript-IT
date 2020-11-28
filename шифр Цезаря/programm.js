let fs = require('fs');
let arg = process.argv;
var alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

let get_freq = (filename) => {
    let text = fs.readFileSync(filename).toString().toLowerCase().split('');
    let freq = new Array(alph.length).fill(0);
    let counter = 0;
    for (let i = 0; i < text.length; i++){
        if (alph.indexOf(text[i]) > -1){
            counter++;
            freq[alph.indexOf(text[i])]++;
        }
    }
    for (let i = 0; i < freq.length; i++){
        freq[i] = freq[i] / counter;
    }
    return freq;
}

let code = (infilename, shift, outfilename) => {
    let textToCode = fs.readFileSync(infilename).toString().toLowerCase().split('');

    shift = shift*1 % alph.length + alph.length;
    for (let i = 0; i < textToCode.length; i++){
        if (alph.indexOf(textToCode[i]) > -1)
            textToCode[i] = alph[(alph.indexOf(textToCode[i]) + shift) % alph.length];
    }
    fs.writeFileSync(outfilename, textToCode.join(''));
}

let decode = () => {
    let freq = get_freq('code.txt');
    let mainFreq = get_freq('mainText.txt');
    let min_error = Number.MAX_VALUE;
    let min_error_index = -1;
    for (let shift = 0; shift < alph.length; shift++){
        let error = 0;
        for (let i = 0; i < alph.length; i++){
            error += (mainFreq[i] - freq[(i+shift) % alph.length])**2;
        }
        if (error < min_error){
            min_error = error;
            min_error_index = shift;
        }
    }
    console.log(`Сдвиг - ${min_error_index}`);
    code('code.txt', -min_error_index, 'decode.txt');
}

if (arg[2] == 'code'){
    code('input.txt', arg[3], 'code.txt');
} else if (arg[2] == 'decode') {
    decode();
}    