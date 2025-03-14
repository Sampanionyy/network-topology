import React from 'react'
import { Info } from "lucide-react";
import { Chip, Divider } from '@mui/material';

const Information = ({
    selectedNodes,
    shortestPath,
    calculateDiameter,
    nodes,
    networkDiameter

}) => {
    return (
        <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg mb-5 text-center">
            <h3 className="text-lg font-bold mb-3 text-orange-400">Analyse du réseau</h3>

            <div>
                <div className='flex justify-center gap-2 items-center'>
                    <Info className='text-orange-400' size={15}/>
                    <span className='text-orange-400 text-sm'>Cliquer sur les noeuds pour calculer le chemin le plus court (2 noeuds)</span>
                </div>
                <div>
                    {selectedNodes.length === 2 && shortestPath && (
                        <>
                            <div>
                                <span>Chemin le plus court entre
                                    <span className='ml-2'>
                                        <Chip label={selectedNodes[0]} color='error' />
                                    </span> and 
                                    <span className='mr-2 ml-2'>
                                        <Chip label={selectedNodes[1]} color='error' /> 
                                    </span> :
                                </span>
                                <p className='bg-orange-200 p-2 mb-2 mt-2'>Distance: {shortestPath.distance}</p>
                                <p className='bg-orange-200 p-2 mb-2'>Chemin: {shortestPath.path.join(' → ')}</p>
                            </div>
                            <button
                                type="button"
                                className="w-full mb-2 py-2 px-4 bg-blue-600 text-white rounded-md text-base cursor-pointer hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                onClick={calculateDiameter}
                                disabled={nodes.length === 0}
                            >
                                Calculer la diamètre du réseau
                            </button>
                        </>
                    )}
                    {networkDiameter !== null && (
                        <p className='bg-orange-200 p-2'>Diamètre du réseau: {networkDiameter}</p>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Information
