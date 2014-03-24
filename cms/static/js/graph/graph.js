
var redraw, g, renderer;



var add_edge_mode = false;
var mouse_x, mouse_y, origin_x, origin_y = null

// adding nodes and edges
var new_node_x, new_node_y, origin_x, origin_y;
var origin_node;

var new_edge_line;


function hideRestOfString(S){
    var N =15;      // maximum label length, in characters
                    // if label is longer tha...

    if (S.length > N) S = S.slice(0, N - 3) + "...";
    return S;
}

function parseSign(S){
    switch(S){
        case "more":
          return ">"
        case "more-equals":
      return "≥"
        case "equals":
      return "="
        case "less-equals":
      return "≤"
        case "less":
      return "<"
    default:
      return S;
    }
}
function parseType(S){
    switch(S){
        case "VideoDescriptor":
          return "Видео"
        case "CapaDescriptor":
      return "Задача"
        case "HtmlDescriptor":
      return "Текст"
    default:
      return S;
    }
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


    /* JSON data */
    var edges_arr;
    var names_obj;
    var data_obj;
    var states_obj;

    var ids_arr = [];                       // why is it necessary?

    var raphael_nodes = {};

function is_edge_exists(origin_node, target){
    var exists = false;
    var origin_node_number = ids_arr.indexOf(origin_node);

    for(var i=0; i<edges_arr[origin_node_number].length; i++){
        var e = edges_arr[origin_node_number][i]
        if (e["direct_element_id"]===target){
            exists = true;
            return exists;
        }
    };
    return exists;
}


function ajax_save_item(id, metadata){
    $.ajax({
        url: "/save_item",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        data: JSON.stringify({
            'id': id,
            'metadata': metadata
            })
    });
}


function add_node_here(){

        var new_node_name = 'Без имени';

        $("#node-name-input").val(new_node_name);
        $( "#add-new-node" ).dialog({
            modal: true,
            width:'auto',
            buttons: {
                Ok: function() {
                    new_node_name = $("#node-name-input").val();
                    //console.log($("#node-name-input").val());
                    $.ajax({
                        url: "/xblock",
//                        url: "/create_item",
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        headers: {
                                'X-CSRFToken': getCookie('csrftoken')
                        },
                        data: JSON.stringify({
                            'parent_locator': $(".locator").text(),
                            'category': "vertical",
                            'display_name': new_node_name
                            }),
                        success : function(answer){

                            var node_locator = answer["locator"]
                            //var location = answer["id"];

                            var i = node_locator.lastIndexOf("/");
                            var node_loc = node_locator.slice(i+1);

                            g.addNode(node_loc, { label : hideRestOfString(new_node_name), render : customRenderFunction} );
                            ids_arr.push(node_loc);
                            edges_arr.push([]);
                            names_obj[node_loc] = {
                                "name" : new_node_name,
                                "location" : node_locator,
                                "coords_x" : 0,
                                "coords_y" : 0};
                            data_obj[node_loc] = [];

                            renderer.drawNode(renderer.graph.nodes[node_loc])

                            raphael_nodes[node_loc].set.translate(new_node_x, new_node_y);
                            /*
                            renderer.enableDragingMode();
                            renderer.isDrag = raphael_nodes[node_id];
                            */

                        }
                    });
                    $( this ).dialog( "close" );
                },
                "Отмена": function() {
                    $( this ).dialog( "close" );
                }

            }
        })


}
/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {

document.onmousemove = function (e) {
    e = e || window.event;
    // -5 - so it doesn't interfere with clicking
    mouse_x = e.pageX - $('#canvas').offset().left - 5;
    mouse_y = e.pageY - $('#canvas').offset().top - 5;
    if (!add_edge_mode) return;
    if (add_edge_mode){

        var r = renderer.getCanvas();
        var path = ["M", origin_x, origin_y, "L", mouse_x, mouse_y].join(",");
        if ((new_edge_line !== undefined) && (new_edge_line.removed != true)){
            new_edge_line.remove();
        }
        new_edge_line = r.path(path);
    }
    return;
}
$("#canvas").click(function (e) {
    setTimeout(exitMode, 50);
});

function exitMode(){
    if (!add_edge_mode) return;
    add_edge_mode = false;
//    if(new_edge_line !== undefined){
    if (new_edge_line.removed != true){
        new_edge_line.remove();
    }
};

$("#canvas").dblclick(canvasDbClick);

function canvasDbClick(e) {
    if (e.target.nodeName == "svg" || e.target.nodeName == "DIV" ){
        if (!add_edge_mode){
            //alert("new node here!")
            new_node_x = e.pageX - $('#canvas').offset().left - 5;
            new_node_y = e.pageY - $('#canvas').offset().top - 5;
            add_node_here();
        }
    }
}





    g = new Graph();

/*
        var set = r.set().push(
                r.rect(n.point[0]-30, n.point[1]-13, 60, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
                r.text(n.point[0], n.point[1] + 10, (n.label || n.id) + "\n(" + (n.distance == undefined ? "Infinity" : n.distance) + ")"));
            return set;
*/

    var data_str = $(".data_string").text();
    var names_str = $(".names_string").text();
    var graph_str = $(".graph_string").text();
    var dict_str = $(".locators_dict").text();
    /*
        Толстый костыль: я не знаю, как сделать так, чтобы последняя (лишняя) запятая не выводилась,
        поэтому я просто удаляю лишнюю запятую руками.
    */

    var i = names_str.lastIndexOf(",");
    names_str = names_str.slice(0, i) + names_str.slice(i+1);
    i = data_str.lastIndexOf(",");
    data_str = data_str.slice(0, i) + data_str.slice(i+1);
    i = graph_str.lastIndexOf(",");
    graph_str = graph_str.slice(0, i) + graph_str.slice(i+1);

    names_obj = jQuery.parseJSON(names_str);
    data_obj = jQuery.parseJSON(data_str);

    ids_arr = [];

    var render = customRenderFunction;

    //console.log(names_obj)
    jQuery.each(names_obj, function(id, obj) {
        var label = hideRestOfString(obj["name"]);
        g.addNode(id, { label : label, render : render} );
        ids_arr.push(id);
    });

    edges_arr = jQuery.parseJSON(graph_str );
    console.log(edges_arr)


    var source;
    jQuery.each(edges_arr, function(node_number) {
        jQuery.each(edges_arr[node_number], function(edge_number) {
                source = ids_arr[node_number];

                var edge_data = generateEdgeData(this["disjunctions"], source)
                g.addEdge(source, this["direct_element_id"], { directed : true, label: edge_data.label, stroke: edge_data.color, details: edge_data.details });

        });
    });


//    for( var edge in obj) {

    /* layout the graph using the Spring layout implementation */
    var layouter = new Graph.Layout.Spring(g);

    var width = $(document).width() - 20;


//    var height = $(document).height() - 60;
    var height = 100 + 50*ids_arr.length;

    /* draw the graph using the RaphaelJS draw implementation */
    renderer = new Graph.Renderer.Raphael('canvas', g, width, height);

    redraw = function() {
        layouter.layout();
        renderer.draw();
    };


    moving_mode = function() {
        if (renderer.getDragingMode()) {
        /*
            $( "#on-exiting-draging-mode" ).dialog({
                resizable: false,
                height: 200,
                modal: true,
                buttons: {
                    "Сохранить": function() {
                        save_layout();
                        $( this ).dialog( "close" );
                    },
                    "Отмена": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
        */
            renderer.disableDragingMode();
        } else {
            renderer.enableDragingMode();
        };
    }


};

