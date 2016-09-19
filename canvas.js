// I apologize for writing this in pure javascript.
// I started this when that's all I knew, and at this point it wouldn't be worth
// it to start using even jquery

var rad = 25;
var arrow_body = 6;
var arrow_head = 5;

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
    var headlen = arrow_head;

    var angle = Math.atan2(toy-fromy,tox-fromx);

    // Starting path of the arrow from the start square to the end square and
    // drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    var grd = ctx.createLinearGradient(fromx, fromy, tox, toy);
    grd.addColorStop(0, "mediumblue");
    grd.addColorStop(1, "firebrick");
    ctx.strokeStyle = grd;
    ctx.lineWidth = arrow_body;
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
    ctx.lineWidth = arrow_head;
    ctx.stroke();
    ctx.fillStyle = "#cc0000";
    ctx.fill();
}

function draw()
{
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    // Draw states
    for (s_idx in states)
    {
        var s = states[s_idx];
        var circle = new Path2D();
        circle.arc(s.x, s.y, rad, 0, 2 * Math.PI);
        ctx.fillStyle = s.color;
        ctx.fill(circle);
    }
    // Draw transitions (after states so that they are on top)
    for (s_idx in states)
    {
        var s = states[s_idx];
        for (t_idx in s.transitions)
        {
            var t = s.transitions[t_idx];
            drawArrow(s.x, s.y, t.dest.x, t.dest.y);
        }
    }
}

function dist(v, w)
{
    dx = v.x - w.x;
    dy = v.y - w.y;
    return Math.sqrt(dx*dx + dy*dy);
};

function dist_to_segment(p, v, w)
{
    var len = dist(v, w);
    if (len == 0)
    {
        return dist(p, v);
    }
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / (len*len);
    console.log(t);
    t = Math.max(0, Math.min(1, t));
    dist_sq = dist(p, { x: v.x + t * (w.x - v.x),
                        y: v.y + t * (w.y - v.y) });
    return Math.sqrt(dist_sq);
}

function get_object(x, y)
{
    transitions = [];
    for (s_idx in states)
    {
        var s = states[s_idx];
        if (dist({x:x, y:y}, s) <= rad)
        {
            return s;
        }
        transitions = transitions.concat(s.transitions);
    }
    for (t_idx in transitions)
    {
        var t = transitions[t_idx];
        var dist_to_transition = dist_to_segment({x:x, y:y}, t.src, t.dest);
        console.log(dist_to_transition);
        if (dist_to_transition < arrow_body/2)
        {
            return t;
        }
    }
}
