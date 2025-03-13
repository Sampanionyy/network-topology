import React, { useState } from 'react';

import FormChoice from './FormChoice';
import Topology from './Topology';


const NetworkTopology = () => {
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [shortestPath, setShortestPath] = useState(null);
    const [networkDiameter, setNetworkDiameter] = useState(null);
    const [showResult, setShowResult] = useState(false);

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

    return (
        <div className="flex flex-col items-center p-5 max-w-5xl mx-auto">
            <h1 className="mb-5 text-2xl font-bold">Simulateur de réseau</h1>
            <FormChoice 
                config={config}
                setConfig={setConfig}
                setShowResult={setShowResult}
                setNodes={setNodes}
                setLinks={setLinks}
                setSelectedNodes={setSelectedNodes}
                setShortestPath={setShortestPath}
                setNetworkDiameter={setNetworkDiameter}
            />

            {showResult && (
                <Topology
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                    links={links}
                    nodes={nodes}
                    shortestPath={shortestPath}
                    setShortestPath={setShortestPath}
                    networkDiameter={networkDiameter}
                    setNetworkDiameter={setNetworkDiameter}
                    config={config}
                />
            )}
        </div>
    );
};

export default NetworkTopology;