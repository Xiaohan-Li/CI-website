(function () {
    document.addEventListener('DOMContentLoaded', function () {

        /** Utility functions **/
        let $ = selector => document.querySelector(selector);  // to select HTML elements

        let resizeCanvas = () => {    // get current browser window size, and fit canvas size to it
            let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            let canvasHeight = '600px'   // minimum height (800px)
            let canvasWidth = '800px'    // minimum width (1150px)
            if (h > 600) {
                canvasHeight = h + 'px'
            }
            if (w - 160 > 800) {
                canvasWidth = (w - 160) + 'px'
            }
            // console.log('canvasHeight: ', canvasHeight)
            // console.log('canvasWidth: ', canvasWidth)
            $('#canvasWithMenu').style.height = canvasHeight
            $('#canvasWithMenu').style.width = canvasWidth
        }
        resizeCanvas()

        let data = {
            nodes: [],
            edges: []
        }

        let newdata;
        sigma.classes.graph.addMethod('neighbors', function(nodeId) {
               var k,
               neighbors = {},
               index = this.allNeighborsIndex[nodeId] || {};

             for (k in index)
                    neighbors[k] = this.nodesIndex[k];
                    return neighbors;
       });

        let sigmajs = new sigma({
            graph: data,
            container: 'cy',
            renderer: {
                id: 'main',
                type: 'canvas',
                container: document.getElementById('cy'),
                // freeStyle: true,
                settings: {
                    batchEdgesDrawing: true,
                }
            },
            settings: {
                doubleClickEnabled: true,
                autoRescale: true,
                mouseEnabled: true,
                touchEnabled: true,
                nodesPowRatio: 1,
                edgesPowRatio: 1,
                defaultEdgeColor: '#333',
                defaultNodeColor: '#333',
                edgeColor: 'default',
                enableEdgeHovering: true,
                edgeHoverColor: 'edge',
                defaultEdgeHoverColor: '#000',
                edgeHoverSizeRatio: 1,
                edgeHoverExtremities: true,
            }

        });

        sigma.utils.pkg('sigma.canvas.nodes');
        sigma.canvas.nodes.image = (function() {
  var _cache = {},
      _loading = {},
      _callbacks = {};

  // Return the renderer itself:
  var renderer = function(node, context, settings) {
    var args = arguments,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'],
        color = node.color || settings('defaultNodeColor'),
        url = node.url;

    if (_cache[url]) {
      context.save();

      // Draw the clipping disc:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.closePath();
      context.clip();

      // Draw the image
      context.drawImage(
        _cache[url],
        node[prefix + 'x'] - size,
        node[prefix + 'y'] - size,
        2 * size,
        2 * size
      );

      // Quit the "clipping mode":
      context.restore();

      // Draw the border:
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );
      context.lineWidth = size / 5;
      context.strokeStyle = node.color || settings('defaultNodeColor');
      context.stroke();
    } else {
      sigma.canvas.nodes.image.cache(url);
      sigma.canvas.nodes.def.apply(
        sigma.canvas.nodes,
        args
      );
    }
  };

  // Let's add a public method to cache images, to make it possible to
  // preload images before the initial rendering:
  renderer.cache = function(url, callback) {
    if (callback)
      _callbacks[url] = callback;

    if (_loading[url])
      return;

    var img = new Image();

    img.onload = function() {
      _loading[url] = false;
      _cache[url] = img;

      if (_callbacks[url]) {
        _callbacks[url].call(this, img);
        delete _callbacks[url];
      }
    };

    _loading[url] = true;
    img.src = url;
  };

  return renderer;
})();

           let imgurls = [
            'img/img1.png',
            'img/img2.png',
            'img/img3.png',
            'img/img4.png',
            'img/img5.jpg',
               'img/img6.png',
        ]

        /** Handling of the popup modal windows **/
        $("#modal1").style.display = "block";  // Display the modal

        // When the user clicks on <span> (x), close the modal
        $("#close1").addEventListener('click', function () {
            $("#modal1").style.display = "none"
        });
        $("#modal1").addEventListener('click', function () {
            $("#modal1").style.display = "none"
        });

        // When the user clicks anywhere outside of modal1, close it
        window.onclick = function (event) {
            if (event.target == $("#modal1")) {
                $("#modal1").style.display = "none";
            }
        }

        // Close graph popup info box, when user double-clicks on it
        $("#graph-popup1-close").addEventListener('click', function () {
            $("#graph-popup1").style.display = "none"
        });
        $("#graph-popup1").addEventListener('dblclick', function () {
            $("#graph-popup1").style.display = "none"
        });


        /* Make the popup info box draggable */

        dragElement(document.getElementById("graph-popup1"), document.getElementById("graph-popup1-pin"));

        function dragElement(elmnt, pinElmnt) {

            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            elmnt.onmousedown = dragMouseDown;
            elmnt.ontouchstart = dragMouseDown;  // for touch screens

            // The pin element toggles the draggable function on and off
            pinElmnt.onclick = toggle;

            // pinElmnt.ontouchstart = toggle;

            function toggle() {
                if (elmnt.onmousedown != null) {
                    elmnt.onmousedown = null;
                    elmnt.ontouchstart == null
                } else {
                    elmnt.onmousedown = dragMouseDown;
                    elmnt.ontouchstart = dragMouseDown;  // for touch screens
                }
            }

            function dragMouseDown(e) {
                e = e || window.event;
                // e.preventDefault();

                if ((e.clientX) && (e.clientY)) {
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag_mouse;

                } else if (e.targetTouches) {
                    pos3 = e.targetTouches[0].clientX;
                    pos4 = e.targetTouches[0].clientY;
                    document.ontouchend = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.ontouchmove = elementDrag_touch;
                }
            }

            function elementDrag_mouse(e) {
                e = e || window.event;
                // e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function elementDrag_touch(e) {
                e = e || window.event;
                // e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.targetTouches[0].clientX;
                pos2 = pos4 - e.targetTouches[0].clientY;
                pos3 = e.targetTouches[0].clientX;
                pos4 = e.targetTouches[0].clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
                document.ontouchend = null;
                document.ontouchmove = null;
            }
        }


        /** Fetch list of songs in the database, and construct drop-down menu **/
        fetch('https://chriskhoo.net/ZS/3/_')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Server API didn't respond")
                }
                return response.json()
            })
            .then(records => {

                // construct drop-down menu
                let txt = '<option value="Majulah_Singapura-Work">Select song</option>'
                // display records in table rows
                for (x in records) {
                    txt += `<option value="${records[x]._fields[0].properties.id}">${records[x]._fields[0].properties.label}</option>`
                }

                // Display drop-down menu
                document.getElementById("music").innerHTML = txt;
                // document.getElementById("letters").innerHTML = txt;
                // document.getElementById("commentary").innerHTML = txt;

            })
            .catch(error => {
                console.error('Problem with the fetch operation from server API', error)
            })

        /** Listeners & Actions attached to HTML elements **/

        // Song selected from dropdown lists
        $('#music').addEventListener('change', function () {
            retrieve($('#music').value, '1a', 'query')
        });

        $('#social_network').addEventListener('click', function () {
            retrieve('Zubir_Said', '2a1', 'query');
            retrieve('Zubir_Said', '2a2', 'query');
            retrieve('Zubir_Said', '2a3', 'query');
        });

        $('#genre-photos').addEventListener('click', function () {
            retrieve('Photograph', '2b', 'query')
        });

        $('#genre-letters').addEventListener('click', function () {
            retrieve('Letter', '2b', 'query')
        });

        $('#genre-speeches').addEventListener('click', function () {
            retrieve('Speech', '2b', 'query')
        });

        $('#genre-docs').addEventListener('click', function () {
            retrieve('_', '2c', 'query')
        });

        $('#genre-commentary').addEventListener('click', function () {
            retrieve('Comment', '2b2', 'query')
        });

        $('#genre-essays').addEventListener('click', function () {
            retrieve('Essay', '2b', 'query')
        });

        $('#genre-news').addEventListener('click', function () {
            retrieve('NewsArticle', '2b', 'query')
        });

        $('#genre-tv').addEventListener('click', function () {
            retrieve('Documentary', '2b2', 'query')
        });

        $('#genre-all').addEventListener('click', function () {
            retrieve('_', '2d', 'query');
            retrieve('_', '2c', 'query');
        });

        $('#topic').addEventListener('click', function () {
            retrieve('_', '2e', 'query')
        });

        /* Example */

        // $stylesheet.addEventListener('change', applyStylesheetFromSelect);


        /** MAIN FUNCTION **/
        // Fetch function submits query to ZS server API (middleware)and retrieve json result
        // Display query parameter in element ID 'query'
        // Runs cytoscape visualization
        async function retrieve(parameter, queryID, elementID_query) {

            // Display TOPIC (query keyword) as page header
            document.getElementById(elementID_query).innerHTML = parameter.toUpperCase().replace(/_/g, ' ')

            // fetch template
            // fetch(url, options).then(response => response.json()).then(result => /* process result */)

            API_domain = 'https://chriskhoo.net'
            API_router = 'ZS'
            API_queryID = queryID
            API_param = parameter
            API_string = `${API_domain}/${API_router}/${API_queryID}/${API_param}`

            fetch(API_string)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Server API didn't respond")
                    }
                    return response.json()
                })
                .then(json_value => {
                    console.log(json_value);
                    if (json_value.length > 0) {
                        newdata = json2graph(json_value)             // add search results to graph
                        // var dragListener = sigma.plugins.dragNodes(sigmajs, sigmajs.renderers[0]);
                    }
                })
                .catch(error => {
                    console.error('Problem with the fetch operation from server API', error)
                })

        }

        // Notes on response instances returned when fetch() promises are resolved.
        // Most common response properties:
        // Response.status — An integer (default value 200) containing the response status code.
        // Response.statusText — A string (default value ""), which corresponds to the HTTP status code message. Note that HTTP/2 does not support status messages.
        // Response.ok — used above, this is a shorthand for checking that status is in the range 200-299 inclusive. This returns a Boolean.

        async function expand_node(parameter, queryID, elementID_query) {
            let API_domain = 'https://chriskhoo.net'
            let API_router = 'ZS'
            let API_queryID = queryID
            let API_param = parameter
            let API_string = `${API_domain}/${API_router}/${API_queryID}/${API_param}`

            console.log(API_string)

            fetch(API_string)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Server API didn't respond")
                    }
                    return response.json()
                })
                .then(json_value => {
                    console.log(json_value)
                    if (json_value.length > 0) {
                        newdata = addnode(newdata, json_value)             // add search results to graph
                    }
                })
                .catch(error => {
                    console.error('Problem with the fetch operation from server API', error)
                })
        }

        function handle_data(nodes, edges, records) {
            let z_obj;
            for (x in records) {  // Process each record

                /* Process all the node fields first */
                for (y in records[x]._fields) {  // Process each field in record

                    // check whether field represents a null (blank), a relation or a node
                    if (records[x]._fields[y] === null) {   // field is blank (null)

                    } else if (typeof records[x]._fields[y].type !== 'undefined') {

                        // the field represents a RELATION. A Relation field has a "type" attribute, whereas a node has "labels"
                        // skip for now

                    } else {    // field is a NODE, not relation
                        let has_node = nodes.filter(function (item) {
                            return item.id === records[x]._fields[y].identity.low
                        })
                        if (has_node.length === 0) {
                            nodes.push({
                                    id: records[x]._fields[y].identity.low,
                                    id2: records[x]._fields[y].properties.id,
                                    supertype: records[x]._fields[y].labels[0],
                                    type: records[x]._fields[y].properties.type,
                                    x: Math.random(),
                                    y: Math.random(),
                                    label: records[x]._fields[y].properties.label,
                                //    color: 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',0.8)',
                                    size: 45,
                                    normal_size: 40,
                                 //   click_size: 0.5,
                                }
                            )
                            let current_node = nodes.filter(function (item) {
                                return item.id === records[x]._fields[y].identity.low
                            })[0]
                            // add other fields
                            for (let z in records[x]._fields[y].properties) {
                                z_obj = records[x]._fields[y].properties[z];
                                switch (z) {          // handle dates & URLs
                                    case 'id':
                                        break;   // skip id field as already displayed
                                    case 'id2':
                                        break;
                                    case 'type':
                                        break;   // skip id field as already displayed
                                    case 'label':
                                        break;   // skip id field as already displayed
                                    case 'birthDate':
                                    case 'deathDate':
                                    case 'date':
                                        current_node[z] = z_obj.year.low + '-' + z_obj.month.low + '-' + z_obj.day.low
                                        break;
                                    case 'thumbnailURL':  // array of URLs
                                        current_node[z] = z_obj
                                        break;
                                    case 'accessURL':     // array of URLs
                                        current_node[z] = z_obj
                                        break;
                                    default:
                                        current_node[z] = JSON.stringify(z_obj).slice(1, -1);
                                }
                            }
                             if (current_node.supertype === 'MusicalWork' ) {
                                   current_node.color = 'hsl(0, 100%, 90%)';
                                   current_node.originalcolor = 'hsl(0, 100%, 90%)';
                                   current_node.size = 80 ;
                                   current_node.type = 'image' ;
                                   current_node.url = imgurls[0] ;
                             }
                             else if (current_node.supertype === 'Topic') {
                                     current_node.color = 'hsl(0, 40%, 50%)';
                                     current_node.originalcolor = 'hsl(0, 40%, 50%)';
                                     current_node.size = 80 ;
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[1] ;
                            }
                             else if (current_node.supertype === 'Person') {
                                     current_node.color = 'hsl(0, 30%, 60%)';
                                     current_node.originalcolor = 'hsl(0, 30%, 60%)';
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[2] ;
                                     current_node.size = 80 ;
                            }
                             else if (current_node.supertype === 'CreativeWork') {
                                     current_node.color = '#668f3c';
                                     current_node.originalcolor = '#668f3c';
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[5] ;
                                     current_node.size = 83 ;
                            }
                              else if (current_node.supertype === 'Place') {
                                     current_node.color = 'hsl(0,40%,0%)';
                                     current_node.originalcolor = 'hsl(0,40%,0%)';
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[3] ;
                                     current_node.size = 80 ;
                            }
                               else if (current_node.supertype === 'Item') {
                                     current_node.color = '#617db4';
                                     current_node.originalcolor = '#617db4';
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[4] ;
                                     current_node.size = 82 ;
                            }
                               else if (current_node.supertype === 'Document') {
                                     current_node.color = '#c6583e';
                                     current_node.originalcolor = '#c6583e';
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[1] ;
                                     current_node.size = 85 ;
                            }
                               else if (current_node.supertype === 'Information_Object') {
                                     current_node.color = '#b956af';
                                     current_node.originalcolor = '#b956af';
                                     current_node.type = 'image' ;
                                     current_node.url = imgurls[3] ;
                                     current_node.size = 50 ;
                            }

                        }
                    }
                }

                /* Now process all the relations */
                for (let y in records[x]._fields) {  // Process each field in record

                    // check whether field represents a null (blank), a relation or a node
                    if (records[x]._fields[y] === null) {   // field is blank (null)

                    } else if (typeof records[x]._fields[y].type !== 'undefined') {

                        // field represents a RELATION. A Relation field has a "type" attribute, whereas a node has "labels"
                        // Add edge to graph
                        has_edge = edges.filter(function (item) {
                            return item.id === records[x]._fields[y].identity.low + 10000
                        })
                        if (has_edge.length === 0) {
                            edges.push(
                                {
                                    id: records[x]._fields[y].identity.low + 10000,  // to distinguish edge IDs from node IDs
                                    source: records[x]._fields[y].start.low,
                                    target: records[x]._fields[y].end.low,
                                    type: records[x]._fields[y].type,
                                    label: records[x]._fields[y].properties.label,
                                    color: '#000',
                                    original_color: '#000'
                                }
                            )
                            let current_edge = edges.filter(function (item) {
                                return item.id === records[x]._fields[y].identity.low + 10000
                            })[0]
                            // add other fields
                            for (let z in records[x]._fields[y].properties) {
                                z_obj = records[x]._fields[y].properties[z];
                                switch (z) {          // handle dates & URLs
                                    case 'id':
                                        break;   // skip id field as already displayed
                                    case 'type':
                                        break;   // skip id field as already displayed
                                    case 'label':
                                        break;   // skip id field as already displayed
                                    case 'date':
                                        current_edge[z] = z_obj.year.low + '-' + z_obj.month.low + '-' + z_obj.day.low
                                        break;
                                    default:
                                        current_edge[z] = JSON.stringify(z_obj).slice(1, -1);
                                }
                            }
                        }
                    }
                }
            }
            return {
                nodes: nodes,
                edges: edges
            };
        }

        let addnode = (former, records) => {
            let nodes = former.nodes;
            let edges = former.edges;
            let returned_data = handle_data(nodes, edges, records);
            let current_data = {
                nodes: returned_data.nodes,
                edges: returned_data.edges
            };
            // This clear step is necessary as sigmajs have to clean and then reread. Vis doesn't need this step
            sigmajs.graph.clear();
            sigmajs.graph.read(current_data);
            sigmajs.refresh();
            return current_data;
        }

        /** Add Neo4j result records to Vis graph */
        let json2graph = (records) => {
            let nodes = [];
            let edges = [];
            let returned_data = handle_data(nodes, edges, records);
            let current_data = {
                nodes: returned_data.nodes,
                edges: returned_data.edges
            }
            // This clear step is necessary as sigmajs have to clean and then reread. Vis doesn't need this step
            sigmajs.graph.clear();
            sigmajs.graph.read(current_data)
            sigmajs.refresh();
            return current_data;
        }

        /** Listeners & Actions attached to Cytoscape display & elements **/

        /* Change graph layout */
        // $('#layout-breadthfirst').addEventListener('click', function(){ cy.layout( layouts['breadthfirst'] ).run() });
        // $('#layout-fcose').addEventListener('click', function(){ cy.layout( layouts['fcose'] ).run() });
        // $('#layout-concentric').addEventListener('click', function(){ cy.layout( layouts['concentric'] ).run() });
        // $('#layout-cola').addEventListener('click', function(){ cy.layout( layouts['cola'] ).run() });
        $('#clear_canvas').addEventListener('click', function () {
            sigmajs.graph.clear()
            sigmajs.refresh();
        });
        $('#start_Force_Atlas2').addEventListener('click', function () {
            sigmajs.startForceAtlas2();
            setTimeout(()=>{
                  sigmajs.stopForceAtlas2();
            },1000)
        });
        $('#custom_node_render').addEventListener('click', function () {
            customNodeRender();
        });
        $('#custom_edge_render').addEventListener('click', function () {
            customEdgeRender();
        });

        $('#edge_style').addEventListener('change', function() {
            let myselect=document.getElementById("edge_style");
            let index = myselect.selectedIndex;
            changeEdgeStyle(myselect.options[index].value);
            console.log(myselect.options[index].value);
        });
        $('#edge_shape').addEventListener('change', function() {
            let myselect=document.getElementById("edge_shape");
            let index = myselect.selectedIndex;
            changeShapeStyle(myselect.options[index].value);
            console.log(myselect.options[index].value);
        });
        $('#network_export').addEventListener('click', function () {
            sigmajs.toSVG({download: true, filename: 'networkgraph.svg', size: 1000});
        });
            // $('#auto_rescale').addEventListener('click', function () {
        //     sigmajs.resize()
        // });
        // $('#reset_zoom').addEventListener('click', function(){ cy.reset();  });
        // $('#layout-spread').addEventListener('click', function(){ cy.layout( layouts['spread'] ).run() });
        // $('#resizeCanvas').addEventListener('click', function(){ resizeCanvas(); cy.reset();  });
        $('#fullscreen').addEventListener('click', function(){ openFullscreen(); sigmajs.refresh()});

        function openFullscreen() {
            if ($('#canvasWithMenu').requestFullscreen) {
                $('#canvasWithMenu').requestFullscreen();
            } else if ($('#canvasWithMenu').webkitRequestFullscreen) { /* Safari */
                $('#canvasWithMenu').webkitRequestFullscreen();
            } else if ($('#canvasWithMenu').msRequestFullscreen) { /* IE11 */
                $('#canvasWithMenu').msRequestFullscreen();
            }
        }


        function changeEdgeStyle(stylevalue) {
            //map edge and change the type of edges to t
            sigmajs.graph.edges().map(function (e) {
                e.type = stylevalue
            });
            sigmajs.refresh();
        }

        function changeShapeStyle(shapevalue) {
            //map edge and change the type of edges to t
            sigmajs.graph.edges().map(function (e) {
                e.type = shapevalue
            });
            sigmajs.refresh();
        }

       //  function customNodeRender() {
       //      sigma.utils.pkg('sigma.canvas.nodes');
       //      // sigmajs.graph.nodes().map(function (e) {
       //      //     let img = Math.random() >= 0.7;
       //      //     e.type = 'image'
       //      //     e.url = img ? imgurls[Math.floor(Math.random() * imgurls.length)] : null
       //      // })
       //      sigma.canvas.nodes.image = (function() {
       //          let _cache = {},
       //              _loading = {},
       //              _callbacks = {};
       //
       //          // Return the renderer itself:
       //          let renderer = function(node, context, settings) {
       //              var args = arguments,
       //                  prefix = settings('prefix') || '',
       //                  size = node[prefix + 'size'],
       //                  url = node.url;
       //
       //              if (_cache[url]) {
       //                  context.save();
       //
       //                  // Draw the clipping disc:
       //                  context.beginPath();
       //                  context.arc(
       //                      node[prefix + 'x'],
       //                      node[prefix + 'y'],
       //                      node[prefix + 'size'],
       //                      0,
       //                      Math.PI * 2,
       //                      true
       //                  );
       //                  context.closePath();
       //                  context.clip();
       //
       //                  // Draw the image
       //                  context.drawImage(
       //                      _cache[url],
       //                      node[prefix + 'x'] - size,
       //                      node[prefix + 'y'] - size,
       //                      2 * size,
       //                      2 * size
       //                  );
       //
       //                  // Quit the "clipping mode":
       //                  context.restore();
       //
       //                  // Draw the border:
       //                  context.beginPath();
       //                  context.arc(
       //                      node[prefix + 'x'],
       //                      node[prefix + 'y'],
       //                      node[prefix + 'size'],
       //                      0,
       //                      Math.PI * 2,
       //                      true
       //                  );
       //                  context.lineWidth = size / 5;
       //                  context.strokeStyle = node.color || settings('defaultNodeColor');
       //                  context.stroke();
       //              } else {
       //                  sigma.canvas.nodes.image.cache(url);
       //                  sigma.canvas.nodes.def.apply(
       //                      sigma.canvas.nodes,
       //                      args
       //                  );
       //              }
       //          };
       //
       //          // Let's add a public method to cache images, to make it possible to
       //          // preload images before the initial rendering:
       //          renderer.cache = function(url, callback) {
       //              if (callback)
       //                  _callbacks[url] = callback;
       //
       //              if (_loading[url])
       //                  return;
       //
       //              var img = new Image();
       //
       //              img.onload = function() {
       //                  _loading[url] = false;
       //                  _cache[url] = img;
       //
       //                  if (_callbacks[url]) {
       //                      _callbacks[url].call(this, img);
       //                      delete _callbacks[url];
       //                  }
       //              };
       //
       //              _loading[url] = true;
       //              img.src = url;
       //          };
       //
       //          return renderer;
       //      })();
       // //     sigmajs.refresh();
       //  }

        function customEdgeRender() {
            sigma.utils.pkg('sigma.canvas.edges');
            //map edge and change the type of edges to t
            sigmajs.graph.edges().map(function (e) {
                e.type = 't'
            });
            sigma.canvas.edges.t = function(edge, source, target, context, settings) {
                let color = edge.color,
                    prefix = settings('prefix') || '',
                    edgeColor = settings('edgeColor'),
                    defaultNodeColor = settings('defaultNodeColor'),
                    defaultEdgeColor = settings('defaultEdgeColor');

                if (!color)
                    switch (edgeColor) {
                        case 'source':
                            color = source.color || defaultNodeColor;
                            break;
                        case 'target':
                            color = target.color || defaultNodeColor;
                            break;
                        default:
                            color = defaultEdgeColor;
                            break;
                    }

                context.strokeStyle = color;
                context.lineWidth = edge[prefix + 'size'] || 1;
                context.beginPath();
                context.moveTo(
                    source[prefix + 'x'],
                    source[prefix + 'y']
                );
                context.lineTo(
                    source[prefix + 'x'],
                    target[prefix + 'y']
                );
                context.lineTo(
                    target[prefix + 'x'],
                    target[prefix + 'y']
                );
                context.stroke();
            };
            sigmajs.refresh();
        }


        sigmajs.bind("clickNode", (e) => {
            console.log(e)
            var nodeId = e.data.node.id,
            toKeep = sigmajs.graph.neighbors(nodeId);
     //       console.log(toKeep)
            toKeep[nodeId] = e.data.node;

           sigmajs.graph.nodes().forEach(function(n) {
            if (toKeep[n.id])
                 n.color = n.originalcolor;
            else
                 n.color = '#eee';
            });

           sigmajs.graph.edges().forEach(function(e) {
              if (toKeep[e.source] && toKeep[e.target])
               e.color = e.originalcolor;
              else
               e.color = '#eee';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        sigmajs.refresh();
        });

        sigmajs.bind('clickStage', function(e) {
                sigmajs.graph.nodes().forEach(function(n) {
                    n.color = n.originalcolor;
                });

               sigmajs.graph.edges().forEach(function(e) {
                   e.color = e.originalcolor;
                });

               console.log(e);

        // Same as in the previous event:
        sigmajs.refresh();
      });

        sigmajs.bind('rightClickNode', function (e) {
            let node_id = e.data.node.id;
            let select_node = newdata.nodes.filter(function (item) {
                return item.id === node_id
            })
            console.log(select_node[0]);
            let txt = '<p><b>ID: ' + select_node[0]['id2'] + '</b></p>';
            txt = txt.replace(/_/g, ' ')   // replace _ with space
            // temporary storage
            let comment_text;
            let link_text;
            let date_text;
            for (let x in select_node[0]) {
                switch (x) {          // handle dates & URLs
                    case 'id':
                        break;   // skip id field as it is just a node no. We'll display id2
                    case 'id2':
                        break;  // already displayed
                    case 'supertype':
                        break;  // skip this field
                    case 'comment':
                        if (select_node[0][x] !== '') {
                            comment_text = select_node[0][x]
                            comment_text = comment_text.replace(/\\n/g, '<br/>')  // replace \\n in the text with <br>
                            comment_text = comment_text.replace(/\\/g, '')
                            comment_text = comment_text.replace(/[‘’“”]/g, '\'')  // replace pretty quotation marks with plain quote
                            txt += '<p><em>comment</em>: ' + comment_text + '</p>'
                        }
                        break;
                    case 'birthDate':
                    case 'deathDate':
                    case 'date':
                        date_text = select_node[0][x]
                        date_text = date_text.replace('-1-1', '')  // remove Jan 1st, and retain just the year.
                        date_text = date_text.replace('-01-01', '')
                        txt += '<p><em>' + x + '</em>: ' + date_text + '</p>'
                        break;
                    case 'thumbnailURL':  // display thumbnail image
                        txt += '<p><a target="_blank" href="' + select_node[0].accessURL[0] + '">'
                        txt += '<img alt="Photograph" width="200" src="' + select_node[0].thumbnailURL[0] + '"/></a></p>'
                        break;
                    case 'accessURL':
                        for (link in select_node[0][x]) {
                            link_URL = select_node[0].accessURL[link]

                            if (link_URL.search("pdf") >= 0) {
                                link_text = 'PDF'   // PDF file
                            } else if (link_URL.search("jpg") >= 0) {
                                link_text = 'JPG'
                            } else if (link_URL.search("youtube") >= 0) {
                                link_text = 'YouTube'
                            } else {
                                link_text = 'Webpage'
                            }

                            txt += '<p><a href="' + link_URL + '" target="_blank"><b>' + link_text + '</b></a></p>'
                        }
                        break;
                    default:
                        txt += '<p><em>' + x + '</em>: ' + select_node[0][x] + '</p>'
                }
            }
            $('#node-expand').value = select_node[0]['id2'];  // Add neo4j node ID2 to button value - to pass to listener when clicked
            $('#node-remove').value = select_node[0]['id'];   // Add cytoscape node ID to button value
            $('#graph-popup1-content').innerHTML = txt;
            $('#graph-popup1').style.display = 'block';
            $('#graph-popup1-menu').style.display = 'block';
            // Create an event for Google Tag Manager trigger
            dataLayer.push({'event': 'graph-node-click'});
        })

        // //ADD NODE ON Double CLICK NODE
        // sigmajs.bind('rightClickNode', function(e) {
        //     expand_node($('#node-expand').value, '0', 'query')
        // });

        //Bind rightclick to remove node
        // sigmajs.bind('rightClick', function(e) {
        //     console.log('rightClick')
        //     sigmajs.graph.nodes.filter(function(n) {
        //         return n.hidden;
        // })

        // sigmajs.bind('overNode outNode', function(e) {
        //     console.log(e.type, e.data.node.label, e.data.captor);
        // });

        //bind rightclick, then menubar
        //mouse over
        //doubleclick with expand
        //covert the lyrix to visualization,popup window

        sigmajs.bind('clickEdge', function (object) {
            var edge_id = object.edge_id;
            var select_edge = newdata.edges.filter(function (item) {
                return item.id === edge_id
            })[0];
            console.log(select_edge)
            let txt = '<p><b>Relation: ' + select_edge.type + '</b></p>';  // html text to display in panel
            for (let x in select_edge) {
                switch (x) {
                    case 'id':
                        break;       // skip
                    case 'source':
                        break;   // skip
                    case 'target':
                        break;   // skip
                    case 'type' :
                        break;
                    case 'comment':
                        comment_text = select_edge[x]
                        comment_text = comment_text.replace(/\\n/g, '<br/>')
                        comment_text = comment_text.replace(/\\/g, '')
                        comment_text = comment_text.replace(/[‘’“”]/g, '\'')
                        txt += '<p><em>comment</em>: ' + comment_text + '</p>'
                        break;
                    default:
                        txt += '<p><em>' + x + '</em>: ' + select_edge[x] + '</p>'
                }
            }
            $('#graph-popup1-content').innerHTML = txt;
            $('#graph-popup1').style.display = 'block';
            $('#graph-popup1-menu').style.display = 'none';
        })

        /* Add listeners for expanding and removing existing Sigmajs nodes */
        // expand node id stored in button value
        $('#node-expand').addEventListener('click', function () {
            expand_node($('#node-expand').value, '0', 'query') // $('#node-expand').value contains the node ID used in neo4j database
        });
        //remove node stored in button value
        // $('#node-remove').addEventListener('click', function () {
        //     sigmajs.graph.nodes().filter(function(e) {
        //         e.hidden
        //         sigmajs.refresh()
        //         console.log('hidden node')
        //     })
        // });

        // Initialize the dragNodes plugin:
        // console.log(sigmajs.renderers)
        // let dragListener = sigma.plugins.dragNodes(sigmajs, sigmajs.renderers[0]);
        //
        // dragListener.bind('startdrag', function(event) {
        //     console.log(event);
        // });
        // dragListener.bind('drag', function(event) {
        //     console.log(event);
        // });
        // dragListener.bind('drop', function(event) {
        //     console.log(event);
        // });
        // dragListener.bind('dragend', function(event) {
        //     console.log(event);
        // });

        // sigmajs.bind('rightClickNode', function(e) {
        //     console.log(e.type, e.data.edge, e.data.captor);
        // });

        // // Instantiate the tooltips plugin with a Mustache renderer for node
        // var tooltips = sigma.plugins.tooltips(sigmajs, sigmajs.renderers[0], config);
        //
        // tooltips.bind('shown', function(event) {
        //     //console.log('tooltip shown');
        // });
        //
        // tooltips.bind('hidden', function(event) {
        //     //console.log('tooltip hidden');
        // });

        // sigma.renderers.def = sigma.renderers.canvas;
        // // Instanciate the ActiveState plugin:
        // let activeState = sigma.plugins.activeState(sigmajs);
        // let keyboard = sigma.plugins.keyboard(sigmajs, sigmajs.renderers[0]);
        //
        // // Initialize the Select plugin:
        // let select = sigma.plugins.select(sigmajs, activeState);
        // select.bindKeyboard(keyboard);
        //
        // // Initialize the dragNodes plugin:
        // let dragListener = sigma.plugins.dragNodes(sigmajs, sigmajs.renderers[0], activeState);
        //
        // // Initialize the lasso plugin:
        // let lasso = new sigma.plugins.lasso(sigmajs, sigmajs.renderers[0], {
        //     'strokeStyle': 'rgb(236, 81, 72)',
        //     'lineWidth': 2,
        //     'fillWhileDrawing': true,
        //     'fillStyle': 'rgba(236, 81, 72, 0.2)',
        //     'cursor': 'crosshair'
        // });
        //
        // select.bindLasso(lasso);
        // lasso.activate();
        //
        // // halo on active nodes:
        // function renderHalo() {
        //     sigmajs.renderers[0].halo({
        //         nodes: activeState.nodes()
        //     });
        // }
        //
        // sigmajs.renderers[0].bind('render', function(e) {
        //     renderHalo();
        // });
        //
        //
        // //"spacebar" + "s" keys pressed binding for the lasso tool
        // keyboard.bind('32+83', function() {
        //     if (lasso.isActive) {
        //         lasso.deactivate();
        //     } else {
        //         lasso.activate();
        //     }
        // });
        //
        // // Listen for selectedNodes event
        // lasso.bind('selectedNodes', function (event) {
        //     setTimeout(function() {
        //         lasso.deactivate();
        //         sigmajs.refresh({ skipIdexation: true });
        //     }, 0);
        // });

        // Initialize the dragNodes plugin:

        var dragListener = sigma.plugins.dragNodes(sigmajs, sigmajs.renderers.main.container.lastChild);

        dragListener.bind('startdrag', function(event) {
            console.log(event);
        });
        dragListener.bind('drag', function(event) {
            console.log(event);
        });
        dragListener.bind('drop', function(event) {
            console.log(event);
        });
        dragListener.bind('dragend', function(event) {
            console.log(event);
        });



    });
})();


