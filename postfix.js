let expression = "(1*2*3+4^5-6/7)/8*(9+10)";
let sighs = { "+" : 1, "-" : 1, "*" : 2, "/" : 2, "^" : 3, "(" : 0}
let stack = [];
let str = "";
for (i = 0; i < expression.length; i++)
{
    if (expression[i] in sighs)
    {
        if (str.length > 0 && str[str.length - 1] != ";" && !(str[str.length - 1] in sighs))
            str += ";";
        if (stack.length == 0 || sighs[expression[i]] > sighs[stack[stack.length - 1]] || expression[i] == "(" || expression[i] == "^")
            stack.push(expression[i]);
        else
        {
            while(sighs[expression[i]] <= sighs[stack[stack.length - 1]])
            {
                if (expression[i] != "(")
                    str += stack[stack.length - 1];
                stack.pop();
            }
            stack.push(expression[i]);
        }
    } else if (expression[i] == ")") {
        while(stack[stack.length - 1] != "(" )
        {
            str += stack[stack.length - 1];
            stack.pop();
        }
        stack.pop();
    } 
    else    
        str += expression[i];
}
for (i = stack.length - 1; i > -1; i--)
    str += stack[i];
console.log(str);
