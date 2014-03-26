/**
 * Created by bt on 11.03.14.
 */
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


