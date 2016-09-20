function set_save_string()
{
    var decycled_machine = JSON.decycle(states);
    var machine_str = JSON.stringify(decycled_machine);
    $("#save_string").text(LZString.compressToBase64(machine_str));
}

function load()
{
    var machine_str = LZString.decompressFromBase64($("#load_string").val());
    var decycled_machine = JSON.parse(machine_str);
    var machine = JSON.retrocycle(decycled_machine);
    push_undo({type: "load", old_states: states, new_states: machine});
    states = machine;
    draw();
}
