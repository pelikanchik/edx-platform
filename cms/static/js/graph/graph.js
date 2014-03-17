
var redraw, g, renderer;



var add_edge_mode = false;
var mouse_x, mouse_y, origin_x, origin_y = null

document.onmousemove = function (e) {
        e = e || window.event;
        // -5 - so it doesn't interfere with clicking
        mouse_x = e.pageX - $('#canvas').offset().left - 5;
        mouse_y = e.pageY - $('#canvas').offset().top - 5;
        if (add_edge_mode){

            var r = renderer.getCanvas();
            var path = ["M", origin_x, origin_y, "L", mouse_x, mouse_y].join(",");
            if (new_edge_line !=undefined) new_edge_line.remove();
            new_edge_line = r.path(path);
        }
        return;
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


/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {





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

    ids_arr = [];

    var render = customRenderFunction;

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
    //g.addEdge(source, this.direct_element_id, { directed : true, label: edge_label });

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

};

