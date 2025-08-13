import React, { useCallback, useReducer, useRef } from 'react';
import ReactFlow, { Node, Edge, useEdgesState, useNodesState, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import CountryNodeComponent from './CountryNode';
import CountrySearch from './CountrySearch';
import { Country } from '../types';
import { TravelGraph } from '../core/TravelGraph';
import { StorageService } from '../services/StorageService';

const nodeTypes = {
    countryNode: CountryNodeComponent,
};

const TravelFlow: React.FC = () => {
    const graphRef = useRef(new TravelGraph());
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // sync
    const syncWithGraph = useCallback(() => {
        setNodes(graphRef.current.getReactFlowNodes());
        setEdges(graphRef.current.getReactFlowEdges());
        forceUpdate();
    }, [setNodes, setEdges]);

    // add country
    const handleCountrySelect = useCallback((country: Country) => {
        graphRef.current.addCountry(country);
        syncWithGraph();
    }, [syncWithGraph]);

    // update position
    const handleNodesChange = useCallback((changes: any[]) => {
        changes.forEach(change => {
            if (change.type === 'position' && change.position) {
                graphRef.current.updateNodePosition(change.id, change.position);
            }
        });
        onNodesChange(changes);
    }, [onNodesChange]);

    // add edge
    const onConnect = useCallback((params: Connection) => {
        if (params.source && params.target) {
            const success = graphRef.current.connectCountries(params.source, params.target);
            if (success) {
                syncWithGraph();
            }
        }
    }, [syncWithGraph]);

    // del node
    const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
        nodesToDelete.forEach(node => {
            graphRef.current.removeNode(node.id);
        });
        syncWithGraph();
    }, [syncWithGraph]);

    // del edge
    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        edgesToDelete.forEach(edge => {
            graphRef.current.removeEdge(edge.id);
        });
        syncWithGraph();
    }, [syncWithGraph]);

    const handleSaveRoute = useCallback(() => {
        const routeData = graphRef.current.serialize();
        const success = StorageService.saveRoute(routeData);
        if (success) {
            alert('Route saved successfully!');
        } else {
            alert('Failed to save route');
        }
    }, []);
    
    const handleLoadRoute = useCallback(() => {
        const routeData = StorageService.loadRoute();
        if (routeData) {
            graphRef.current.loadFromData(routeData);
            syncWithGraph();
            alert('Route loaded successfully!');
        } else {
            alert('No saved route found');
        }
    }, [syncWithGraph]);
    
    const handleExportRoute = useCallback(() => {
        const routeData = graphRef.current.serialize();
        const filename = `travel-route-${new Date().getTime()}.json`;
        StorageService.exportToFile(routeData, filename);
    }, []);
    
    const handleImportRoute = useCallback(async () => {
        try {
            const routeData = await StorageService.importFromFile();
            graphRef.current.loadFromData(routeData);
            syncWithGraph();
            alert('Route imported successfully!');
        } catch (error) {
            alert('Failed to import route');
        }
    }, [syncWithGraph]);

    const handleClearCanvas = useCallback(() => {
        const confirmed = window.confirm(
          'Clear all countries and routes?'
        );
        
        if (confirmed) {
          graphRef.current.clear();
          syncWithGraph();
        }
      }, [syncWithGraph]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '360px', borderRight: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
                <CountrySearch onCountrySelect={handleCountrySelect} />

                {/* Панель управления маршрутами */}
                <div style={{ padding: '20px', borderTop: '1px solid #ccc' }}>
                    <h4>Route Management</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <button 
                            onClick={handleSaveRoute}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Save Route
                        </button>
                        
                        <button 
                            onClick={handleLoadRoute}
                            disabled={!StorageService.hasSavedRoute()}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: StorageService.hasSavedRoute() ? '#2196F3' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: StorageService.hasSavedRoute() ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Load Route
                        </button>
                        
                        <hr style={{ margin: '10px 0' }} />
                        
                        <button 
                            onClick={handleExportRoute}
                            disabled={nodes.length === 0}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: nodes.length > 0 ? '#FF9800' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: nodes.length > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Export JSON
                        </button>
                        
                        <button 
                            onClick={handleImportRoute}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#9C27B0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Import JSON
                        </button>
                        <hr style={{ margin: '10px 0' }} />

                        <button 
                            onClick={handleClearCanvas}
                            disabled={nodes.length === 0 && edges.length === 0}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: (nodes.length > 0 || edges.length > 0) ? '#f44336' : '#ccc',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: (nodes.length > 0 || edges.length > 0) ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Clear Canvas
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodesDelete={onNodesDelete}
                    onEdgesDelete={onEdgesDelete}
                    deleteKeyCode="Delete"
                    fitView
                />
            </div>
        </div>
    );
};

export default TravelFlow;