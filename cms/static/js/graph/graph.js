
var redraw, g, renderer;

var add_edge_mode = false;
var mouse_x, mouse_y, origin_x, origin_y = null

document.onmousemove = function (e) {
        e = e || window.event;
        if (!add_edge_mode) return;
        if (mouse_x == null) {
            mouse_x = e.clientX;
            mouse_y = e.clientY;


            return;
        }
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
    var names_obj = jQuery.parseJSON(names_str);
    var data_obj = jQuery.parseJSON(data_str);

    var ids_arr = [];                       // why is it necessary?


        /* custom render function */
    var render = function(r, node) {
                var color = Raphael.getColor();
                var ellipse = r.ellipse(0, 0, 30, 20).attr({fill: color, stroke: color, "stroke-width": 2});

                var show_details = function(){
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
/*                            },
                            "Новое ребро": function() {
                                add_edge_mode = true;
                                origin_x =
                                $( this ).dialog( "close" );
*/                            }
                          }
                    });
                }
                /* set DOM node ID */
                ellipse.node.id = "node_" + node.id;
                ellipse.node.ondblclick = show_details;

                var vertex_text = r.text(0, 30, node.label);
                vertex_text.node.onclick = show_details;

                var shape = r.set().
//                    r.rect(node.point[0]-30, node.point[1]-13, 60, 44).attr({"fill": "#feb", r : "12px", "stroke-width" : node.distance == 0 ? "3px" : "1px" })).push(
//                    r.text(node.point[0], node.point[1] + 10, (node.label || n.id)  ));
                    push(ellipse).
                    push(vertex_text);
                return shape;
    };

//    alert(names_str);
//    alert(graph_str);

//    alert(names_obj."9c522b8de7f349eca566c7da934aa334");

    jQuery.each(names_obj, function(id, obj) {
        var label = hideRestOfString(obj["name"]);
        g.addNode(id, { label : label, render : render} );
        ids_arr.push(id);
    });


//    var edges_arr = jQuery.parseJSON('[ [{"direct_element_id":"b40da5f79a4d4cc18eba6e06cc80c8dc","disjunctions":[{"conjunctions":[{"source_element_id":"9c522b8de7f349eca566c7da934aa334","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"a09f673c00914203a66ff531c5ac8799","disjunctions":[{"conjunctions":[{"source_element_id":"b40da5f79a4d4cc18eba6e06cc80c8dc","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"67b72948e71f4d5facae44d6564e8d44","disjunctions":[{"conjunctions":[{"source_element_id":"a09f673c00914203a66ff531c5ac8799","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"e00c271f85884ddbb208a491830172bf","disjunctions":[{"conjunctions":[{"source_element_id":"67b72948e71f4d5facae44d6564e8d44","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6e07ca8275404ed4af030d8b05d1e0af","disjunctions":[{"conjunctions":[{"source_element_id":"67b72948e71f4d5facae44d6564e8d44","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"6e07ca8275404ed4af030d8b05d1e0af","disjunctions":[{"conjunctions":[{"source_element_id":"e00c271f85884ddbb208a491830172bf","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"4248689b2d7d44a9a232e89dc26dba52","disjunctions":[{"conjunctions":[{"source_element_id":"6e07ca8275404ed4af030d8b05d1e0af","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"907cfc12b07a4eefaa0f9efea5831bd5","disjunctions":[{"conjunctions":[{"source_element_id":"4248689b2d7d44a9a232e89dc26dba52","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"93845c777c67468badc9b75d23f17cb9","disjunctions":[{"conjunctions":[{"source_element_id":"4248689b2d7d44a9a232e89dc26dba52","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[] ,[{"direct_element_id":"b229b18864a24819bb12fa3cb866b621","disjunctions":[{"conjunctions":[{"source_element_id":"907cfc12b07a4eefaa0f9efea5831bd5","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"b229b18864a24819bb12fa3cb866b621","disjunctions":[{"conjunctions":[{"source_element_id":"93845c777c67468badc9b75d23f17cb9","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","disjunctions":[{"conjunctions":[{"source_element_id":"b229b18864a24819bb12fa3cb866b621","field":"score_abs","sign":"equals","value":"0"}]}]},{"direct_element_id":"33605177a0fe40c287821f04531a4482","disjunctions":[{"conjunctions":[{"source_element_id":"b229b18864a24819bb12fa3cb866b621","field":"score_abs","sign":"more","value":"0"}]}]}] ,[{"direct_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","disjunctions":[{"conjunctions":[{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6e9b14242b1241beb5a3676bdef1f2ec","disjunctions":[{"conjunctions":[{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"4df81d49e19b4f15a9fbeef8db617f08","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6e9b14242b1241beb5a3676bdef1f2ec","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"equals","value":"0"},{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"equals","value":"0"}]}]},{"direct_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"equals","value":"0"},{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"4df81d49e19b4f15a9fbeef8db617f08","disjunctions":[{"conjunctions":[{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"more","value":"0"},{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"more","value":"0"}]}]}] ,[{"direct_element_id":"33605177a0fe40c287821f04531a4482","disjunctions":[{"conjunctions":[{"source_element_id":"4df81d49e19b4f15a9fbeef8db617f08","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"adb35fda9df94d988823592d0647a41d","disjunctions":[{"conjunctions":[{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"b771b98e9bce4277831588bcd2a5f068","disjunctions":[{"conjunctions":[{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"b771b98e9bce4277831588bcd2a5f068","disjunctions":[{"conjunctions":[{"source_element_id":"b771b98e9bce4277831588bcd2a5f068","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"6abde8cef4894e7789e7a5a16d848f2d","disjunctions":[{"conjunctions":[{"source_element_id":"adb35fda9df94d988823592d0647a41d","field":"score_abs","sign":"equals","value":"0"},{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"591e25c30efc42359e7843f88f8b6ab4","disjunctions":[{"conjunctions":[{"source_element_id":"adb35fda9df94d988823592d0647a41d","field":"score_abs","sign":"more","value":"0"},{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"more","value":"0"}]}]}] ,[{"direct_element_id":"b7da075aa6594ae6bf7b9bbbbf7e5add","disjunctions":[{"conjunctions":[{"source_element_id":"591e25c30efc42359e7843f88f8b6ab4","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6abde8cef4894e7789e7a5a16d848f2d","disjunctions":[{"conjunctions":[{"source_element_id":"591e25c30efc42359e7843f88f8b6ab4","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"285a9823025b4ee7a04ff25f57211a96","disjunctions":[{"conjunctions":[{"source_element_id":"b7da075aa6594ae6bf7b9bbbbf7e5add","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"83d4e82c156e49e4bc3fb2f975880ca5","disjunctions":[{"conjunctions":[{"source_element_id":"b7da075aa6594ae6bf7b9bbbbf7e5add","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"1455eb5e4bb84a398352c86df66e2726","disjunctions":[{"conjunctions":[{"source_element_id":"b771b98e9bce4277831588bcd2a5f068","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"285a9823025b4ee7a04ff25f57211a96","disjunctions":[{"conjunctions":[{"source_element_id":"9c522b8de7f349eca566c7da934aa334","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[] ,[]] ');
    var edges_arr = jQuery.parseJSON(graph_str );



var source, edge_label;
jQuery.each(edges_arr, function(node_number) {
    jQuery.each(edges_arr[node_number], function(edge_number) {
            source = ids_arr[node_number];

            var is_complicated = false;
            // how many conditions? more than one?
            if (this.disjunctions.length > 1){
                is_complicated = true;
            } else {
                if (this.disjunctions[0]["conjunctions"].length > 1){
                    is_complicated = true;
                }
            };
            if (is_complicated) edge_label = "сложно";
            else {
                // so, there is only one condition, "if [something], then goto [somewhere]"
                // which unit this condition is related to?
                // the source unit? or something more complicated?

                // condition is shorthand for edges_arr[node_number][i]["disjunctions"][0]["conjunctions"][0]["source_element_id"]
                var condition = this.disjunctions[0]["conjunctions"][0];

                var related_vertex_name;
                if (condition["source_element_id"] === source) {
                    related_vertex_name = "";
                } else {
                    var name = names_obj[condition["source_element_id"]]["name"];
                    related_vertex_name = hideRestOfString(name) + " ";
                }
                var percent_sign = (condition["field"] === "score_rel")? "%" : "";
                var sign = parseSign(condition["sign"]);

                var target_value = condition["value"];

                edge_label = related_vertex_name + sign + " " + target_value + percent_sign;

                }

            g.addEdge(source, this.direct_element_id, { directed : true, label: edge_label });

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

