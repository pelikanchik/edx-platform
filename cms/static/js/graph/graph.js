// TODO: refactor the shit out of it

var redraw, g, renderer;

    /* visualisation of edge adding */
    var add_edge_mode = false;
    var mouse_x, mouse_y, origin_x, origin_y;
    var new_node_x, new_node_y, origin_x, origin_y;
    var origin_node;

    var new_edge_line;

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

/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {

    /* JSON data */
    var edges_arr;
    var names_obj;
    var data_obj;
    var states_obj;

    var ids_arr = [];                       // why is it necessary?

    var raphael_nodes = {};


function generateEdgeData(disjunctions_array, source){
    var details;
    var color = "#999";
    var is_complicated = false;
    var about_source = false;
    // how many conditions? more than one?
    if (disjunctions_array.length > 1){
        is_complicated = true;
    } else {
        if (disjunctions_array[0]["conjunctions"].length > 1){
            is_complicated = true;
        }
    };
    if (is_complicated){
        // blue for "it is complicated"
        color = "#00F";
        details = "сложно";
    }
    else {
        // so, there is only one condition, "if [something], then goto [somewhere]"
        // which unit this condition is related to?
        // the source unit? or something more complicated?

        // condition is shorthand for edges_arr[node_number][i]["disjunctions"][0]["conjunctions"][0]["source_element_id"]
        // I just feel like I should mention it.
        // parsing JSON is fun.
        var condition = disjunctions_array[0]["conjunctions"][0];

        var related_vertex_name;
        if (condition["source_element_id"] === source) {
            related_vertex_name = "";
            about_source = true;
        } else {
            related_vertex_name = names_obj[condition["source_element_id"]]["name"];
        }
        var percent_sign = (condition["field"] === "score_rel")? "%" : "";
        var sign = parseSign(condition["sign"]);

        var target_value = condition["value"];

        details = related_vertex_name + " " + sign + " " + target_value + percent_sign;

        if (!about_source){
            color = "#008";
        } else if (target_value === "0"){
            // green for correct answer
            if (condition["sign"]==="more") color = "#0F0";
            // red for incorrect
            if (condition["sign"]==="equals") color = "#F00";
            // purple for "I don't care, really"
            if (condition["sign"]==="more-equals") color = "#808";
        }
    }
    var edge_label = "";
    var full_related_vertex_name = "";
    if (!is_complicated){
        full_related_vertex_name = names_obj[condition["source_element_id"]]["name"];
    }
    var result = {"label" : edge_label, "color" : color, "details" : details,
                "description" : {
                    "is_complicated" : is_complicated,
                    "related_vertex_name": full_related_vertex_name,
                    "sign" : sign,
                    "value" : target_value,
                    "percent" : percent_sign
                    }
                 };
    return result;
}

function add_node_here(){

        var new_node_name = 'Без имени';

    /*
        var location = "i4x://Org/101/vertical/temp" + Math.round(100*Math.random());

        var i = location.lastIndexOf("/");
        var node_id = location.slice(i+1);

        g.addNode(node_id, { label : hideRestOfString(new_node_name), render : render} );
        ids_arr.push(node_id);
        edges_arr.push([]);
        names_obj[node_id] = {
            "name" : new_node_name,
            "location" : location,
            "coords_x" : 0,
            "coords_y" : 0};
        data_obj[node_id] = [];

        renderer.drawNode(renderer.graph.nodes[node_id])

        raphael_nodes[node_id].set.translate(mouse_x, mouse_y);

    */

        $("#node-name-input").val(new_node_name);
        $( "#add-new-node" ).dialog({
            modal: true,
            width:'auto',
            buttons: {
                Ok: function() {
                    new_node_name = $("#node-name-input").val();
                    //console.log($("#node-name-input").val());
                    $.ajax({
                        url: "/create_item",
                        type: "POST",
                        headers: {
                            'X-CSRFToken': getCookie('csrftoken')
                        },
                        data: {
                            'parent_location': $(".parent-location").text(),
                            'category': 'vertical',
                            'display_name': new_node_name
                        },
                        success : function(answer){

                            var location = answer["id"];

                            var i = location.lastIndexOf("/");
                            var node_id = location.slice(i+1);
                            g.addNode(node_id, { label : hideRestOfString(new_node_name), render : render} );
                            ids_arr.push(node_id);
                            edges_arr.push([]);
                            names_obj[node_id] = {
                                "name" : new_node_name,
                                "location" : location,
                                "coords_x" : 0,
                                "coords_y" : 0};
        //                        "coords_x" : "None",
        //                        "coords_y" : "None"};
                            data_obj[node_id] = [];

                            renderer.drawNode(renderer.graph.nodes[node_id])

                            raphael_nodes[node_id].set.translate(new_node_x, new_node_y);
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

$("#canvas").click(function (e) {
    setTimeout(exitMode, 50);
});

function exitMode(){
    add_edge_mode = false;
    if(new_edge_line!=undefined){
        new_edge_line.remove();
    }
};

function is_edge_exists(origin_node, target){
    var exists = false;

    var origin_node_number = ids_arr.indexOf(origin_node);
    for(var i=0; i<edges_arr[origin_node_number].length; i++){
        var e = edges_arr[origin_node_number][i]
        if (e["direct_element_id"]===target){
            exists = true;
        }

        /*
        var e = g.nodes[origin_node].edges[i];
        if ((e.source.id == origin_node)&&(e.target.id == target)){
            exists = true;
        }
        */
        return exists;
    };
/*    for(var i=0; i<g.nodes[origin_node].edges.length; i++) {
        console.log(g.nodes[origin_node].edges[i]);
        var e = g.nodes[origin_node].edges[i];
        if ((e.source.id == origin_node)&&(e.target.id == target)){
            exists = true;
        }
    };
*/    return exists;
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

function create_new_edge(origin_node, target_node, new_edge_data){
        var origin_node_number = ids_arr.indexOf(origin_node);

        var edges_count = edges_arr[origin_node_number].length;
        edges_arr[origin_node_number].push(new_edge_data);

        var data = generateEdgeData(
            edges_arr[origin_node_number][edges_count]["disjunctions"],
            origin_node);

        g.addEdge(origin_node, target_node, {
            directed: true,
            label: data.label,
            details: data.details,
            stroke: data.color
        });

        var unit_edit = new CMS.Views.UnitEdit({
    //      el: $('.main-wrapper'),
          model: new CMS.Models.Module({
            id: names_obj[origin_node]["location"]
          })
        });

        var metadata = $.extend({}, unit_edit.model.get('metadata'));

        metadata.display_name = names_obj[origin_node]["name"];
        metadata.direct_term = JSON.stringify(edges_arr[origin_node_number]);

        $(".graph_string").html(JSON.stringify(edges_arr));
        ajax_save_item(names_obj[origin_node]["location"], metadata);
}

function bindNewEdgeTo(ellipse, node){

        if (is_edge_exists(origin_node, node.id)){
            alert("Такое ребро уже есть");
            return;
        }
        $( "#node-add-condition" ).dialog({
            modal: true,
            width:'auto',
            buttons: {
                Ok: function() {

                    // "if result > 'Hail Cthulhu'"...
                    // No. Just no.
                    if( !$.isNumeric($("#input-value").val()) ) return;

                    var new_edge_data = {"direct_element_id" : node.id,
                        "disjunctions" : [{
                                "conjunctions" : [{
                                    "source_element_id" : origin_node,
                                    "field" : $("#input-field").val(),
                                    "sign" :  $("#input-sign").val(),
                                    "value" :  $("#input-value").val()
                                }]
                        }]
                    }

                    create_new_edge(origin_node, node.id, new_edge_data);

                    save_layout();
                    load_layout();
                    renderer.draw();

            //        for (var i = 0; i < g.edges.length; i++) {
            //            g.drawEdge(g.edges[i]);
            //        }


                    $( this ).dialog( "close" );
                },
                "Отмена": function() {
                    $( this ).dialog( "close" );
                }
              }
        });
    }

//function createEdgeDeletionCallback( edge , source){
function createEdgeDeletionCallback( source_node_number, edge_number, string_id){
  return function(){

    $( "#confirm-edge-deletion" ).dialog({
        resizable: false,
        height: 200,
        modal: true,
        buttons: {
            "Удалить": function() {

                var edge = edges_arr[source_node_number][edge_number];
                var source_id = ids_arr[source_node_number];
                var target_id = edge.direct_element_id;

                if (!is_edge_exists(source_id, target_id)){
                    alert("Такого ребра не существует!");
                    return;
                }

                edges_arr[source_node_number].splice(edge_number, 1)

                g.removeEdge(source_id, target_id);

                var unit_edit = new CMS.Views.UnitEdit({
                  model: new CMS.Models.Module({
                    id: names_obj[source_id]["location"]
                  })
                });

                var metadata = $.extend({}, unit_edit.model.get('metadata'));

                metadata.display_name = names_obj[source_id]["name"];
                metadata.direct_term = JSON.stringify(edges_arr[source_node_number]);

                $(".graph_string").html(JSON.stringify(edges_arr));
                $("." + string_id).hide();   //css( "display", "none" );
                ajax_save_item(names_obj[source_id]["location"], metadata);
                $( this ).dialog( "close" );
            },
            "Отмена": function() {
                $( this ).dialog( "close" );
            }
        }
    });

  }
}

function createNodeRenameCallback( node){
  return function(){
        $("#node-rename-input").val(names_obj[node.id]["name"]);

        $( "#rename-node" ).dialog({
              modal: true,
              buttons: {
                Ok: function() {

                    // TODO: make a function about metadata or something

                    var node_name = $("#node-rename-input").val();
                    names_obj[node.id]["name"] = node_name;

                    var unit_edit = new CMS.Views.UnitEdit({
                      model: new CMS.Models.Module({
                        id: names_obj[node.id]["location"]
                      })
                    });
                    var metadata = $.extend({}, unit_edit.model.get('metadata'));

                    metadata.display_name = node_name;
                    ajax_save_item(names_obj[node.id]["location"], metadata);

                    renderer.renameNode(node, node_name)

                    $( this ).dialog( "close" );
                },
                "Отмена": function() {
                    $( this ).dialog( "close" );
                }
              }
        });
    }
}



function showNodeDetails(node){
    var S;
//    var message = names_obj[node.id]["name"];
    $(".node-data").remove();
    jQuery.each(data_obj[node.id], function(number) {
        if (data_obj[node.id][number].type != undefined){
            S = "";
            if (data_obj[node.id][number].name!="") S += data_obj[node.id][number].name + " : ";
            S += parseType(data_obj[node.id][number].type);
            $( "#node-content").append("<p class=\"node-data\">" + S + "</p>");
    //                            $( "#node-details").append("<p>" + parse_type(data_obj[node.id][number].type) + " - " + data_obj[node.id][number].url +  "</p>");
        }
    });
    $(".node-name").text(names_obj[node.id]["name"]);

    var renamer = createNodeRenameCallback(node);

    $(".node-name").unbind( "click");
    $(".node-name").bind( "click", renamer );

    $(".node-edit-link").
        attr("href", "/vertex/edit/" + names_obj[node.id]["location"]).
        fancybox({
            width         : '75%',
            height        : '80%',
            autoScale     : false,
            autoSize      : false,
            autoDimensions: false,
            fitToView     : false,
            type          : 'iframe',
    //            hideOnOverlayClick:false,
    //            hideOnContentClick:false,
            closeClick: false,
            helpers     : {
                overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
            }
        })

        var node_number = ids_arr.indexOf(node.id);
        for(var i=0; i<edges_arr[node_number].length; i++) {
//            console.log(g.nodes[origin_node].edges[i]);
//            var e = g.nodes[node.id].edges[i];
//            if (e.source.id == node.id){
            var edge = edges_arr[node_number][i];
            var target_id = edge.direct_element_id;

            var string_id = "node-edges-" + i;
            var img_id = "delete-" + string_id;
//            alert(img_id);
            S = names_obj[target_id]["name"];
            var text_description = "Сложное условие";

            var data = generateEdgeData(edge.disjunctions, node.id).description;
            text_description = "Если набрать в " + data.related_vertex_name + " " + data.sign + " " + data.value + data.percent;

            // TODO:
            // make a normal function generating this string

            $( "#node-edges-list").append(
                "<p class=\"node-data " + string_id + "\" title=\"" + text_description + "\">"
//                + "<img class = \"close\" src = \"/static/img/Delete-icon.png\" data-bind='click: $root.removeDisjunction'/>"
                + "<img class = \"close " + string_id + "\" src = \"/static/img/Delete-icon.png\" id = \"" + img_id + "\"/>"
                + S + "</p>"
            );

//            var handler = createEdgeDeletionCallback(edge, node.id);
            var handler = createEdgeDeletionCallback(node_number, i, string_id);

            $( "#" + img_id ).unbind( "click");
            $( "#" + img_id ).bind( "click", handler );

        };

    $( "#node-details" ).dialog({
          modal: true,
          buttons: {
            Ok: function() {

/*
                var node_name = $("#node-name-input").val();
        var metadata = $.extend({}, unit_edit.model.get('metadata'));

        metadata.display_name = names_obj[origin_node]["name"];
        metadata.direct_term = JSON.stringify(edges_arr[origin_node_number]);

        $(".graph_string").html(JSON.stringify(edges_arr));
        ajax_save_item(names_obj[origin_node]["location"], metadata);
*/
                $( this ).dialog( "close" );
            },
            "Новое ребро": function() {
                add_edge_mode = true;


                var bBox = raphael_nodes[node.id].getBBox();
                origin_x = (bBox.x + bBox.width / 2);
                origin_y = (bBox.y + bBox.height / 2);

//                origin_x = ellipse.attr('cx');
//                origin_y = ellipse.attr('cy');
                origin_node = node.id;

//                console.log(g.nodes[node.id].edges);
                $( this ).dialog( "close" );
            }
          }
    });
}

document.onmousemove = function (e) {
        e = e || window.event;
        // -5 - so it doesn't interfere with clicking
        mouse_x = e.pageX - $('#canvas').offset().left - 5;
        mouse_y = e.pageY - $('#canvas').offset().top - 5;
        if (!add_edge_mode) return;

            var r = renderer.getCanvas();

            var path = ["M", origin_x, origin_y, "L", mouse_x, mouse_y].join(",");

            if (new_edge_line !=undefined) new_edge_line.remove();

            new_edge_line = r.path(path);

            return;
//        }
}

    g = new Graph();

/*
        var set = r.set().push(
                r.rect(n.point[0]-30, n.point[1]-13, 60, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : n.distance == 0 ? "3px" : "1px" })).push(
                r.text(n.point[0], n.point[1] + 10, (n.label || n.id) + "\n(" + (n.distance == undefined ? "Infinity" : n.distance) + ")"));
            return set;
*/
    var states_str = $(".states_string").text();
    var data_str = $(".data_string").text();
    var names_str = $(".names_string").text();
    var graph_str = $(".graph_string").text();
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
    i = states_str.lastIndexOf(",");
    states_str = states_str.slice(0, i) + states_str.slice(i+1);

    names_obj = jQuery.parseJSON(names_str);
    data_obj = jQuery.parseJSON(data_str);
    states_obj = jQuery.parseJSON(states_str);

    /* custom render function */
    var render = function(r, node) {
//                var color = Raphael.getColor();
                var color;
                var node_number = ids_arr.indexOf(node.id);
//                var node_size = edges_arr[node_number].length + 1;
                var node_size = 2;
                var has_video = false;
                var has_capa = false;
                var has_text = false;
                jQuery.each(data_obj[node.id], function(number) {
                    if (data_obj[node.id][number].type != undefined){
                        var content_type = data_obj[node.id][number].type;
                        if (content_type === "VideoDescriptor"){
                            has_video = true;
                        }
                        if (content_type === "HtmlDescriptor"){
                            has_text = true;
                        }
                        if (content_type === "CapaDescriptor"){
                            has_capa= true;
                        }
                    }
                });

                var node_form;
                var vertex_text;
                color = (has_capa)? "#ffd700" : "#080808";
                //color = (has_capa)? "#ffd700" : Raphael.getColor();


                if (has_video){
                    var x = 15*node_size;
                    var y = 10*node_size;
                    node_form = r.rect(x, y, 30*node_size, 20*node_size, 10)
                        .attr({fill: color, stroke: color, "stroke-width": 2});
                                    var h = node_form.getBBox().height;
                    var cx = x + node_form.getBBox().width/2;
                    var cy = y + node_form.getBBox().height;
                    vertex_text = r.text(cx, cy + 10, node.label);
                }
                if (has_text){
                  //Raphael.fn.hexagon = function(radius, cx, cy) {
                  var path = ""
                  var radius = 30*0.5*node_size;
                  for (var i = 0; i <= 6; i++) {
                    var a = i * 60,
                        x = radius * Math.cos(a * Math.PI / 180),
                        y = radius * Math.sin(a * Math.PI / 180)
                    path += (i == 0 ? "M" : "L") + x + "," + y
                  }
                  path += "Z"
                  node_form = r.path(path).attr({fill: color, stroke: color, "stroke-width": 2});
                  vertex_text = r.text(0, radius + 5, node.label);
                }

                if (!(has_video || has_text)) {
                    node_form = r.ellipse(0, 0, 30*0.5*node_size, 20*0.5*node_size)
                        .attr({fill: color, stroke: color, "stroke-width": 2});
                    var h = node_form.getBBox().height;
                    vertex_text = r.text(0, h/2 + 10, node.label);
                }

                var show_details = function(){
                    if (!add_edge_mode) showNodeDetails(node);
                }

                /* set DOM node ID */
                node_form.node.id = "node_" + node.id;
//                ellipse.node.ondblclick = show_details;

                var shape = r.set().
//                    r.rect(node.point[0]-30, node.point[1]-13, 60, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : node.distance == 0 ? "3px" : "1px" })).push(
//                    r.text(node.point[0], node.point[1] + 10, (node.label || n.id)  ));
                    push(node_form).
                    push(vertex_text);

                var renamer = createNodeRenameCallback(node);
//                vertex_text.node.ondblclick = renamer;

                node_form.node.onclick = function(){
                    if (add_edge_mode) bindNewEdgeTo(node_form, node);
                    if (!renderer.getDragingMode()) show_details();
                };
                vertex_text.node.onclick = function(){
                    if (add_edge_mode) bindNewEdgeTo(node_form, node);
                        else renamer();
                };

                raphael_nodes[node.id] = node_form;
//                console.log(ellipse);

                return shape;
    };


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

            var edge_data = generateEdgeData(this.disjunctions, source)
            g.addEdge(source, this.direct_element_id, { directed : true, label: edge_data.label, stroke: edge_data.color, details: edge_data.details });

    });
});


var x_arr = [], y_arr = [];
var is_defined = true;

    jQuery.each(names_obj, function(id, obj) {

        if ((obj["coords_x"]==="None") || (obj["coords_y"]==="None")) {

            x_arr.push(Math.random());
            y_arr.push(Math.random());
//          is_defined=false;
        } else {
            x_arr.push(obj["coords_x"]);
            y_arr.push(obj["coords_y"]);
        }
    });

//    jQuery.each(ids_arr, function(source_node_number, node_id) {
//        order.push(g.graph.nodes[source_node_number]);
//            node_id);
//    });
//    alert(order);

var layouter;
    if (is_defined) {
        layouter = new Graph.Layout.Saved(g, x_arr, y_arr);
    } else {
        layouter = new Graph.Layout.Spring(g);
    }


    /* layout the graph using the Spring layout implementation */
//    layouter = new Graph.Layout.Spring(g);
//    layouter = new Graph.Layout.Ordered(g, g.nodes);

    var width = $(document).width() - 20;

//    var height = $(document).height() - 60;





    var height = 100 + 50*ids_arr.length;
//    var height = 300;

    /* draw the graph using the RaphaelJS draw implementation */
    renderer = new Graph.Renderer.Raphael('canvas', g, width, height);

    redraw = function() {
        var layouter = new Graph.Layout.Spring(g);
        layouter.layout();
        renderer.draw();
    };


    save_layout = function() {

        // подозреваю, что это можно сделать не в цикле.
        var counter = 0;
        for (var node_id in g.nodes) {
            var unit_edit = new CMS.Views.UnitEdit({
              model: new CMS.Models.Module({
                id: names_obj[node_id]["location"]
              })
            });

            var metadata = $.extend({}, unit_edit.model.get('metadata'));

            var node = g.nodes[node_id];

            var bBox = raphael_nodes[node_id].getBBox();

            metadata.coords_x = (bBox.x + bBox.width / 2) / width;
            metadata.coords_y = (bBox.y + bBox.height / 2) / height;

//            console.log($("#node_" + node_id) );
//            console.log($("#node_" + node_id).attr('cx'));
//            console.log(raphael_nodes[node_id].getBBox().x);




            // what if they are undefined?
            // no, they were initialized by random
            x_arr[counter] = metadata.coords_x;
            y_arr[counter] = metadata.coords_y;
            counter++;

            $.ajax({
                url: "/save_item",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                data: JSON.stringify({
                    'id': names_obj[node_id]["location"],
                    'metadata': metadata
                    })
            });
            if (states_obj[node_id] == "public"){
                $.ajax({
                    url: "/publish_draft",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    data: JSON.stringify({
                        'id': names_obj[node_id]["location"]
                    })
                });
            }
        }

//        $(".graph_string").html(JSON.stringify(edges_arr));

};

    load_layout = function() {
        var layouter = new Graph.Layout.Saved(g, x_arr, y_arr);
        renderer.draw();
    };


    hide_red_edges = function() {

        for(var i = 0; i < g.edges.length; i++) {
            if (g.edges[i].color == "#F00"){
                g.edges[i].hide();
//                console.log(g.edges[i]);
            }
        }

    };

    moving_mode = function() {
        if (renderer.getDragingMode()) {
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
            renderer.disableDragingMode();
        } else {
            renderer.enableDragingMode();
        };
    }
};


