
var redraw, g, renderer;



var add_edge_mode = false;
var mouse_x, mouse_y, origin_x, origin_y = null

// adding nodes and edges
var new_node_x, new_node_y;
var origin_node;

var new_edge_line;


function hideRestOfString(S){
    var N =15;      // maximum label length, in characters
                    // if label is longer tha...

    if (S.length > N) S = S.slice(0, N - 3) + "...";
    //if (S.length > N) S = S.slice(0, N - 3) + "\n" + S.slice(N - 3);
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
        case "DiscussionDescriptor":
      return "Обсуждение"
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

$("#graph-help").click(function (e) {

    /*
    var $dialog = $('<div></div>').
        css({height:"350px", overflow:"auto"}).
        html($( "#graph-help-text").text()).
        dialog({
    */
        //css({height:"350px", overflow:"auto", max-height:"400px"}).
    $( "#graph-help-text" ).
        dialog({
          position:
            { my: "top", at: "center top+100", of: window},
            //{ my: "top", at: "center bottom+50", of: "#view-top"},
          //modal: true,
          //height: 300,
          width: 800,
          //width:'auto',
          buttons: {
            Ok: function() {
                $( this ).dialog( "close" );
            }
          }
    });

});


function add_node_here(){

        var new_node_name = 'New Unit';

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

                            g.addNode(node_locator, { label : hideRestOfString(new_node_name), render : customRenderFunction} );
                            ids_arr.push(node_locator);
                            edges_arr.push([]);
                            names_obj[node_locator] = {
                                "name" : new_node_name,
                                "locator" : node_locator,
                                "coords_x" : 0,
                                "coords_y" : 0};
                            data_obj[node_locator] = [];

                            //console.log(node_locator)
                            //console.log(node_loc)

                            renderer.drawNode(renderer.graph.nodes[node_locator])

                            raphael_nodes[node_locator].set.translate(new_node_x, new_node_y);
                            renderer.makeDraggable(node_locator);
                            //renderer.enableDragingMode();
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
    var states_str = $(".states_string").text();
    /*
        Толстый костыль: я не знаю, как сделать так, чтобы последняя (лишняя) запятая не выводилась,
        поэтому я просто удаляю лишнюю запятую руками.
        и вторым костылём обрабатываю случай, когда строка пустая.
    */

    var i = names_str.lastIndexOf(",");
    names_str = (i>0) ? names_str.slice(0, i) + names_str.slice(i+1) : names_str;
    i = data_str.lastIndexOf(",");
    data_str = (i>0) ? data_str.slice(0, i) + data_str.slice(i+1) : data_str;
    i = graph_str.lastIndexOf(",");
    graph_str = (i>0) ? graph_str.slice(0, i) + graph_str.slice(i+1) : graph_str;
    i = states_str.lastIndexOf(",");
    states_str = (i>0) ? states_str.slice(0, i) + states_str.slice(i+1) : states_str;

    names_obj = jQuery.parseJSON(names_str);
    data_obj = jQuery.parseJSON(data_str);
    states_obj = jQuery.parseJSON(states_str);

    ids_arr = [];

    var render = customRenderFunction;

    //console.log(names_obj)
    jQuery.each(names_obj, function(id, obj) {
        var label = hideRestOfString(obj["name"]);
        g.addNode(id, { label : label, render : render} );
        ids_arr.push(id);
    });

    edges_arr = jQuery.parseJSON(graph_str );

    var source;
    jQuery.each(edges_arr, function(node_number) {
        jQuery.each(edges_arr[node_number], function(edge_number) {
                source = ids_arr[node_number];

                var edge_data = generateEdgeData(this["disjunctions"], source)
                g.addEdge(source, this["direct_element_id"], { directed : true, label: edge_data.label, stroke: edge_data.color, details: edge_data.details });

        });
    });

    var x_arr = [], y_arr = [];
    var is_defined = true;
    var bad_nodes = 0;
    jQuery.each(names_obj, function(id, obj) {

        if ((obj["coords_x"]==="None") || (obj["coords_y"]==="None")) {
            x_arr.push(Math.random());
            y_arr.push(Math.random());
            bad_nodes++;
        } else {
            x_arr.push(obj["coords_x"]);
            y_arr.push(obj["coords_y"]);
        }
    });
    // if too many nodes are bad, try to use Layout.Spring instead.
    if (1.0*bad_nodes/ids_arr.length > 0.25){
          is_defined=false;
    }

    var layouter;
    if (is_defined) {
        layouter = new Graph.Layout.Saved(g, x_arr, y_arr);
    } else {
    /* layout the graph using the Spring layout implementation */
        layouter = new Graph.Layout.Spring(g);
    }

    var width = $(document).width() - 20;

    var height = 100 + 50*ids_arr.length;


    /* draw the graph using the RaphaelJS draw implementation */
    renderer = new Graph.Renderer.Raphael('canvas', g, width, height);
    renderer.enableDragingMode()
    redraw = function() {
        var layouter = new Graph.Layout.Spring(g);
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

    save_layout = function() {

        // подозреваю, что это можно сделать не в цикле.
        var counter = 0;
        for (var node_id in g.nodes) {

            var metadata = {}

            var node = g.nodes[node_id];

            var bBox = raphael_nodes[node_id].getBBox();

            var node = g.nodes[node_id];
            console.log(node.layoutPosX);
            console.log(node.layoutPosY);
            console.log(node.point);
            console.log((bBox.x + bBox.width / 2 + 20));
            console.log((bBox.y + bBox.height / 2 + 6));

            metadata.coords_x = (bBox.x + bBox.width / 2 + 20) / width;
            metadata.coords_y = (bBox.y + bBox.height / 2 + 6) / height;

            // what if they are undefined?
            // no, they were initialized by random
            x_arr[counter] = metadata.coords_x;
            y_arr[counter] = metadata.coords_y;
            counter++;

            ajax_save_node(node_id, metadata);

        }

//        $(".graph_string").html(JSON.stringify(edges_arr));

    };
    load_layout = function() {
        //var layouter = new Graph.Layout.Saved(g, x_arr, y_arr, bounds);
        var layouter = new Graph.Layout.Saved(g, x_arr, y_arr);
        renderer.draw();
    };


};

