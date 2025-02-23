import React from 'react'

const Node = ({
    node, 
    selectedNodes, 
    shortestPath, 
    setSelectedNodes, 
    findShortestPath, 
    setShortestPath,
    index,
    createAdjacencyList
}) => {
    const isSelected = selectedNodes.includes(node.id);
    const isInPath = shortestPath?.path.includes(node.id.toString());
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
    return (
        <g             
            onClick={() => handleNodeClick(node.id)}
            className="cursor-pointer"
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
}

export default Node
