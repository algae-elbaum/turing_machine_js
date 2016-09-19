// vars shared between mouse action handlers
var clicked_object;
var right_clicked_object;

function on_mousedown(e)
{
    set_offset(e);
    clicked_object = get_object(e.offsetX, e.offsetY);
    // mouseup handler takes it from here
}

function on_mouseup(e)
{
    if (e.button === 0)
    {
        left_mouseup(e);
    }
    else if (e.button === 2)
    {
        right_mouseup(e);
    }
    draw();
}

function left_mouseup(e)
{
    set_offset(e);
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    var declicked_object = get_object(mouseX, mouseY);

    if (!clicked_object)
    {
        if (!declicked_object)
        {
            new_state(mouseX, mouseY);
        }
    }
    else if (is_type(clicked_object, State))
    {
        if (clicked_object === declicked_object)
        {
            edit_state(clicked_object);
        }
        else if (is_type(declicked_object, State))
        {
            new_transition(clicked_object, declicked_object);
        }
    } 
    else if (is_type(clicked_object, Transition) && clicked_object === declicked_object)
    {
        edit_transition(declicked_object)
    }

    clicked_object = undefined;
}

function right_mouseup(e)
{
    console.log("right-click up");
    set_offset(e);
    var mouseX = e.offsetX;
    var mouseY = e.offsetY;
    if (!right_clicked_object)
    {
        right_clicked_object = get_object(mouseX, mouseY);
    }
    else
    {
       right_clicked_object.x = mouseX;
       right_clicked_object.y = mouseY;
       right_clicked_object = undefined;
    }
}

// HELPERS

// Firefox doesn't set offsetX/offsetY.
function set_offset(e)
{
    if(!e.hasOwnProperty('offsetX'))
    {
        e.offsetX = e.layerX - e.currentTarget.offsetLeft;
        e.offsetY = e.layerY - e.currentTarget.offsetTop;
    }
}

// Not quite what type means, but it's appropriate in this context
function is_type(obj, constructor)
{
    return obj && obj.constructor === constructor;
}
