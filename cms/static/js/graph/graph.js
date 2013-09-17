var tmp_y;


var redraw, g, renderer;

    /* visualisation of edge adding */
    var add_edge_mode = false;
    var mouse_x, mouse_y, origin_x, origin_y;
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

/*

*/
//alert(getCookie('csrftoken'));

    /* JSON data */
    var edges_arr;
    var names_obj;
    var data_obj;

    var ids_arr = [];                       // why is it necessary?

    var raphael_nodes = {};



function generateEdgeData(disjunctions_array, source){
    var edge_label;
    var details;
    var color = "#999";
    var is_complicated = false;
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
        edge_label = details = "сложно";
    }
    else {
        // so, there is only one condition, "if [something], then goto [somewhere]"
        // which unit this condition is related to?
        // the source unit? or something more complicated?

        // condition is shorthand for edges_arr[node_number][i]["disjunctions"][0]["conjunctions"][0]["source_element_id"]
        // I just feel like I should mention it.
        // parsing JSON is fun.
        var condition = disjunctions_array[0]["conjunctions"][0];

        var related_vertex_name, short_related_vertex_name;
        if (condition["source_element_id"] === source) {
            short_related_vertex_name = "";
            related_vertex_name = "";
        } else {
            var related_vertex_name = names_obj[condition["source_element_id"]]["name"];
            short_related_vertex_name = hideRestOfString(related_vertex_name );
        }
        var percent_sign = (condition["field"] === "score_rel")? "%" : "";
        var sign = parseSign(condition["sign"]);

        var target_value = condition["value"];

        edge_label = short_related_vertex_name + " "+ sign + " " + target_value + percent_sign;
        details = related_vertex_name + " " + sign + " " + target_value + percent_sign;

        if (target_value === "0"){
            // green for correct answer
            if (condition["sign"]==="more") color = "#0F0";
            // red for incorrect
            if (condition["sign"]==="equals") color = "#F00";
            // purple for "I don't care, really"
            if (condition["sign"]==="more-equals") color = "#808";
        }
    }
    edge_label = "";
    var result = {"label" : edge_label, "color" : color, "details" : details};
    return result;
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

function bindNewEdgeTo(ellipse, node){

        // TODO
        //if( если такого ребра ещё нет)
        //
        var exists = false;
        for(var i=0; i<g.nodes[origin_node].edges.length; i++) {
            console.log(g.nodes[origin_node].edges[i]);
            var e = g.nodes[origin_node].edges[i];
            if ((e.source.id == origin_node)&&(e.target.id == node.id)){
                exists = true;
            }
        };
        if (exists){
            alert("Такое ребро уже есть");
            return;
        }
//        origin_node, node.id
//        if()
//        g.nodes[node.id].edges

        $( "#node-add-condition" ).dialog({
            modal: true,
            width:'auto',
            buttons: {
                Ok: function() {

                    // "if result > 'Hail Cthulhu'"...
                    // No. Just no.
                    if( !$.isNumeric($("#input-value").val()) ) return;

                    var unit_edit = new CMS.Views.UnitEdit({
                //      el: $('.main-wrapper'),
                      model: new CMS.Models.Module({
                        id: names_obj[origin_node]["location"]
                      })
                    });

                    var origin_node_number = ids_arr.indexOf(origin_node);

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

                    edges_arr[origin_node_number].push(new_edge_data);

                    // not 0!!!
                    var edges_count = edges_arr[origin_node_number].length - 1;
                    var data = generateEdgeData(
                        edges_arr[origin_node_number][edges_count]["disjunctions"],
                        origin_node);
                    console.log(data);
                    g.addEdge(origin_node, node.id, {
                        directed: true,
                        label: data.label,
                        details: data.details,
                        stroke: data.color
                    });

                    var metadata = $.extend({}, unit_edit.model.get('metadata'));

//                      TODO:
//                      edit course name

                    metadata.display_name = names_obj[origin_node]["name"];
                    metadata.direct_term = JSON.stringify(edges_arr[origin_node_number]);

                    $(".graph_string").html(JSON.stringify(edges_arr));
                    $.ajax({
                        url: "/save_item",
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        headers: {
                            'X-CSRFToken': getCookie('csrftoken')
                        },
                        data: JSON.stringify({
                            'id': names_obj[origin_node]["location"],
                            'metadata': metadata
                            })
                    });

                    // TODO
                    ///!\layouter...
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

// TODO: ellipse is not needed
function showNodeDetails(ellipse, node){
    var S;
    var message = names_obj[node.id]["name"];
    $(".node-data").remove();
    jQuery.each(data_obj[node.id], function(number) {
        if (data_obj[node.id][number].type != undefined){
            S = "";
            if (data_obj[node.id][number].name!="") S += data_obj[node.id][number].name + " : ";
            S += parseType(data_obj[node.id][number].type);
            $( "#node-details").append("<p class=\"node-data\">" + S + "</p>");
    //                            $( "#node-details").append("<p>" + parse_type(data_obj[node.id][number].type) + " - " + data_obj[node.id][number].url +  "</p>");
        }
    });
    $(".dialog-message").text(message);
    $(".node-edit-link").attr("href", "/edit/" + names_obj[node.id]["location"]);
    $( "#node-details" ).dialog({
          modal: true,
          buttons: {
            Ok: function() {
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

                console.log(g.nodes[node.id].edges);
                $( this ).dialog( "close" );
            }
          }
    });


}

document.onmousemove = function (e) {
        e = e || window.event;
        tmp_y = e.clientY;
        mouse_x = e.pageX - $('#canvas').offset().left + 5;
        mouse_y = e.pageY - $('#canvas').offset().top + 5;
        if (!add_edge_mode) return;

            var r = renderer.getCanvas();

            // +5 - so it doesn't interfere with clicking
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


//    var names = jQuery.parseJSON('{ "9c522b8de7f349eca566c7da934aa334" : "2.2. Вероятностное пространство", "b40da5f79a4d4cc18eba6e06cc80c8dc" : "2.3. Событие, вероятность", "a09f673c00914203a66ff531c5ac8799" : "2.4. Две монетки", "67b72948e71f4d5facae44d6564e8d44" : "2.5. Две монетки", "e00c271f85884ddbb208a491830172bf" : "2.5.2. Отступление про ребра и зависание в воздухе", "6e07ca8275404ed4af030d8b05d1e0af" : "2.6. Решение", "4248689b2d7d44a9a232e89dc26dba52" : "2.7. Ответ и новая задачка", "dddf4927b92a4cd58faeedeba96e2db6" : "2.7.1. Решение", "907cfc12b07a4eefaa0f9efea5831bd5" : "2.7.2. Верно", "93845c777c67468badc9b75d23f17cb9" : "2.7.4. Неверно", "b229b18864a24819bb12fa3cb866b621" : "2.8. Простую или сложную?", "e970a8e7dd214c338bcf22fe2011a9f0" : "2.8.1. Простая задачка", "dc03b5d3bfe54dd0956638a94e2376d4" : "2.8.2. Верно, следующий вопрос", "6e9b14242b1241beb5a3676bdef1f2ec" : "2.8.3. Неверно", "4df81d49e19b4f15a9fbeef8db617f08" : "2.8.4. Оба ответа на задачку даны верно", "33605177a0fe40c287821f04531a4482" : "2.9. Задача про три монеты", "6abde8cef4894e7789e7a5a16d848f2d" : "2.9.1. Неверно", "adb35fda9df94d988823592d0647a41d" : "2.9.2. Верно, следующий вопрос", "591e25c30efc42359e7843f88f8b6ab4" : "2.9.3. Верно, следующий вопрос", "b7da075aa6594ae6bf7b9bbbbf7e5add" : "2.9.4. Всё хорошо, что делаем дальше?", "b771b98e9bce4277831588bcd2a5f068" : "3.1. Решение сложной задачки", "1455eb5e4bb84a398352c86df66e2726" : "3.2. Решение сложной задачки", "285a9823025b4ee7a04ff25f57211a96" : "3.3. Начало тренировки", "83d4e82c156e49e4bc3fb2f975880ca5" : "The End"} ');
    names_obj = jQuery.parseJSON(names_str);
    data_obj = jQuery.parseJSON(data_str);




        /* custom render function */
    var render = function(r, node) {
                var color = Raphael.getColor();
                var ellipse = r.ellipse(0, 0, 30, 20).attr({fill: color, stroke: color, "stroke-width": 2});

                var show_details = function(){
                    if (!add_edge_mode) showNodeDetails(ellipse, node);
                }


                /* set DOM node ID */
                ellipse.node.id = "node_" + node.id;
                ellipse.node.ondblclick = show_details;
                ellipse.node.onclick = function(){
                    if (add_edge_mode) bindNewEdgeTo(ellipse, node);
                };

                var vertex_text = r.text(0, 30, node.label);
                vertex_text.node.onclick = show_details;

                ellipse.node.style.cursor = "move";
                vertex_text.node.style.cursor = "pointer";



                var shape = r.set().
//                    r.rect(node.point[0]-30, node.point[1]-13, 60, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : node.distance == 0 ? "3px" : "1px" })).push(
//                    r.text(node.point[0], node.point[1] + 10, (node.label || n.id)  ));
                    push(ellipse).
                    push(vertex_text);

                raphael_nodes[node.id] = ellipse;
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

//    jQuery.each(ids_arr, function(node_number, node_id) {
//        order.push(g.graph.nodes[node_number]);
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
                    'metadata': metadata,
                    'state': 'public'
                    })
            });
        }

//        $(".graph_string").html(JSON.stringify(edges_arr));

};

    load_layout = function() {
        var layouter = new Graph.Layout.Saved(g, x_arr, y_arr);
        renderer.draw();
    };

    add_node = function() {

        var new_node_name = 'Новый элемент этого графа';

        $("#node-name-input").val(new_node_name);
        $( "#add-new-node" ).dialog({
            modal: true,
            width:'auto',
            buttons: {
                Ok: function() {
                    new_node_name = $("#node-name-input").val();
                    console.log($("#node-name-input").val());
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

//                    var location = jQuery.parseJSON(answer)["id"];
                    var location = answer["id"];

//                    var location = "i4x://Org/101/vertical/something" + 100*Math.random();
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

                    renderer.draw()
                    raphael_nodes[node_id].set.translate(mouse_x, mouse_y);

//                    raphael_nodes[node_id].dx = 0;

                // XXX
//                    raphael_nodes[node_id].dy = raphael_nodes[node_id].set.getBBox().height + 20;
//                    raphael_nodes[node_id].dy = tmp_y;
//                    raphael_nodes[node_id].dy = 0;
                    renderer.isDrag = raphael_nodes[node_id];

//                    g.drawNode(g.nodes[g.nodes.length - 1]);

                }
            });
                    $( this ).dialog( "close" );
                }
            }
        })



//            renderer.drawNode(g.nodes[ids_arr.length - 1]);

/*        $.when(renderer.draw()).done(function(){ */



//                console.log(raphael_nodes[node_id].set.getBBox().height );
//                console.log(node_height );

//                    raphael_nodes[node_id].dx = mouse_x + width;
//                    console.log();
//                    raphael_nodes[node_id].dx = mouse_x + $('#canvas').offset().left;
//                    raphael_nodes[node_id].dy = mouse_y + $('#canvas').offset().top;


//                    raphael_nodes[node_id].dy = mouse_y + $('#canvas').offset().top;
//                    renderer.isDrag = raphael_nodes["938fbca07e994db893abc2c2ad810d68"];
//                    raphael_nodes["938fbca07e994db893abc2c2ad810d68"].dx = mouse_x + 700;
//                    raphael_nodes["938fbca07e994db893abc2c2ad810d68"].dy = mouse_y - 250;

//        });



/*


        raphael_nodes["938fbca07e994db893abc2c2ad810d68"].dx = mouse_x - 50;


//        $("#node_" + node_id).attr();



//                    tmp = raphael_nodes[node_id];
//                    setTimeout("tmp.dy = mouse_y - 50", 100);


//                    raphael_nodes[node_id].dx = 300;
//                    raphael_nodes[node_id].dy = 300;
                    console.log(mouse_y);
                    console.log(raphael_nodes[node_id]);
*/
    };

};

