import React, { useRef } from 'react'
import Information from './Information';
import Link from './Link';
import Node from './Node';

const Topology = ({
    selectedNodes,
    setSelectedNodes,
    shortestPath,
    setShortestPath,
    links,
    nodes,
    networkDiameter,
    setNetworkDiameter,
    config 
}) => {
    const svgRef = useRef(null);

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

    

    return (
        <div className='flex flex-col items-center'>
            <Information
                selectedNodes={selectedNodes}
                shortestPath={shortestPath}
                calculateDiameter={calculateDiameter}
                nodes={nodes}
                networkDiameter={networkDiameter}
            />

            <svg
                ref={svgRef}
                viewBox="0 0 800 600"
                className="w-full h-[600px] border border-gray-300 rounded-lg bg-gray-50"
            >
                {/* Links and nodes rendering logic remains the same */}
                {links.map((link, index) => (
                    <Link
                        key={`link-${index}`}                        
                        nodes={nodes}
                        link={link}
                        shortestPath={shortestPath}
                        config={config}
                    />
                ))}
                
                {nodes.map((node, index) => (
                    <Node
                        key={`node-${index}`}                        
                        node={node} 
                        index={index}
                        selectedNodes={selectedNodes} 
                        shortestPath={shortestPath} 
                        setSelectedNodes={setSelectedNodes} 
                        findShortestPath={findShortestPath} 
                        setShortestPath={setShortestPath}
                        createAdjacencyList={createAdjacencyList}
                    />
                ))}
            </svg>
        </div>
    )
}

export default Topology
