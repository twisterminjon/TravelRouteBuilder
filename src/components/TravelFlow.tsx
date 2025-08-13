import React, { useCallback, useReducer, useRef } from 'react';
import ReactFlow, { Node, Edge, useEdgesState, useNodesState, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import CountryNodeComponent from './CountryNode';
import CountrySearch from './CountrySearch';
import { CountryNodeClass } from '../core/CountryNodeClass';
import { Country } from '../types';
import { EdgeClass } from '../core/EdgeClass';
import { TravelGraph } from '../core/TravelGraph';

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

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '360px', borderRight: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
                <CountrySearch onCountrySelect={handleCountrySelect} />
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