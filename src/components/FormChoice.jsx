import React, { useState } from 'react'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const FormChoice = (
{
    config, 
    setConfig, 
    setNodes, 
    setLinks, 
    setShowResult, 
    setSelectedNodes, 
    setShortestPath, 
    setNetworkDiameter
}) => {
    const [errors, setErrors] = useState({});

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (config.nodeCount < 3 || config.nodeCount > 20) {
            newErrors.nodeCount = "Nombre de noeuds doit être entre 3 et 20";
        }
        if (config.minLinks < 1) {
            newErrors.minLinks = "Au moins 1 noeud";
        }
        if (config.maxLinks > 4) {
            newErrors.maxLinks = "Pas plus de 4 noeuds";
        }
        if (config.maxLinks < config.minLinks) {
            newErrors.maxLinks = "Le max doit être supérieur au min";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            await initializeNetwork();
            setShowResult(true);
        }
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
                    (link.source === target && link.target === sourceId))
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

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mb-5 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-4">
                <label className="block mb-2 font-bold">
                    Nombre de noeuds (3-20):
                    <input
                        type="number"
                        name="nodeCount"
                        value={config.nodeCount}
                        onChange={handleConfigChange}
                        min="3"
                        max="20"
                        className="w-full p-2 border border-gray-200 rounded-md mt-1"
                    />
                </label>
                {errors.nodeCount && <div className="text-red-500 text-sm mt-1">{errors.nodeCount}</div>}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-bold">
                    Nombre de liens minimum:
                    <input
                        type="number"
                        name="minLinks"
                        value={config.minLinks}
                        onChange={handleConfigChange}
                        min="1"
                        max="4"
                        className="w-full p-2 border border-gray-200 rounded-md mt-1"
                    />
                </label>
                {errors.minLinks && <div className="text-red-500 text-sm mt-1">{errors.minLinks}</div>}
            </div>

            <div className="mb-4">
                <label className="block mb-2 font-bold">
                    Nombre de liens maximum:
                    <input
                        type="number"
                        name="maxLinks"
                        value={config.maxLinks}
                        onChange={handleConfigChange}
                        min="1"
                        max="4"
                        className="w-full p-2 border border-gray-200 rounded-md mt-1"
                    />
                </label>
                {errors.maxLinks && <div className="text-red-500 text-sm mt-1">{errors.maxLinks}</div>}
            </div>

            <div className="mb-4">
                <label className="flex items-center font-bold">
                    <input
                        type="checkbox"
                        name="weightedLinks"
                        checked={config.weightedLinks}
                        onChange={handleConfigChange}
                        className="mr-2"
                    />
                    Ajouter les poids des liens
                </label>
            </div>

            {config.weightedLinks && (
                <div className="mb-4">
                    <label className="block mb-2 font-bold">
                        Poids minimum
                        <input
                            type="number"
                            name="min"
                            value={config.weights.min}
                            onChange={handleWeightChange}
                            min="1"
                            className="w-full p-2 border border-gray-200 rounded-md mt-1"
                        />
                    </label>
                    <label className="block mb-2 font-bold">
                        Poids maximum
                        <input
                            type="number"
                            name="max"
                            value={config.weights.max}
                            onChange={handleWeightChange}
                            min="1"
                            className="w-full p-2 border border-gray-200 rounded-md mt-1"
                        />
                    </label>
                </div>
            )}

            <button type="submit" className="w-full mb-2 py-2 px-4 bg-blue-600 text-white rounded-md text-base cursor-pointer hover:bg-blue-700">
                Génerer le réseau
            </button>
        </form>
    )
}

export default FormChoice
