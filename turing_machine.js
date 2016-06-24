var states = [];

function State(x, y)
{
    // Coords
    this.x = x;
    this.y = y;
    // List of all transitions from this state
    this.transitions = [];
    // Color changes based on whether the state is currently active
    this.color = "blue";
}

function Transition(dest, symbol, action)
{
    // The state that this transtion is to
    this.dest = dest;
    // The symbol that causes the transition
    this.symbol = symbol;
    // The symbol to write, if defined, to the current tape cell
    this.write_symbol = undefined;
    // The direction to move the tape pointer (one of "L", "R", or undefined)
    this.dir = undefined;
}

function initCanvas()
{
    var c = document.getElementById("canvas");
    var instr = document.getElementById("instr");
    var ctx = c.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight - instr.clientHeight;
    ctx.fillStyle = '#d3d3d3';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// This function from http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
function drawArrow(fromx, fromy, tox, toy)
{
    // Variables to be used when creating the arrow
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var headlen = 10;

    var angle = Math.atan2(toy-fromy,tox-fromx);

    // Starting path of the arrow from the start square to the end square and
    // drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = 22;
    ctx.stroke();

    // Starting a new path from the head of the arrow to one of the sides of the
    // point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    // Path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));

    // Path from the side point back to the tip of the arrow, and then again to
    // the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

    // Draws the paths created above
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = 22;
    ctx.stroke();
    ctx.fillStyle = "#cc0000";
    ctx.fill();
}

function draw()
{
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var rad = 25;

    // Run through the states drawing each of them and each of their connections
    for (s_idx in states)
    {
        var s = states[s_idx];
        for (t_idx in s.transitions)
        {
            var t = s.transitions[t_idx];
            drawArrow(s.x, s.y, t.dest.x, t.dest.y);
        }
        var circle = new Path2D();
        circle.arc(s.x, s.y, rad, 0, 2 * Math.PI);
        ctx.fillStyle = s.color;
        ctx.fill(circle);
    }
}

function new_state(x, y)
{
    var n_state = new State(x, y);
    states.push(n_state);
    draw();
}

function get_clicked_object(x, y)
{
    return undefined;
}

function on_mouse_down(e)
{
    // Firefox doesn't set offsetX/offsetY.
    if(!e.hasOwnProperty('offsetX')) {
        e.offsetX = e.layerX - e.currentTarget.offsetLeft;
        e.offsetY = e.layerY - e.currentTarget.offsetTop;
    }
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    var clicked_object = get_clicked_object(mouseX, mouseY);
 
    // If we're on empty space, call new_state
    if (!clicked_object)
    {
        new_state(mouseX, mouseY);
    }
    // If we're on a state, wait for mouse release
    // If mouse release is on the same state, bring up accept/reject editor
    // If we're on a transition, bring up the transition editor
}

document.getElementById("canvas").addEventListener("mousedown", on_mouse_down);
initCanvas();

