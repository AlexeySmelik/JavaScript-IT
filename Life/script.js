var canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let size = 40; // размер стороны квадрата
let height = canvas.height / size; 
let width = canvas.width / size;

let start_field;
clean_field();

function clean_field(){
    start_field = new Array(width);
    for (let _ = 0; _ < width; _++)
        start_field[_] = new Array(height).fill(0);
    draw_field(start_field);
}

function draw_field(field){
    for (let i = 0; i < width; i++){
        for (let j = 0; j < height; j++){
            ctx.fillStyle = field[i][j] == 0 ? '#FFF' : '#0F0' ;
            ctx.fillRect(i * size, j * size, size, size);
            ctx.strokeRect(i * size, j * size, size, size);
        }
    }
}

function get_number_of_neihbours(x, y, field){
    let counter = 0;
    for (let i = -1; i < 2; i++)
        for (let j = -1; j < 2; j++)
            if (!(i == 0 && j == 0) && field[(i + x + width) % width][(j + y + height) % height] == 1)
                counter++;
    return counter;
}

function do_step(){
    let end_field = new Array(height);
    for (let _ = 0; _ < width; _++)
        end_field[_] = new Array(height).fill(0);

    for (let i = 0; i < width; i++){
        for (let j = 0; j < height; j++){
            let counter_neighbours = get_number_of_neihbours(i, j, start_field);
            if (start_field[i][j] == 0 && counter_neighbours == 3)
                end_field[i][j] = 1;
            else if (start_field[i][j] == 1 && (counter_neighbours == 2 || counter_neighbours == 3))
                end_field[i][j] = 1;
            else
                end_field[i][j] = 0;
        }
    }
    draw_field(end_field);
    start_field = Array.from(end_field);
}

canvas.addEventListener('mousedown', e => { 
    let i = ~~(e.offsetX / size);
    let j = ~~(e.offsetY / size);
    start_field[i][j] = start_field[i][j] == 1 ? 0 : 1;
    draw_field(start_field);
});

let timer;
function make_timer(el){
    if (el.value == "Start game"){
        el.value = "Pause game"
        timer = setInterval(do_step, 500);
    } else {
        el.value = "Start game"
        clearInterval(timer);
    }
}