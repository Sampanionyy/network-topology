import React, { useState, useEffect, useRef } from 'react';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const NetworkTopology = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [shortestPath, setShortestPath] = useState(null);
  const [networkDiameter, setNetworkDiameter] = useState(null);
  const svgRef = useRef(null);
  
  const [config, setConfig] = useState({
    nodeCount: 5,
    minLinks: 1,
    maxLinks: 4,
    weightedLinks: false,
    weights: {
      min: 1,
      max: 10
    }
  });

  const [errors, setErrors] = useState({});

  // Dijkstra's algorithm implementation
  const findShortestPath = (graph, start, end) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialize distances
    Object.keys(graph).forEach(node => {
      distances[node] = Infinity;
      previous[node] = null;
      unvisited.add(node);
    });
    distances[start] = 0;
    
    while (unvisited.size > 0) {
      // Find minimum distance node
      let minNode = null;
      let minDistance = Infinity;
      unvisited.forEach(node => {
        if (distances[node] < minDistance) {
          minNode = node;
          minDistance = distances[node];
        }
      });
      
      if (minNode === null) break;
      if (minNode === end) break;
      
      unvisited.delete(minNode);
      
      // Update distances to neighbors
      Object.entries(graph[minNode]).forEach(([neighbor, weight]) => {
        if (unvisited.has(neighbor)) {
          const newDistance = distances[minNode] + weight;
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = minNode;
          }
        }
      });
    }
    
    // Reconstruct path
    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return {
      distance: distances[end],
      path: path
    };
  };

  // Convert links to adjacency list
  const createAdjacencyList = () => {
    const graph = {};
    nodes.forEach(node => {
      graph[node.id] = {};
    });
    
    links.forEach(link => {
      graph[link.source][link.target] = link.weight;
      graph[link.target][link.source] = link.weight;
    });
    
    return graph;
  };

  // Calculate network diameter
  const calculateDiameter = () => {
    const graph = createAdjacencyList();
    let maxDistance = 0;
    
    // Check all pairs of nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const { distance } = findShortestPath(graph, nodes[i].id.toString(), nodes[j].id.toString());
        if (distance > maxDistance && distance !== Infinity) {
          maxDistance = distance;
        }
      }
    }
    
    setNetworkDiameter(maxDistance);
  };

  // Handle node selection
  const handleNodeClick = (nodeId) => {
    setSelectedNodes(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      }
      if (prev.length < 2) {
        const newSelected = [...prev, nodeId];
        if (newSelected.length === 2) {
          const graph = createAdjacencyList();
          const result = findShortestPath(graph, newSelected[0].toString(), newSelected[1].toString());
          setShortestPath(result);
        }
        return newSelected;
      }
      return [nodeId];
    });
  };

  // Previous helper functions remain the same
  const generateNodes = (count) => {
    const padding = 50;
    const width = 800 - 2 * padding;
    const height = 600 - 2 * padding;
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: randomInt(padding, width),
      y: randomInt(padding, height),
      connections: 0
    }));
  };

  const isConnected = (nodes, links) => {
    // Previous implementation remains the same
    const visited = new Set();
    const adjacencyList = {};
    
    nodes.forEach(node => {
      adjacencyList[node.id] = [];
    });
    
    links.forEach(link => {
      adjacencyList[link.source].push(link.target);
      adjacencyList[link.target].push(link.source);
    });
    
    const dfs = (nodeId) => {
      visited.add(nodeId);
      adjacencyList[nodeId].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      });
    };
    
    if (nodes.length > 0) {
      dfs(0);
    }
    
    return visited.size === nodes.length;
  };

  const generateLinks = (nodes) => {
    // Previous implementation remains the same
    const links = [];
    const nodeCount = nodes.length;
    
    for (let i = 1; i < nodeCount; i++) {
      const source = i;
      const target = randomInt(0, i - 1);
      const weight = config.weightedLinks ? randomInt(config.weights.min, config.weights.max) : 1;
      links.push({ source, target, weight });
      nodes[source].connections++;
      nodes[target].connections++;
    }
    
    nodes.forEach((node, sourceId) => {
      while (node.connections < config.maxLinks) {
        const target = randomInt(0, nodeCount - 1);
        if (
          sourceId !== target &&
          node.connections < config.maxLinks &&
          nodes[target].connections < config.maxLinks &&
          !links.some(link => 
            (link.source === sourceId && link.target === target) ||
            (link.source === target && link.target === sourceId)
          )
        ) {
          const weight = config.weightedLinks ? randomInt(config.weights.min, config.weights.max) : 1;
          links.push({ source: sourceId, target, weight });
          nodes[sourceId].connections++;
          nodes[target].connections++;
        } else {
          break;
        }
      }
    });
    
    return links;
  };

  const initializeNetwork = () => {
    const newNodes = generateNodes(config.nodeCount);
    const newLinks = generateLinks(newNodes);
    
    if (isConnected(newNodes, newLinks)) {
      setNodes(newNodes);
      setLinks(newLinks);
      setSelectedNodes([]);
      setShortestPath(null);
      setNetworkDiameter(null);
    } else {
      initializeNetwork();
    }
  };

  // Previous event handlers remain the same
  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : Number(value);
    
    setConfig(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [name]: Number(value)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (config.nodeCount < 3 || config.nodeCount > 20) {
      newErrors.nodeCount = "Number of nodes must be between 3 and 20";
    }
    if (config.minLinks < 1) {
      newErrors.minLinks = "Minimum links must be at least 1";
    }
    if (config.maxLinks > 4) {
      newErrors.maxLinks = "Maximum links cannot exceed 4";
    }
    if (config.maxLinks < config.minLinks) {
      newErrors.maxLinks = "Maximum links cannot be less than minimum links";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      initializeNetwork();
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    form: {
      width: '100%',
      maxWidth: '400px',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #ddd',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginTop: '5px',
    },
    svg: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      width: '100%',
      marginBottom: '10px',
    },
    info: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#e9ecef',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '400px',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '20px' }}>Network Topology Simulator</h1>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        {/* Previous form elements remain the same */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Number of Nodes (3-20):
            <input
              type="number"
              name="nodeCount"
              value={config.nodeCount}
              onChange={handleConfigChange}
              min="3"
              max="20"
              style={styles.input}
            />
          </label>
          {errors.nodeCount && <div style={styles.error}>{errors.nodeCount}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Minimum Links per Node:
            <input
              type="number"
              name="minLinks"
              value={config.minLinks}
              onChange={handleConfigChange}
              min="1"
              max="4"
              style={styles.input}
            />
          </label>
          {errors.minLinks && <div style={styles.error}>{errors.minLinks}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Maximum Links per Node:
            <input
              type="number"
              name="maxLinks"
              value={config.maxLinks}
              onChange={handleConfigChange}
              min="1"
              max="4"
              style={styles.input}
            />
          </label>
          {errors.maxLinks && <div style={styles.error}>{errors.maxLinks}</div>}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="checkbox"
              name="weightedLinks"
              checked={config.weightedLinks}
              onChange={handleConfigChange}
            />
            Use Weighted Links
          </label>
        </div>

        {config.weightedLinks && (
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Minimum Weight:
              <input
                type="number"
                name="min"
                value={config.weights.min}
                onChange={handleWeightChange}
                min="1"
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Maximum Weight:
              <input
                type="number"
                name="max"
                value={config.weights.max}
                onChange={handleWeightChange}
                min="1"
                style={styles.input}
              />
            </label>
          </div>
        )}

        <button type="submit" style={styles.button}>
          Generate Network
        </button>
        
        <button
          type="button"
          style={styles.button}
          onClick={calculateDiameter}
          disabled={nodes.length === 0}
        >
          Calculate Network Diameter
        </button>
      </form>

      {/* Info Panel */}
      <div style={styles.info}>
        <h3>Network Analysis</h3>
        {selectedNodes.length === 2 && shortestPath && (
          <div>
            <p>Shortest path between nodes {selectedNodes[0]} and {selectedNodes[1]}:</p>
            <p>Distance: {shortestPath.distance}</p>
            <p>Path: {shortestPath.path.join(' → ')}</p>
          </div>
        )}
        {networkDiameter !== null && (
          <p>Network Diameter: {networkDiameter}</p>
        )}
        <p>Click on nodes to calculate shortest path (select 2 nodes)</p>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        style={styles.svg}
        width="100%"
        height="600"
      >
        {/* Draw links */}
        {links.map((link, index) => {
          const isInPath = shortestPath?.path.some((node, i) => 
            i < shortestPath.path.length - 1 &&
            ((shortestPath.path[i] === link.source.toString() && shortestPath.path[i + 1] === link.target.toString()) ||
             (shortestPath.path[i] === link.target.toString() && shortestPath.path[i + 1] === link.source.toString()))
          );
          
          return (
            <g key={`link-${index}`}>
              <line
                x1={nodes[link.source].x}
                y1={nodes[link.source].y}
                x2={nodes[link.target].x}
                y2={nodes[link.target].y}
                stroke={isInPath ? "#ff6b6b" : "#666"}
                strokeWidth={isInPath ? "4" : "2"}
              />
              {config.weightedLinks && (
                <text
                  x={(nodes[link.source].x + nodes[link.target].x) / 2}
                  y={(nodes[link.source].y + nodes[link.target].y) / 2}
                  textAnchor="middle"
                  dy="-5"
                  fill={isInPath ? "#ff6b6b" : "#666"}
                  fontWeight={isInPath ? "bold" : "normal"}
                >
                  {link.weight}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Draw nodes */}
        {nodes.map((node, index) => {
          const isSelected = selectedNodes.includes(node.id);
          const isInPath = shortestPath?.path.includes(node.id.toString());
          
          return (
            <g 
              key={`node-${index}`}
              onClick={() => handleNodeClick(node.id)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={isSelected ? "#ff6b6b" : isInPath ? "#ffd93d" : "#0066cc"}
                stroke={isSelected ? "#c92a2a" : "#003366"}
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontSize="12"
                fontWeight={isSelected || isInPath ? "bold" : "normal"}
              >
                {index}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default NetworkTopology;