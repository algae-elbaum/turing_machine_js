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
    if (action)
    {
        redo_stack.push(action);
    }
    if (is_type(action, State))
    {
        states.pop();
    }
    else if (is_type(action, Transition))
    {
        action.src.transitions.pop();
    }
    // Deal with editor actions
    draw();
}

function redo()
{
    action = redo_stack.pop();
    if (action)
    {
        undo_stack.push(action);
    }
    if (is_type(action, State))
    {
        states.push(action);
    }
    else if (is_type(action, Transition))
    {
        action.src.transitions.push(action);
    }
    // Deal with editor actions
    draw();
}
