/**
 * Created by bt on 11.03.14.
 */

    function customRenderFunction (r, node) {
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

                //color = Raphael.getColor();
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
                var node_box = node_form.getBBox();
                var node_popup = r.popup(node_box.x + node_box.width, node_box.y, names_obj[node.id]["name"]);

                var show_details = function(){
                    if (!add_edge_mode) showNodeDetails(node);
                }

                /* set DOM node ID */
                node_form.node.id = "node_" + node.id;
//                ellipse.node.ondblclick = show_details;

                var shape = r.set().
                    push(node_form).
                    push(vertex_text).
                    push(node_popup);

                var renamer = createNodeRenameCallback(node);

                node_form.node.ondblclick = function(){
                    show_details();
                }
                node_form.node.onclick = function(){
                    if (add_edge_mode) bindNewEdgeTo(node_form, node)
                };
                vertex_text.node.onclick = function(){
                    if (add_edge_mode) bindNewEdgeTo(node_form, node);
                        else renamer();
                };


                shape.hover(function(){
                    node_form.animate({"fill": Raphael.getColor()}, 200);
                    node_popup.attr({"fill-opacity": .9});
                    node_popup.show()
                },function(){
                    node_form.animate({"fill": color}, 200);
                    node_popup.hide()
                });


                // TODO
                // FIXME
                // why do I need this array??
                raphael_nodes[node.id] = node_form;

                return shape;
    };
