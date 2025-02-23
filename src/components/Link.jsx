import React from 'react'

const Link = ({link, nodes, shortestPath, config }) => {
    const isInPath = shortestPath?.path.some((node, i) => 
        i < shortestPath.path.length - 1 &&
        ((shortestPath.path[i] === link.source.toString() && shortestPath.path[i + 1] === link.target.toString()) ||
        (shortestPath.path[i] === link.target.toString() && shortestPath.path[i + 1] === link.source.toString()))
    );
    
    return (
        <g>
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
}

export default Link
