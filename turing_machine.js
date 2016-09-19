$(function()
{
    $("#canvas").mousedown(on_mousedown);
    $("#canvas").mouseup(on_mouseup);
    $("#canvas").bind("contextmenu", function(){return false;});
    initCanvas();
});


var states = [];

function State(x, y)
{
    this.x = x;
    this.y = y;
    this.transitions = [];
    // Color changes based on whether the state is currently active
    this.color = "blue";
}

function Transition(src, dest)
{
    this.src = src;
    this.dest = dest;
    this.actions = {}
}

function new_state(x, y)
{
    var n_state = new State(x, y);
    states.push(n_state);
    push_undo(n_state);
}

function new_transition(src, dest)
{
    var legit = true;
    // No double transitions
    for (t_idx in src.transitions)
    {
        t = src.transitions[t_idx];
        if (t.dest === dest)
        {
            return;
        }
    }
    // No mutual transitions
    for (t_idx in dest.transitions)
    {
        t = dest.transitions[t_idx];
        if (t.dest === src)
        {
            return;
        }
    }
    transition = new Transition(src, dest);
    src.transitions.push(transition);
    push_undo(transition);
}
