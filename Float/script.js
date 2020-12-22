function get_floating_point(num){
    if (not_a_number(num))
        return "0 11111111 100000000000000000000000"; // not num1 number
    num *= 1;
    if (num > 2**128 - 2**104){
        return "0 11111111 000000000000000000000000"; // +Infinity
    } else if (num < -1 * 2**128 + 2**104){
        return "1 11111111 000000000000000000000000"; // -Infinity
    } else if(num < 2**(-149) && num >= 0){
        return "0 00000000 000000000000000000000000"; // +0
    } else if (num > -1 * 2**(-149) && num < 0){
        return "1 00000000 000000000000000000000000"; // -0
    } else if (Math.abs(num) < 2**(-126) && Math.abs(num) > 0) {
        return get_denormalized_number(num); // денормализованное число
    }
    return get_normalized_number(num); // нормализованное число
}

function not_a_number(num){
    return isNaN(Number(num));
    // return !/-?\d+\.?\d{0,}e?[-,+]?\d{0,}[^\W\w]?$/.test(num);
}

function get_normalized_number(num){
    let sign = 0;
    if (num < 0){
        sign = 1;
        num *= -1;
    }
    let binary_code = num.toString(2);

    // нахождение сдвига(экспоненты)
    let deg = Math.floor(Math.log2(num));
    let exponent = new Array(8).fill(0);
    let _deg = deg + 127;
    for (let i = 7; i > -1; i--){
        exponent[i] = _deg % 2;
        _deg = ~~(_deg / 2);
    }

    // нахождение мантиссы
    let mantissa = new Array(23).fill(0);
    let index = 0;
    let flag = false; // флаг на наличие первой 1
    let mantissa_index = 0;
    while (index < binary_code.length && mantissa_index < 23){
        if (flag && binary_code[index] != '.'){
            mantissa[mantissa_index] = binary_code[index];
            mantissa_index++;
        }
        if (binary_code[index] == 1)
            flag = true;
        index++;
    }
    return `${sign} ${exponent.join('')} ${mantissa.join('')}`;
}

function get_denormalized_number(num){
    let sign = 0;
    if (num < 0){
        sign = 1;
        num *= -1;
    }
    let binary_code = num.toString(2);
    let exponent = "00000000";

    // нахождение мантиссы
    let mantissa = new Array(23).fill(0);
    let index = 0;
    let flag = false; // флаг на наличие первой 1
    let mantissa_index = binary_code.indexOf(1) - 128;
    while (index < binary_code.length && mantissa_index < 23){
        if (binary_code[index] == 1)
            flag = true;
        if (flag && binary_code[index] != '.'){
            mantissa[mantissa_index] = binary_code[index];
            mantissa_index++;
        }
        index++;
    }
    return `${sign} ${exponent} ${mantissa.join('')}`;
}

function sum(num1, num2){
    let float_code1 = get_floating_point(num1).split(' ');
    let float_code2 = get_floating_point(num2).split(' ');
    if (float_code1.join(' ') == "0 11111111 100000000000000000000000")
        return "0 11111111 100000000000000000000000";
    if (float_code2.join(' ') == "0 11111111 100000000000000000000000")
        return "0 11111111 100000000000000000000000";

    // для денормализованных
    if (float_code1[1] == '00000000' && float_code2[1] == '00000000'){
        //todo
        let sign;
        let exponent = new Array(8).fill(0);
        let mantissa;
        if (float_code1[0] == float_code2[0]){ // если знаки чисел равны
            sign = float_code1[0];
            mantissa = binary_sum(float_code1[2], float_code2[2]);
            if (mantissa[0] == '1'){
                exponent = binary_sum(float_code1[1], '1');
            }
            mantissa.splice(0, 1);
        } else { // eсли знаки числе НЕ равны
            if (float_code1[2] > float_code2[2]){
                sign = float_code1[0];
                mantissa = binary_sub(float_code1[2], float_code2[2]);
            } else {
                sign = float_code2[0];
                mantissa = binary_sub(float_code2[2], float_code1[2]);
            }
            let shift = mantissa.join('').indexOf('1') + 1;
            if (shift == '0')
                return "0 00000000 000000000000000000000000"; // num1 == -num2;
        }
        return `${sign} ${exponent.join('')} ${mantissa.join('')}`; 
    }

    // для нормализованных
    if (float_code1[0] == float_code2[0]) { // если знаки чисел равны   
        let exponent;
        let mantissa;
        if (float_code1[1] == float_code2[1]){ // если порядки равны
            exponent = binary_sum(float_code1[1], '1');
            exponent.splice(0, 1);
            mantissa = binary_sum(float_code1[2], float_code2[2]);
            mantissa.pop();
        } else {
            let flag = float_code1[1] == '00000000' ? false : true; // флаг для единицы
            while (parseInt(float_code2[1], 2) > parseInt(float_code1[1], 2)){ // сдвиг второго числа больше сдвига первого
                float_code1[1] = binary_sum(float_code1[1], '1').join('').substring(1, 9);
                if (flag){
                    flag = false;
                    float_code1[2] = '1' + float_code1[2];
                } else{
                    float_code1[2] = '0' + float_code1[2];
                }
                float_code1[2] = float_code1[2].substring(0, 23);
            }
            if (float_code2[1] == '00000000') // если меньшее число денормализированное
                flag = false;
            while (parseInt(float_code1[1], 2) > parseInt(float_code2[1], 2)){ // сдвиг первого числа больше сдвига второго
                float_code2[1] = binary_sum(float_code2[1], '1').join('').substring(1, 9);
                if (flag){
                    flag = false;
                    float_code2[2] = '1' + float_code2[2];
                } else{
                    float_code2[2] = '0' + float_code2[2];
                }
                float_code2[2] = float_code2[2].substring(0, 23);
            }
            mantissa = binary_sum(float_code1[2], float_code2[2]);
            if (mantissa[0] == '1'){ // происходит сдвиг
                exponent = binary_sum(float_code1[1], '1');
                exponent.splice(0, 1);
                mantissa[0] = '0';
                mantissa.pop();
            } else { // не происходит сдвиг
                mantissa.splice(0, 1);
                exponent = float_code1[1].split('');
            }
        }
        if (exponent.join('') == '11111111'){
            if (float_code1[0] == '0'){
                return "0 11111111 000000000000000000000000"; // +Infinity
            } else {
                return "1 11111111 000000000000000000000000"; // -Infinity
            }
        }
        return `${float_code1[0]} ${exponent.join('')} ${mantissa.join('')}`;
    } else { // если знаки чисел НЕ равны
        let exponent;
        let mantissa;
        let sign;
        if (float_code1[1] == float_code2[1]){ // если порядки равны
            if ('1' + float_code1[2] > '1' + float_code2[2]){
                sign = float_code1[0];
                mantissa = binary_sub(float_code1[2], float_code2[2]);
            } else {
                sign = float_code2[0];
                mantissa = binary_sub(float_code2[2], float_code1[2]);
            }
            let shift = mantissa.join('').indexOf('1') + 1;
            if (shift == '0')
                return "0 00000000 000000000000000000000000"; // num1 == -num2;
            exponent = binary_sub(float_code1[1], shift.toString(2));
            while (shift != 0){
                mantissa.splice(0, 1);
                mantissa.push(0);
                shift--;
            }
        } else { // если порядки не равны
            let flag = float_code1[1] == '00000000' ? false : true;; // флаг для единицы
            while (parseInt(float_code2[1], 2) > parseInt(float_code1[1], 2)){ // сдвиг второго числа больше сдвига первого
                float_code1[1] = binary_sum(float_code1[1], '1').join('').substring(1, 9);
                if (flag){
                    flag = false;
                    float_code1[2] = '1' + float_code1[2];
                } else{
                    float_code1[2] = '0' + float_code1[2];
                }
                float_code1[2] = float_code1[2].substring(0, 23);
            }
            if (flag == false){
                sign = float_code2[0];
                mantissa = binary_sub('1' + float_code2[2], float_code1[2]);
                if (mantissa[0] == '1'){
                    mantissa.splice(0, 1);
                    exponent = float_code1[1].split('');
                } else {
                    mantissa.splice(0, 1);
                    let shift = mantissa.join('').indexOf('1') + 1;
                    if (shift == '0')
                        return "0 00000000 000000000000000000000000"; // num1 == -num2;
                    exponent = binary_sub(float_code1[1], shift.toString(2));
                    while (shift != 0){
                        mantissa.splice(0, 1);
                        mantissa.push(0);
                        shift--;
                    }
                }
            } else {
                if (float_code2[1] == '00000000') // если меньшее число денормализированное
                    flag = false;
                while (parseInt(float_code1[1], 2) > parseInt(float_code2[1], 2)){ // сдвиг первого числа больше сдвига второго
                    float_code2[1] = binary_sum(float_code2[1], '1').join('').substring(1, 9);
                    if (flag){
                        flag = false;
                        float_code2[2] = '1' + float_code2[2];
                    } else{
                        float_code2[2] = '0' + float_code2[2];
                    }
                    float_code2[2] = float_code2[2].substring(0, 23);
                }
                sign = float_code1[0];
                mantissa = binary_sub('1' + float_code1[2], float_code2[2]);
                if (mantissa[0] == '1'){
                    mantissa.splice(0, 1);
                    exponent = float_code1[1].split('');
                } else {
                    mantissa.splice(0, 1);
                    let shift = mantissa.join('').indexOf('1') + 1;
                    if (shift == '0')
                        return "0 00000000 000000000000000000000000"; // num1 == -num2;
                    exponent = binary_sub(float_code1[1], shift.toString(2));
                    while (shift != 0){
                        mantissa.splice(0, 1);
                        mantissa.push(0);
                        shift--;
                    }
                }
            }
        }
        if (parseInt(exponent.join('')) <= 1 && sign == 0){
            return "0 00000000 000000000000000000000000"; // +0
        } else if (parseInt(exponent.join('')) <= 1 && sign == 1){
            return "1 00000000 000000000000000000000000"; // -0
        }
        return `${sign} ${exponent.join('')} ${mantissa.join('')}`;
    }
}

function binary_sum(num1, num2){
    while (num1.length < num2.length)
        num1 = '0' + num1;
    while (num2.length < num1.length)
        num2 = '0' + num2;
    // console.log(num1, num2);
    let result = new Array(num1.length + 1).fill(0);
    for (let i = num1.length; i > 0; i--){
        result[i] = 1 * num1[i - 1] + 1 * num2[i - 1] + result[i];
        if (result[i] > 1){
            result[i - 1]++;
            result[i] %= 2;
        }
    }
    return result;
}

function binary_sub(num1, num2){ // num1 >= num2
    while (num1.length < num2.length)
        num1 = '0' + num1;
    while (num2.length < num1.length)
        num2 = '0' + num2;
    let result = new Array(num1.length).fill(0);
    for (let i = num1.length - 1; i > -1; i--){
        result[i] = 1 * num1[i] - 1 * num2[i] + result[i];
        if (result[i] == -1){
            result[i] = 1;
            result[i - 1]--;
        }
        if (result[i] == -2){
            result[i] = 0;
            result[i - 1]--; 
        }
    }
    return result;
}

function to_decimal(num){
    let sign = num.split(' ')[0];
    let exponent = num.split(' ')[1];
    let mantissa = num.split(' ')[2];
    if (exponent == "11111111" && mantissa == "000000000000000000000000" && sign == "1")
        return "-Infinity";
    else if (exponent == "11111111" && mantissa == "000000000000000000000000" && sign == "0")
        return "+Infinity";
    else if (exponent == "11111111")
        return "Not a number";
    else if (exponent == "00000000" && mantissa == "000000000000000000000000" && sign == "0")
        return "+0";
    else if (exponent == "00000000" && mantissa == "000000000000000000000000" && sign == "1")
        return "-0";
    else if (exponent == "00000000") { 
        // денормализованное число
        let result = 0;
        for (let i = 1; i < 24; i++){
            if (mantissa[i - 1] == 1)
                result += 2**(-i-126)
        }
        if (sign == 1)
            return -1 * result;
        return result;
    }
    // нормализованное число
    let deg = parseInt(exponent, 2) - 127;
    let exp = 1;
    for (let i = 1; i < 24; i++){
        if (mantissa[i - 1] == 1)
            exp += 2**(-i);
    }
    if (sign == 1)
        return -1 * 2**deg * exp;
    return 2**deg * exp;
}

let fs = require("fs");
let args = process.argv;

if (args[2] == "conv"){
    num = fs.readFileSync("in.txt").toString().replace(/\s/gi, '');
    fs.writeFileSync("out.txt", get_floating_point(num));
    // console.log(to_decimal(get_floating_point(num)));
} else if (args[2] == "calc") {
    let expression = fs.readFileSync("in.txt").toString().split(' ');
    let result;
    if (expression[1] == "+")
        result = sum(expression[0], expression[2]);
    else if (expression[1] == "-")
        result = sum(expression[0], -1 * expression[2]);
    else{
        console.log("Такая операция не предусмотрена");
        return;
    }
    fs.writeFileSync("out.txt", `${result} (≈ ${to_decimal(result)})`);
}
