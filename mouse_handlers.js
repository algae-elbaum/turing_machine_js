// var shared between mouse action handlers
var clicked_object;

function on_mousedown(e)
{
    set_offset(e);
    clicked_object = get_object(e.offsetX, e.offsetY);
    // mouseup handler takes it from here
}

function on_mouseup(e)
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
    draw();
    return;
}


function on_right_mousedown(e)
{
    console.log("right-click down");
}

function on_right_mouseup(e)
{
    console.log("right-click up);
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

function get_object(x, y)
{
    dist = function(x1, y1, x2, y2)
    {
        dx = x1 - x2;
        dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    };
    for (s_idx in states)
    {
        var s = states[s_idx];
        if (dist(x, y, s.x, s.y) <= rad)
        {
            return s;
        }
    }
}

// Not quite what type means, but it's appropriate in this context
function is_type(obj, constructor)
{
    return obj && obj.constructor === constructor;
}
