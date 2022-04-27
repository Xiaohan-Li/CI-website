// Initiate Sigma
var s = new sigma(
    {
      renderer: {
        container: document.getElementById('sigma-container'),
        type: 'canvas'
      },
      settings: {
        edgeLabelSize: 'proportional',
        minArrowSize: 5,
        labelThreshold:15
      }
    }
  );
  
  var neo4jConfig = {
    url: 'neo4j+s://fc5b611c.databases.neo4j.io',
    user: 'anonymous',
    password: 'anonymous',
    driver: {
    }
  };
  
  var style = {
    labels: {
      Person : {
        label: 'name',
        color: '#654321',
        size: 10,
        icon: {
          name: 'f007',
          color: '#FFF',
          scale: 1.0
        }
      },
      Movie : {
        label: 'title',
        color: '#123456',
        size: 10,
        icon: {
          name: 'f008',
          color: '#FFF',
          scale: 1.0
        }
      }
    },
    edges: {
      ACTED_IN: {
        color: '#040404',
        size:1,
        label: 'roles'
      },
      DIRECTED: {
        color: '#040404',
        size:1,
        label: 'roles'
      }
    }
  };
  
  Neo4jGraph(neo4jConfig, style, 'MATCH (n:Cause_Effect)-[R]->(Entity2) RETURN n,R,Entity2 LIMIT 25',{}).then( function(result) {
    // load the graph
    console.log(15);
    s.graph.read(result);
    // enable drag'n'drop
    sigma.plugins.dragNodes(s, s.renderers[0]);
    // start layout
    s.startForceAtlas2();
    setTimeout(() => { s.stopForceAtlas2() }, Math.log(result.nodes.length*result.edges.length)*1000);
   })