var undo_stack = [];
var redo_stack = [];

function push_undo(action)
{
    undo_stack.push(action);
    redo_stack = [];
}

function undo()
{
    action = undo_stack.pop();
    if (!action)
    {
        return;
    }
    redo_stack.push(action);
    switch (action.type)
    {
        case "state":
            states.pop();
            break;
        case "transition":
            action.src.transitions.pop();
            break;
        case "load":
            states = action.old_states;
    }
    draw();
}

function redo()
{
    action = redo_stack.pop();
    if (!action)
    {
        return;
    }
    undo_stack.push(action);
    switch (action.type)
    {
        case "state":
            states.push(action);
            break;
        case "transition":
            action.src.transitions.push(action);
            break;
        case "load":
            states = action.new_states;
    }
    draw();
}
