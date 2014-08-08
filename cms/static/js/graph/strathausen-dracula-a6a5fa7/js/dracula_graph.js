/*
 *  Dracula Graph Layout and Drawing Framework 0.0.3alpha
 *  (c) 2010 Philipp Strathausen <strathausen@gmail.com>, http://strathausen.eu
 *  Contributions by Jake Stothard <stothardj@gmail.com>.
 *
 *  based on the Graph JavaScript framework, version 0.0.1
 *  (c) 2006 Aslak Hellesoy <aslak.hellesoy@gmail.com>
 *  (c) 2006 Dave Hoover <dave.hoover@gmail.com>
 *
 *  Ported from Graph::Layouter::Spring in
 *    http://search.cpan.org/~pasky/Graph-Layderer-0.02/
 *  The algorithm is based on a spring-style layouter of a Java-based social
 *  network tracker PieSpy written by Paul Mutton <paul@jibble.org>.
 *
 *  This code is freely distributable under the MIT license. Commercial use is
 *  hereby granted without any cost or restriction.
 *
 *  Links:
 *
 *  Graph Dracula JavaScript Framework:
 *      http://graphdracula.net
 *
 /*--------------------------------------------------------------------------*/

var HOVER_AREA_OPACITY = 0.0;
/*
 * Edge Factory
 */
var AbstractEdge = function() {
}
AbstractEdge.prototype = {
    hide: function() {
        this.connection.fg.hide();
        this.connection.bg && this.bg.connection.hide();
        this.hover_area.hide();
    }
};
var EdgeFactory = function() {
    this.template = new AbstractEdge();
    this.template.style = new Object();
    this.template.style.directed = false;
    this.template.weight = 1;
};
EdgeFactory.prototype = {
    build: function(source, target) {
        return this.build(source, target, "#F0F", "это\nребро\n");
    },

    build: function(source, target, color, details) {
        if (color === undefined) color = "#FOF";
        var e = jQuery.extend(true, {}, this.template);
        e.hover_area = undefined;
        e.source = source;
        e.target = target;
        e.color = color;
        e.details = details;
        return e;
    }
};
/*
 * Graph
 */
var Graph = function() {
    this.nodes = {};
    this.edges = [];
    this.snapshots = []; // previous graph states TODO to be implemented
    this.edgeFactory = new EdgeFactory();
};
Graph.prototype = {
    /* 
     * add a node
     * @id          the node's ID (string or number)
     * @content     (optional, dictionary) can contain any information that is
     *              being interpreted by the layout algorithm or the graph
     *              representation
     */
    addNode: function(id, content) {
        /* testing if node is already existing in the graph */
        if(this.nodes[id] == undefined) {
            this.nodes[id] = new Graph.Node(id, content);
        }
        return this.nodes[id];
    },

    addEdge: function(source, target, style) {
        var s = this.addNode(source);
        var t = this.addNode(target);
        var edge = this.edgeFactory.build(s, t, style.stroke, style.details);
        jQuery.extend(edge.style,style);
        s.edges.push(edge);
        this.edges.push(edge);
        // NOTE: Even directed edges are added to both nodes.
        t.edges.push(edge);
    },
    
    /* TODO to be implemented
     * Preserve a copy of the graph state (nodes, positions, ...)
     * @comment     a comment describing the state
     */
    snapShot: function(comment) {
        /* FIXME
        var graph = new Graph();
        graph.nodes = jQuery.extend(true, {}, this.nodes);
        graph.edges = jQuery.extend(true, {}, this.edges);
        this.snapshots.push({comment: comment, graph: graph});
        */
    },
    removeNode: function(id) {
        this.nodes[id].hide()
        delete this.nodes[id];
        for(var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].source.id == id || this.edges[i].target.id == id) {
                this.edges.splice(i, 1);
                i--;
            }
        }
    },

    removeEdge: function(source_id, target_id){
        for(var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].source.id == source_id && this.edges[i].target.id == target_id) {
                this.edges[i].hide();
                this.edges.splice(i, 1);
                i--;
            }
        }
    }

};

/*
 * Node
 */
Graph.Node = function(id, node){
    node = node || {};
    node.id = id;
    node.edges = [];
    node.hide = function() {
        this.hidden = true;
        this.shape && this.shape.hide(); /* FIXME this is representation specific code and should be elsewhere */
        for(i in this.edges)
            (this.edges[i].source.id == id || this.edges[i].target == id) && this.edges[i].hide && this.edges[i].hide();
    };
    node.show = function() {
        this.hidden = false;
        this.shape && this.shape.show();
        for(i in this.edges)
            (this.edges[i].source.id == id || this.edges[i].target == id) && this.edges[i].show && this.edges[i].show();
    };
    return node;
};
Graph.Node.prototype = {
};

/*
 * Renderer base class
 */
Graph.Renderer = {};

/*
 * Renderer implementation using RaphaelJS
 */
Graph.Renderer.Raphael = function(element, graph, width, height) {
    this.width = width || 400;
    this.height = height || 400;
    var selfRef = this;
    this.r = Raphael(element, this.width, this.height);
    this.radius = 40; /* max dimension of a node */
    this.graph = graph;
    this.mouse_in = false;
    this.draging_mode = false;

    /* TODO default node rendering function */
    if(!this.graph.render) {
        this.graph.render = function() {
            return;
        }
    }
    
    /*
     * Dragging
     */
    this.isDrag = false;
    this.dragger = function (e) {
        this.dx = e.clientX;
        this.dy = e.clientY;
        selfRef.isDrag = this;
        this.set && this.set.animate({"fill-opacity": .1}, 200) && this.set.toFront();
        e.preventDefault && e.preventDefault();
    };

    var d = document.getElementById(element);
    d.onmousemove = function (e) {
        e = e || window.event;

        // mouse_x

        if (selfRef.isDrag) {
            var bBox = selfRef.isDrag.set.getBBox();
            // TODO round the coordinates here (eg. for proper image representation)
            var newX = e.clientX - selfRef.isDrag.dx + (bBox.x + bBox.width / 2);
            var newY = e.clientY - selfRef.isDrag.dy + (bBox.y + bBox.height / 2);
            /* prevent shapes from being dragged out of the canvas */
            var clientX = e.clientX - (newX < 20 ? newX - 20 : newX > selfRef.width - 20 ? newX - selfRef.width + 20 : 0);
            var clientY = e.clientY - (newY < 20 ? newY - 20 : newY > selfRef.height - 20 ? newY - selfRef.height + 20 : 0);
            selfRef.isDrag.set.translate(clientX - Math.round(selfRef.isDrag.dx), clientY - Math.round(selfRef.isDrag.dy));

            selfRef.isDrag.set.name_popup.translate(clientX - Math.round(selfRef.isDrag.dx), clientY - Math.round(selfRef.isDrag.dy));

            //console.log(Math.round(selfRef.isDrag.dx), Math.round(selfRef.isDrag.dy));
            for (var i in selfRef.graph.edges) {
                selfRef.graph.edges[i].connection && selfRef.graph.edges[i].connection.draw();
            }
            //selfRef.r.safari();
            selfRef.isDrag.dx = clientX;
            selfRef.isDrag.dy = clientY;
        }
    };
    d.onmouseup = function () {
        //selfRef.isDrag && selfRef.isDrag.set.animate({"fill-opacity": .6}, 500);
        selfRef.isDrag && selfRef.isDrag.set.forEach(function(x){
//            if (x.type == "set") x.animate({"fill-opacity": .9}, 500)
//                else x.animate({"fill-opacity": .6}, 500)
                x.animate({"fill-opacity": .6}, 500)
        })
        selfRef.isDrag = false;
        update_hover_area(selfRef);
    };


    this.draw();
};

function update_hover_area(selfRef){
    for (var i in selfRef.graph.edges) {
        if(selfRef.graph.edges[i].hover_area !=undefined){
            selfRef.graph.edges[i].hover_area.remove();
        }
        selfRef.graph.edges[i].hover_area = initialize_hover_area(selfRef, selfRef.graph.edges[i]);
    }
    for (i in selfRef.graph.nodes) {
        selfRef.graph.nodes[i].shape.toFront();
    }

};


var popup;
function initialize_hover_area(selfRef, edge){
    var connection = edge.connection.fg;
    var result = connection.clone();
//    console.log(selfRef.getCanvas());

    result.attr({"stroke-width": 20, "stroke-opacity" : HOVER_AREA_OPACITY, "stroke": "#F00"});
    //result.insertBefore(selfRef.graph.nodes)
    //result.toBack();

    result.hover(
        function(){
            connection.attr({"stroke": "#000"});
    //            console.log(popup);
              // XXX ?
              if (popup != undefined && popup.removed != true){
                popup.hide();
                popup.remove();
              }
              popup = selfRef.r.popup(mouse_x, mouse_y, edge.details);
              popup.show();

        },function(){
            connection.attr({"stroke": edge.color});
            popup.hide();
    //          popup.remove();
    })


    return result;
};


Graph.Renderer.Raphael.prototype = {
    translate: function(point) {
        return [
            (point[0] - this.graph.layoutMinX) * this.factorX + this.radius,
            (point[1] - this.graph.layoutMinY) * this.factorY + this.radius
            //(point[0]) * this.factorX + this.radius,
            //(point[1]) * this.factorY + this.radius
        ];
    },

    translate2: function(point) {
        return [
            point[0],
            point[1]
            //(point[0]) * this.factorX + this.radius,
            //(point[1]) * this.factorY + this.radius
        ];
    },

    rotate: function(point, length, angle) {
        var dx = length * Math.cos(angle);
        var dy = length * Math.sin(angle);
        return [point[0]+dx, point[1]+dy];
    },

    draw: function() {
        this.factorX = (this.width - 2 * this.radius) / (this.graph.layoutMaxX - this.graph.layoutMinX);
        this.factorY = (this.height - 2 * this.radius) / (this.graph.layoutMaxY - this.graph.layoutMinY);
        this.stretch()
        //this.factorX = (this.width - 2 * this.radius) / (1.1);
        //this.factorY = (this.height - 2 * this.radius) / (1.1);
        for (i in this.graph.nodes) {
            this.drawNode(this.graph.nodes[i]);
        }
        for (var i = 0; i < this.graph.edges.length; i++) {
            this.drawEdge(this.graph.edges[i]);
        }
        update_hover_area(this);
    },

    stretch: function() {
        // TODO: will it work when number of nodes is one?
        var width = this.graph.layoutMaxX - this.graph.layoutMinX;
        var height = this.graph.layoutMaxY - this.graph.layoutMinY;
        if ((Object.keys(this.graph.nodes).length == 1)){
            for (i in this.graph.nodes) {
                var node = this.graph.nodes[i];
                node.layoutPosX = this.radius;
                node.layoutPosY = this.radius;
            }
        } else if ((width < this.radius)||((height < this.radius))){
            for (i in this.graph.nodes) {
                var node = this.graph.nodes[i];
                node.layoutPosX -= this.graph.layoutMinX;
                node.layoutPosX *= this.factorX;

                node.layoutPosY -= this.graph.layoutMinY;
                node.layoutPosY *= this.factorY;

                if (node.layoutPosY == 0) node.layoutPosY = this.radius;
                if (node.layoutPosX == 0) node.layoutPosX = this.radius;
            }
        }
    },

    renameNode: function(node, name) {
        // change vertex text
        node.shape[1].attr({text: hideRestOfString(name)});

        //shape.name_popup
        //node.shape[2][1].attr({text: name});
        node.shape.name_popup.remove();
        var box = node.shape[0].getBBox()
        node.shape.name_popup = this.r.popup(box.x + box.width, box.y, name);
        /*
        var box = node.shape[0].getBBox()
        node.shape[2].remove();
        node.shape[2] = this.r.popup(box.x + box.width, box.y, name);
        */
        //    [1].attr({text: node_name});
        //node.shape[2][0].attr({text: node_name});
    },

    drawNode: function(node) {

        //var point = this.translate([node.layoutPosX*0.5 + 0.25, node.layoutPosY*0.5 + 0.25]);

        // кажется, translate используется только здесь!!
        //var point = this.translate([node.layoutPosX, node.layoutPosY]);

        var point = this.translate2([node.layoutPosX, node.layoutPosY]);
        node.point = point;

        /* if node has already been drawn, move the nodes */
        if(node.shape) {


            // TODO: more convenient way to retrieve node_form from set.
            var oBBox = node.shape[0].getBBox();

            /*
            var coords = oBBox;

            var rect = this.r.rect(coords.x, coords.y, coords.width, coords.height)
                            .attr({fill: "none", stroke: "#aaaaaa", "stroke-width": 1});
            */
            var opoint = { x: oBBox.x + oBBox.width / 2, y: oBBox.y + oBBox.height / 2};
            node.shape.translate(Math.round(point[0] - opoint.x), Math.round(point[1] - opoint.y));

            node.shape.name_popup.translate(Math.round(point[0] - opoint.x), Math.round(point[1] - opoint.y));

            this.r.safari();
            return node;
        }/* else, draw new nodes */

        var shape;

        /* if a node renderer function is provided by the user, then use it 
           or the default render function instead */
        if(!node.render) {
            node.render = function(r, node) {
                /* the default node drawing */
                var color = Raphael.getColor();
                var ellipse = r.ellipse(0, 0, 30, 20).attr({fill: color, stroke: color, "stroke-width": 2});
                /* set DOM node ID */
                ellipse.node.id = node.label || node.id;
                shape = r.set().
                    push(ellipse).
                    push(r.text(0, 30, node.label || node.id));
                return shape;
            }
        }
        /* or check for an ajax representation of the nodes */
        if(node.shapes) {
            // TODO ajax representation evaluation
        }

        shape = node.render(this.r, node).hide();
        shape.name_popup.hide()

        shape.attr({"fill-opacity": .6});
        /* re-reference to the node an element belongs to, needed for dragging all elements of a node */
        shape.items.forEach(function(item){
            item.set = shape;

            // TODO if {exist}...
            if (item.node != undefined){
                item.node.style.cursor = "pointer";
            }
            //if (!node.hidden && item.type != "set"){
            if (!node.hidden){
                item.show()
            }
        });
//        shape.mousedown(this.dragger);

        // XXX
        // TODO: black magic is happening here.

        var box = shape.getBBox();
        var node_form_box = shape[0].getBBox();
        //var box = shape[0].getBBox();
        shape.translate(Math.round(point[0]-(box.x+box.width/2)),Math.round(point[1]-(box.y+node_form_box.height/2)))
        shape.name_popup.translate(Math.round(point[0]-(box.x+box.width/2)),Math.round(point[1]-(box.y+node_form_box.height/2)))
        node.shape = shape;

    },
    drawEdge: function(edge) {
        /* if this edge already exists the other way around and is undirected */
        if(edge.backedge)
            return;
        if(edge.source.hidden || edge.target.hidden) {
            edge.connection && edge.connection.fg.hide() | edge.connection.bg && edge.connection.bg.hide();
            return;
        }
        /* if edge already has been drawn, only refresh the edge */
        if(!edge.connection) {
            edge.style && edge.style.callback && edge.style.callback(edge); // TODO move this somewhere else
            edge.connection = this.r.connection(edge.source.shape, edge.target.shape, edge.style);

            edge.connection.fg.attr({"stroke-width": 2});
            // hover area
            edge.hover_area = initialize_hover_area(this, edge);
            return;
        }
        //FIXME showing doesn't work well
        edge.connection.fg.show();
        edge.connection.bg && edge.connection.bg.show();
        edge.connection.draw();

    },
    getDragingMode: function(){
        return this.draging_mode;
    },

    makeDraggable: function(id){
        var shape = this.graph.nodes[id].shape;
        shape.mousedown(this.dragger);
        shape.items.forEach(function(item){
            // TODO if {exist}...
            if (item.node != undefined){
                item.node.style.cursor = "move";
            }
        });
    },

    enableDragingMode: function(){
//        console.log(this.draging_mode);
        //if (this.draging_mode) return;
        this.draging_mode = true;
        for (var id in this.graph.nodes) {
            this.makeDraggable(id)
        }
    },
    disableDragingMode: function(){
        if (!this.draging_mode) return;
        this.draging_mode = false;
        for (var i in this.graph.nodes) {
            var shape = this.graph.nodes[i].shape;
            shape.unmousedown(this.dragger);
            shape.items.forEach(function(item){
                item.node.style.cursor = "pointer";
            });
        }
    },
    getCanvas: function() {
        return this.r;
    }
};
Graph.Layout = {};
Graph.Layout.Spring = function(graph) {
    this.graph = graph;
    this.iterations = 500;
    this.maxRepulsiveForceDistance = 6;
    this.k = 2;
    this.c = 0.01;
    this.maxVertexMovement = 0.5;
    this.layout();
};
Graph.Layout.Spring.prototype = {
    layout: function() {
        this.layoutPrepare();
        for (var i = 0; i < this.iterations; i++) {
            this.layoutIteration();
        }
        this.layoutCalcBounds();
    },
    
    layoutPrepare: function() {
        for (i in this.graph.nodes) {
            var node = this.graph.nodes[i];
            node.layoutPosX = 0;
            node.layoutPosY = 0;
            node.layoutForceX = 0;
            node.layoutForceY = 0;
        }
        
    },
    
    layoutCalcBounds: function() {
        var b = calcBounds(this.graph.nodes)
        this.graph.layoutMinX = b.minx;
        this.graph.layoutMaxX = b.maxx;

        this.graph.layoutMinY = b.miny;
        this.graph.layoutMaxY = b.maxy;
    },

    layoutIteration: function() {
        // Forces on nodes due to node-node repulsions

        var prev = new Array();
        for(var c in this.graph.nodes) {
            var node1 = this.graph.nodes[c];
            for (var d in prev) {
                var node2 = this.graph.nodes[prev[d]];
                this.layoutRepulsive(node2, node1);
                
            }
            prev.push(c);
        }
        
        // Forces on nodes due to edge attractions
        for (var i = 0; i < this.graph.edges.length; i++) {
            var edge = this.graph.edges[i];
            this.layoutAttractive(edge);             
        }
        
        // Move by the given force

//        for (var i = this.graph.nodes.length - 1; i >= 0; i--) {

//        for (var i = 0; i < this.graph.nodes.length; i++) {
        for (i in this.graph.nodes) {
            var node = this.graph.nodes[i];

            var xmove = this.c * node.layoutForceX;
            var ymove = this.c * node.layoutForceY;

            var max = this.maxVertexMovement;
            if(xmove > max) xmove = max;
            if(xmove < -max) xmove = -max;
            if(ymove > max) ymove = max;
            if(ymove < -max) ymove = -max;
            
            node.layoutPosX += xmove;
            node.layoutPosY += ymove;
            node.layoutForceX = 0;
            node.layoutForceY = 0;
        }
    },

    layoutRepulsive: function(node1, node2) {
        if (typeof node1 == 'undefined' || typeof node2 == 'undefined')
            return;
        var dx = node2.layoutPosX - node1.layoutPosX;
        var dy = node2.layoutPosY - node1.layoutPosY;
        var d2 = dx * dx + dy * dy;
        if(d2 < 0.01) {
            dx = 0.1 * Math.random() + 0.1;
            dy = 0.1 * Math.random() + 0.1;
            var d2 = dx * dx + dy * dy;
        }
        var d = Math.sqrt(d2);
        if(d < this.maxRepulsiveForceDistance) {
            var repulsiveForce = this.k * this.k / d;
            node2.layoutForceX += repulsiveForce * dx / d;
            node2.layoutForceY += repulsiveForce * dy / d;
            node1.layoutForceX -= repulsiveForce * dx / d;
            node1.layoutForceY -= repulsiveForce * dy / d;
        }
    },

    layoutAttractive: function(edge) {
        var node1 = edge.source;
        var node2 = edge.target;
        
        var dx = node2.layoutPosX - node1.layoutPosX;
        var dy = node2.layoutPosY - node1.layoutPosY;
        var d2 = dx * dx + dy * dy;
        if(d2 < 0.01) {
            dx = 0.1 * Math.random() + 0.1;
            dy = 0.1 * Math.random() + 0.1;
            var d2 = dx * dx + dy * dy;
        }
        var d = Math.sqrt(d2);
        if(d > this.maxRepulsiveForceDistance) {
            d = this.maxRepulsiveForceDistance;
            d2 = d * d;
        }
        var attractiveForce = (d2 - this.k * this.k) / this.k;
        if(edge.attraction == undefined) edge.attraction = 1;
        attractiveForce *= Math.log(edge.attraction) * 0.5 + 1;
        
        node2.layoutForceX -= attractiveForce * dx / d;
        node2.layoutForceY -= attractiveForce * dy / d;
        node1.layoutForceX += attractiveForce * dx / d;
        node1.layoutForceY += attractiveForce * dy / d;
    }
};

Graph.Layout.Ordered = function(graph, order) {
    this.graph = graph;
    this.order = order;
    this.layout();
};
Graph.Layout.Ordered.prototype = {
    layout: function() {
        this.layoutPrepare();
        this.layoutCalcBounds();
    },
    
    layoutPrepare: function(order) {
        for (i in this.graph.nodes) {
            var node = this.graph.nodes[i];
            node.layoutPosX = 0;
            node.layoutPosY = 0;
        }
            var counter = 0;
            for (var i in this.order) {
                var node = this.order[i];
                node.layoutPosX = counter;
                node.layoutPosY = Math.random();
                counter++;
            }
    },
    
    layoutCalcBounds: function() {
        var b = calcBounds(this.graph.nodes)
        this.graph.layoutMinX = b.minx;
        this.graph.layoutMaxX = b.maxx;

        this.graph.layoutMinY = b.miny;
        this.graph.layoutMaxY = b.maxy;
    }
};


Graph.Layout.Saved = function(graph, x, y) {
    this.graph = graph;
    this.x = x;
    this.y = y;
    this.layout();
};
Graph.Layout.Saved.prototype = {
    layout: function() {
        this.layoutPrepare();
        this.layoutCalcBounds();
    },

    layoutPrepare: function() {
        var counter = 0;

        /*
        this.graph.layoutMinX = this.b.minx;
        this.graph.layoutMaxX = this.b.maxx;

        this.graph.layoutMinY = this.b.miny;
        this.graph.layoutMaxY = this.b.maxy;
        */
        for (var i in this.graph.nodes) {
            var node = this.graph.nodes[i];
            node.layoutPosX = this.x[counter];
            node.layoutPosY = this.y[counter];
            counter++;
        }
    },

    layoutCalcBounds: function() {
        var b = calcBounds(this.graph.nodes)
        this.graph.layoutMinX = b.minx;
        this.graph.layoutMaxX = b.maxx;

        this.graph.layoutMinY = b.miny;
        this.graph.layoutMaxY = b.maxy;
        //console.log(b);
        /*
        this.graph.layoutMinX = 0//0.0804416403785;
        this.graph.layoutMaxX = 1//0.856466876972;

        this.graph.layoutMinY = 0//0.262857142857;
        this.graph.layoutMaxY = 1//0.808571428571;
        */

    }
};


/*
 * useful JavaScript extensions,
 */

function log(a) {console.log&&console.log(a);}


function calcBounds(nodes) {
    var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;

    for (i in nodes) {
        var x = Number(nodes[i].layoutPosX);
        var y = Number(nodes[i].layoutPosY);

        //console.log("minX = " + minx + " curX = " + x);

        if(x > maxx) maxx = x;
        if(x < minx) minx = x;
        if(y > maxy) maxy = y;
        if(y < miny) miny = y;
    }
    var bounds = {"minx" : minx, "miny" : miny, "maxx" : maxx, "maxy" : maxy};
    return bounds;
}
/*
 * Raphael Tooltip Plugin
 * - attaches an element as a tooltip to another element
 *
 * Usage example, adding a rectangle as a tooltip to a circle:
 *
 *      paper.circle(100,100,10).tooltip(paper.rect(0,0,20,30));
 *
 * If you want to use more shapes, you'll have to put them into a set.
 *
 */
Raphael.el.tooltip = function (tp) {
    this.tp = tp;
    this.tp.o = {x: 0, y: 0};
    this.tp.hide();
    this.hover(
        function(event){ 
            this.mousemove(function(event){ 
                this.tp.translate(event.clientX - 
                                  this.tp.o.x,event.clientY - this.tp.o.y);
                this.tp.o = {x: event.clientX, y: event.clientY};
            });
            this.tp.show().toFront();
        }, 
        function(event){
            this.tp.hide();
            this.unmousemove();
        });
    return this;
};

/* For IE */
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}
