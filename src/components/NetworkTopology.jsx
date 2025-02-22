import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const NetworkTopology = () => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const svgRef = useRef(null);
  
  // Configuration state
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

  // Form validation state
  const [errors, setErrors] = useState({});
  
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
    const links = [];
    const nodeCount = nodes.length;
    
    // First, create a spanning tree
    for (let i = 1; i < nodeCount; i++) {
      const source = i;
      const target = randomInt(0, i - 1);
      const weight = config.weightedLinks ? randomInt(config.weights.min, config.weights.max) : 1;
      links.push({ source, target, weight });
      nodes[source].connections++;
      nodes[target].connections++;
    }
    
    // Add additional random links
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
    } else {
      initializeNetwork();
    }
  };

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
    
    // Validation
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
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '20px' }}>Network Topology Simulator</h1>
      
      <form style={styles.form} onSubmit={handleSubmit}>
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
      </form>

      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        style={styles.svg}
        width="100%"
        height="600"
      >
        {/* Draw links */}
        {links.map((link, index) => (
          <g key={`link-${index}`}>
            <line
              x1={nodes[link.source].x}
              y1={nodes[link.source].y}
              x2={nodes[link.target].x}
              y2={nodes[link.target].y}
              stroke="#666"
              strokeWidth="2"
            />
            {config.weightedLinks && (
              <text
                x={(nodes[link.source].x + nodes[link.target].x) / 2}
                y={(nodes[link.source].y + nodes[link.target].y) / 2}
                textAnchor="middle"
                dy="-5"
                fill="#666"
              >
                {link.weight}
              </text>
            )}
          </g>
        ))}
        
        {/* Draw nodes */}
        {nodes.map((node, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill="#0066cc"
              stroke="#003366"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="12"
            >
              {index}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default NetworkTopology;