
var redraw, g, renderer;

var N =15;

/* only do all this when document has finished loading (needed for RaphaelJS) */
window.onload = function() {

    g = new Graph();

    var names_str = $(".names_string").text();
    var graph_str = $(".graph_string").text();
    /*
        Толстый костыль: я не знаю, как сделать так, чтобы последняя (лишняя) запятая не выводилась,
        поэтому я просто удаляю лишнюю запятую руками.
    */

    var i = names_str.lastIndexOf(",");
    names_str = names_str.slice(0, i) + names_str.slice(i+1);
    i = graph_str.lastIndexOf(",");
    graph_str = graph_str.slice(0, i) + graph_str.slice(i+1);


//    var names = jQuery.parseJSON('{ "9c522b8de7f349eca566c7da934aa334" : "2.2. Вероятностное пространство", "b40da5f79a4d4cc18eba6e06cc80c8dc" : "2.3. Событие, вероятность", "a09f673c00914203a66ff531c5ac8799" : "2.4. Две монетки", "67b72948e71f4d5facae44d6564e8d44" : "2.5. Две монетки", "e00c271f85884ddbb208a491830172bf" : "2.5.2. Отступление про ребра и зависание в воздухе", "6e07ca8275404ed4af030d8b05d1e0af" : "2.6. Решение", "4248689b2d7d44a9a232e89dc26dba52" : "2.7. Ответ и новая задачка", "dddf4927b92a4cd58faeedeba96e2db6" : "2.7.1. Решение", "907cfc12b07a4eefaa0f9efea5831bd5" : "2.7.2. Верно", "93845c777c67468badc9b75d23f17cb9" : "2.7.4. Неверно", "b229b18864a24819bb12fa3cb866b621" : "2.8. Простую или сложную?", "e970a8e7dd214c338bcf22fe2011a9f0" : "2.8.1. Простая задачка", "dc03b5d3bfe54dd0956638a94e2376d4" : "2.8.2. Верно, следующий вопрос", "6e9b14242b1241beb5a3676bdef1f2ec" : "2.8.3. Неверно", "4df81d49e19b4f15a9fbeef8db617f08" : "2.8.4. Оба ответа на задачку даны верно", "33605177a0fe40c287821f04531a4482" : "2.9. Задача про три монеты", "6abde8cef4894e7789e7a5a16d848f2d" : "2.9.1. Неверно", "adb35fda9df94d988823592d0647a41d" : "2.9.2. Верно, следующий вопрос", "591e25c30efc42359e7843f88f8b6ab4" : "2.9.3. Верно, следующий вопрос", "b7da075aa6594ae6bf7b9bbbbf7e5add" : "2.9.4. Всё хорошо, что делаем дальше?", "b771b98e9bce4277831588bcd2a5f068" : "3.1. Решение сложной задачки", "1455eb5e4bb84a398352c86df66e2726" : "3.2. Решение сложной задачки", "285a9823025b4ee7a04ff25f57211a96" : "3.3. Начало тренировки", "83d4e82c156e49e4bc3fb2f975880ca5" : "The End"} ');
    var names_obj = jQuery.parseJSON(names_str);

    var ids_arr = [];

//    alert(names_str);
//    alert(graph_str);

//    alert(names_obj."9c522b8de7f349eca566c7da934aa334");

    jQuery.each(names_obj, function(id, name) {
        var label = name;
        if (label.length > N) label = label.slice(0, N - 3) + "...";
        g.addNode(id, { label : label });
        ids_arr.push(id);
    });


//    var edges_arr = jQuery.parseJSON('[ [{"direct_element_id":"b40da5f79a4d4cc18eba6e06cc80c8dc","disjunctions":[{"conjunctions":[{"source_element_id":"9c522b8de7f349eca566c7da934aa334","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"a09f673c00914203a66ff531c5ac8799","disjunctions":[{"conjunctions":[{"source_element_id":"b40da5f79a4d4cc18eba6e06cc80c8dc","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"67b72948e71f4d5facae44d6564e8d44","disjunctions":[{"conjunctions":[{"source_element_id":"a09f673c00914203a66ff531c5ac8799","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"e00c271f85884ddbb208a491830172bf","disjunctions":[{"conjunctions":[{"source_element_id":"67b72948e71f4d5facae44d6564e8d44","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6e07ca8275404ed4af030d8b05d1e0af","disjunctions":[{"conjunctions":[{"source_element_id":"67b72948e71f4d5facae44d6564e8d44","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"6e07ca8275404ed4af030d8b05d1e0af","disjunctions":[{"conjunctions":[{"source_element_id":"e00c271f85884ddbb208a491830172bf","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"4248689b2d7d44a9a232e89dc26dba52","disjunctions":[{"conjunctions":[{"source_element_id":"6e07ca8275404ed4af030d8b05d1e0af","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"907cfc12b07a4eefaa0f9efea5831bd5","disjunctions":[{"conjunctions":[{"source_element_id":"4248689b2d7d44a9a232e89dc26dba52","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"93845c777c67468badc9b75d23f17cb9","disjunctions":[{"conjunctions":[{"source_element_id":"4248689b2d7d44a9a232e89dc26dba52","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[] ,[{"direct_element_id":"b229b18864a24819bb12fa3cb866b621","disjunctions":[{"conjunctions":[{"source_element_id":"907cfc12b07a4eefaa0f9efea5831bd5","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"b229b18864a24819bb12fa3cb866b621","disjunctions":[{"conjunctions":[{"source_element_id":"93845c777c67468badc9b75d23f17cb9","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","disjunctions":[{"conjunctions":[{"source_element_id":"b229b18864a24819bb12fa3cb866b621","field":"score_abs","sign":"equals","value":"0"}]}]},{"direct_element_id":"33605177a0fe40c287821f04531a4482","disjunctions":[{"conjunctions":[{"source_element_id":"b229b18864a24819bb12fa3cb866b621","field":"score_abs","sign":"more","value":"0"}]}]}] ,[{"direct_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","disjunctions":[{"conjunctions":[{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6e9b14242b1241beb5a3676bdef1f2ec","disjunctions":[{"conjunctions":[{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"4df81d49e19b4f15a9fbeef8db617f08","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6e9b14242b1241beb5a3676bdef1f2ec","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"equals","value":"0"},{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"equals","value":"0"}]}]},{"direct_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","disjunctions":[{"conjunctions":[{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"equals","value":"0"},{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"4df81d49e19b4f15a9fbeef8db617f08","disjunctions":[{"conjunctions":[{"source_element_id":"e970a8e7dd214c338bcf22fe2011a9f0","field":"score_abs","sign":"more","value":"0"},{"source_element_id":"dc03b5d3bfe54dd0956638a94e2376d4","field":"score_abs","sign":"more","value":"0"}]}]}] ,[{"direct_element_id":"33605177a0fe40c287821f04531a4482","disjunctions":[{"conjunctions":[{"source_element_id":"4df81d49e19b4f15a9fbeef8db617f08","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"adb35fda9df94d988823592d0647a41d","disjunctions":[{"conjunctions":[{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"b771b98e9bce4277831588bcd2a5f068","disjunctions":[{"conjunctions":[{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"b771b98e9bce4277831588bcd2a5f068","disjunctions":[{"conjunctions":[{"source_element_id":"b771b98e9bce4277831588bcd2a5f068","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"6abde8cef4894e7789e7a5a16d848f2d","disjunctions":[{"conjunctions":[{"source_element_id":"adb35fda9df94d988823592d0647a41d","field":"score_abs","sign":"equals","value":"0"},{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"591e25c30efc42359e7843f88f8b6ab4","disjunctions":[{"conjunctions":[{"source_element_id":"adb35fda9df94d988823592d0647a41d","field":"score_abs","sign":"more","value":"0"},{"source_element_id":"33605177a0fe40c287821f04531a4482","field":"score_abs","sign":"more","value":"0"}]}]}] ,[{"direct_element_id":"b7da075aa6594ae6bf7b9bbbbf7e5add","disjunctions":[{"conjunctions":[{"source_element_id":"591e25c30efc42359e7843f88f8b6ab4","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"6abde8cef4894e7789e7a5a16d848f2d","disjunctions":[{"conjunctions":[{"source_element_id":"591e25c30efc42359e7843f88f8b6ab4","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"285a9823025b4ee7a04ff25f57211a96","disjunctions":[{"conjunctions":[{"source_element_id":"b7da075aa6594ae6bf7b9bbbbf7e5add","field":"score_abs","sign":"more","value":"0"}]}]},{"direct_element_id":"83d4e82c156e49e4bc3fb2f975880ca5","disjunctions":[{"conjunctions":[{"source_element_id":"b7da075aa6594ae6bf7b9bbbbf7e5add","field":"score_abs","sign":"equals","value":"0"}]}]}] ,[{"direct_element_id":"1455eb5e4bb84a398352c86df66e2726","disjunctions":[{"conjunctions":[{"source_element_id":"b771b98e9bce4277831588bcd2a5f068","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[{"direct_element_id":"285a9823025b4ee7a04ff25f57211a96","disjunctions":[{"conjunctions":[{"source_element_id":"9c522b8de7f349eca566c7da934aa334","field":"score_abs","sign":"more-equals","value":"0"}]}]}] ,[] ,[]] ');
    var edges_arr = jQuery.parseJSON(graph_str );



var source;
jQuery.each(edges_arr, function(node_number) {
    jQuery.each(edges_arr[node_number], function() {
            source = ids_arr[node_number];
//            alert("source is " + source);
//            alert("dest is " + this.direct_element_id);

            g.addEdge(source, this.direct_element_id, { directed : true });

    });
});


//    for( var edge in obj) {

    /* layout the graph using the Spring layout implementation */
    var layouter = new Graph.Layout.Spring(g);

    var width = $(document).width() - 20;


//    var height = $(document).height() - 60;
    var height = 400 + 40*ids_arr.length;

    /* draw the graph using the RaphaelJS draw implementation */
    renderer = new Graph.Renderer.Raphael('canvas', g, width, height);

    redraw = function() {
        layouter.layout();
        renderer.draw();
    };

    //    console.log(g.nodes["kiwi"]);
};

/*
    function popupWindow(url) {
  window.open(url,'popupWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,copyhistory=no,width=100,height=100,screenX=150,screenY=150,top=150,left=150')
}

    */