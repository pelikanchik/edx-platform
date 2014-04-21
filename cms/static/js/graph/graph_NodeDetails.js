/**
 * Created by bt on 11.03.14.
 */

//var j$ = jQuery.noConflict();
//var $ = jQuery.noConflict();

function ajax_save_node(id, metadata){
    $.ajax({
        //url: "/save_item",
        url: "/xblock/" + id,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        data: JSON.stringify({
            'id': id,
            "state":"public",
            "data":null,
            "children":null,
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

        var metadata = {}
        metadata.display_name = $.grep(names_obj, function(e){ return e.locator == origin_node })[0]["name"];
        var locator_term = edges_arr[origin_node_number]

        metadata.locator_term = JSON.stringify(edges_arr[origin_node_number]);
        //metadata.direct_term = JSON.stringify(edges_arr[origin_node_number]);

        $(".graph_string").html(JSON.stringify(edges_arr));
        //ajax_save_node(names_obj[origin_node]["locator"], metadata);
        ajax_save_node(origin_node, metadata);
}

function init_splitters(source_unit_location_name){

    $('#input-splitter option').remove();

    $.each(splitters, function( index, value ) {
        if(value.parent_id == source_unit_location_name || value.parent_id == ""){
            $('#input-splitter').append('<option value="'+value.id+'">'+value.title+'</option>');
        }
    });

};

function init_options(splitter_id){

    $('#input-option option').remove();

    $.each(options, function( index, value ) {
        if(value.parent_id == splitter_id){
           $('#input-option').append('<option parent="'+value.parent_id+'"  value="'+value.id+'">'+value.title+'</option>');
        };
    })

    if (splitter_id == "score_rel" || splitter_id == "score_abs"){

        $("#input-value").css("display","inline-block").removeClass("hidden");

    } else {

        $("#input-value").css("display","none").addClass("hidden");

    };

};


function bindNewEdgeTo(ellipse, node){

        init_splitters(source_unit_location_name);
        init_options($("#input-splitter").val());

        $("#input-splitter").change(function(){
            var splitter_id = $(this).val();
            init_options(splitter_id);
        });

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
                    if( !$.isNumeric($("#input-value").val()) && !$("#input-value").hasClass("hidden")) return;


                    var new_edge_data = {"direct_unit" : node.id,
                        "disjunctions" : [{
                                "conjunctions" : [{
                                    "source_unit" : origin_node,
                                    "splitter" : $("#input-splitter").val(),
                                    "option" :  $("#input-option").val(),
                                    "value" :  $("#input-value").val()
                                }]
                        }]
                    }

                    create_new_edge(origin_node, node.id, new_edge_data);

                    //save_layout();
                    //load_layout();
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

        //condition["source_element_id"] is wrong

        if (condition["source_unit"] === source) {
            related_vertex_name = "";
            about_source = true;
        } else {
            related_vertex_name = $.grep(names_obj, function(e){ return e.locator == condition["source_unit"]; })[0]["name"];

        }

        var splitter = $.grep(splitters, function(e){ return e.id == condition["splitter"]})[0]["title"];
        var option = $.grep(options, function(e){ return e.id == condition["option"]; })[0]["title"];

        var percent_sign = (condition["splitter"] === "score_rel")? "%" : "";

        var target_value = "";
        if (condition["splitter"] === "score_rel" || condition["splitter"] === "score_abs"){
            target_value = condition["value"];
        }

        details = related_vertex_name + " " + splitter + ": " + option + " " + target_value + percent_sign;

        if (!about_source){
            color = "#008";
        } else if (target_value === "0"){
            // green for correct answer
            if (condition["option"]==="more") color = "#0F0";
            // red for incorrect
            if (condition["option"]==="equals") color = "#F00";
            // purple for "I don't care, really"
            if (condition["option"]==="more-equals") color = "#808";
        }
    }
    var edge_label = "";
    var full_related_vertex_name = "";
    if (!is_complicated){
        full_related_vertex_name = $.grep(names_obj, function(e){ return e.locator == condition["source_unit"] })[0]["name"];
    }
    var result = {"label" : edge_label, "color" : color, "details" : details,
                "description" : {
                    "is_complicated" : is_complicated,
                    "related_vertex_name": full_related_vertex_name,
                    "option" : option,
                    "value" : target_value,
                    "percent" : percent_sign
                    }
                 };
    return result;
}

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
                var target_id = edge.direct_unit;


                if (!is_edge_exists(source_id, target_id)){
                    alert("Такого ребра не существует!");
                    return;
                }

                edges_arr[source_node_number].splice(edge_number, 1);

                g.removeEdge(source_id, target_id);

                var metadata = {};
                metadata.display_name = $.grep(names_obj, function(e){ return e.locator == source_id })[0]["name"];
                var locator_term = edges_arr[source_node_number];

                metadata.locator_term = JSON.stringify(edges_arr[source_node_number]);
                //metadata.direct_term = JSON.stringify(edges_arr[origin_node_number]);

                $(".graph_string").html(JSON.stringify(edges_arr));
                //ajax_save_node(names_obj[origin_node]["locator"], metadata);
                ajax_save_node(source_id, metadata);

                $("." + string_id).hide();   //css( "display", "none" );
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
        $("#node-rename-input").val($.grep(names_obj, function(e){ return e.locator == node.id })[0]["name"]);

        $( "#rename-node" ).dialog({
              modal: true,
              buttons: {
                Ok: function() {

                    // TODO: make a function about metadata or something

                    var node_name = $("#node-rename-input").val();
                    $.grep(names_obj, function(e){ return e.locator == node.id })[0]["name"] = node_name;

                    var metadata = {};
                    metadata.display_name = node_name;

                    var locator_term = $.grep(names_obj, function(e){ return e.locator == node.id })[0]["locator"];
                    ajax_save_node(locator_term, metadata);

                    renderer.renameNode(node, node_name);
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
    $.each(data_obj[node.id], function(number) {
        if (data_obj[node.id][number].type != undefined){
            S = "";
            if (data_obj[node.id][number].name!="") S += data_obj[node.id][number].name + " : ";
            S += parseType(data_obj[node.id][number].type);
            $( "#node-content").append("<p class=\"node-data\">" + S + "</p>");
    //                            $( "#node-details").append("<p>" + parse_type(data_obj[node.id][number].type) + " - " + data_obj[node.id][number].url +  "</p>");
        }
    });
    $(".node-name").text($.grep(names_obj, function(e){ return e.locator == node.id })[0]["name"]);

    var renamer = createNodeRenameCallback(node);

    $(".node-name").unbind( "click");
    $(".node-name").bind( "click", renamer );

    $(".node-edit-link").attr("href", "/unit/" + $.grep(names_obj, function(e){ return e.locator == node.id })[0]["locator"]);

    /*
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
        */
        var node_number = ids_arr.indexOf(node.id);
        for(var i=0; i<edges_arr[node_number].length; i++) {
//            var e = g.nodes[node.id].edges[i];
//            if (e.source.id == node.id){
            var edge = edges_arr[node_number][i];
            var target_id = edge.direct_unit;

            var string_id = "node-edges-" + i;
            var img_id = "delete-" + string_id;
//            alert(img_id);
            S = $.grep(names_obj, function(e){ return e.locator == target_id })[0]["name"];
            var text_description = "Сложное условие";

            var data = generateEdgeData(edge.disjunctions, node.id).description;
            text_description = "Если набрать в " + data.related_vertex_name + " " + data.sign + " " + data.value + data.percent;


            // TODO:
            // make a normal function generating this string

            var img_src = $("#Delete-icon-base").attr("src");
            $( "#node-edges-list").append(
                "<p class=\"node-data " + string_id + "\" title=\"" + text_description + "\">"
//                + "<img class = \"close\" src = \"/static/img/Delete-icon.png\" data-bind='click: $root.removeDisjunction'/>"
                + "<img class = \"close " + string_id + "\" src = \"" + img_src + "\" id = \"" + img_id + "\"/>"
                + S + "</p>"
            );

//            var handler = createEdgeDeletionCallback(edge, node.id);
            var handler = createEdgeDeletionCallback(node_number, i, string_id);

            $( "#" + img_id ).unbind( "click");
            $( "#" + img_id ).bind( "click", handler );
            /*
            $( "#node-edges-list").append(
                "<p class=\"node-data " + string_id + "\" title=\"" + text_description + "\">"
                + S + "</p>"
            );
            */

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
                source_unit_location_name = node.location_name;
                source_unit = node.id;

                $( this ).dialog( "close" );
            }
          }
    });
}
