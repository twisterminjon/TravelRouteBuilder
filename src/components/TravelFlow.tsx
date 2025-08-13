import React, { useCallback, useState } from 'react';
import ReactFlow, { Node, Edge, useEdgesState, useNodesState, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import CountryNodeComponent from './CountryNode';
import CountrySearch from './CountrySearch';
import { CountryNodeClass } from '../core/CountryNodeClass';
import { Country } from '../types';
import { EdgeClass } from '../core/EdgeClass';

const nodeTypes = {
    countryNode: CountryNodeComponent,
};

const TravelFlow: React.FC = () => {
    const [nodeInstances, setNodeInstances] = useState<CountryNodeClass[]>([]);
    const [edgeInstances, setEdgeInstances] = useState<EdgeClass[]>([]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // add new country to canvas
    const handleCountrySelect = (country: Country) => {
        const newNode = new CountryNodeClass(
        `country-${Date.now()}`, //id
        { x: Math.random() * 400, y: Math.random() * 400 }, // position
        country
        );

        setNodeInstances(prev => [...prev, newNode]);
    };

    // sync 
    React.useEffect(() => {
        const reactFlowNodes = nodeInstances.map(instance => instance.toReactFlowNode());
        setNodes(reactFlowNodes);
    }, [nodeInstances, setNodes]);

    React.useEffect(() => {
        const reactFlowEdges = edgeInstances.map(instance => instance.toReactFlowEdge());
        setEdges(reactFlowEdges);
    }, [edgeInstances, setEdges]);

    // update position
    const handleNodesChange = useCallback((changes: any[]) => {
        changes.forEach(change => {
            if (change.type === 'position' && change.position) {
                const nodeInstance = nodeInstances.find(n => n.id === change.id);
                if (nodeInstance) {
                    nodeInstance.updatePosition(change.position);
                }
            }
        });
        
        onNodesChange(changes);
    }, [nodeInstances, onNodesChange]);

    // add Edge
    const onConnect = useCallback((params: Connection) => {
        if (params.source && params.target) {
            const newEdge = new EdgeClass(params.source, params.target);
            setEdgeInstances(prev => [...prev, newEdge]);

            console.log(`Route created: ${params.source} → ${params.target}`);
        }
    }, []);

    // del Edge
    const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
        const edgeIdsToDelete = edgesToDelete.map(edge => edge.id);
        setEdgeInstances(prev => 
        prev.filter(edgeInstance => !edgeIdsToDelete.includes(edgeInstance.id))
        );
    }, []);

    // del Node
    const onNodesDelete = useCallback((nodesToDelete: Node[]) => {
        const nodeIdsToDelete = nodesToDelete.map(node => node.id);
        
        setNodeInstances(prev => 
            prev.filter(nodeInstance => !nodeIdsToDelete.includes(nodeInstance.id))
        );

        setEdgeInstances(prev => 
            prev.filter(edgeInstance => 
                !nodeIdsToDelete.includes(edgeInstance.source) && 
                !nodeIdsToDelete.includes(edgeInstance.target)
            )
        );
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar with search */}
        <div style={{ width: '360px', borderRight: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
            <CountrySearch onCountrySelect={handleCountrySelect} />
        </div>

        {/* canvas */}
        <div style={{ flex: 1 }}>
            <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            onNodesDelete={onNodesDelete}
            deleteKeyCode="Delete"
            fitView
            />
        </div>
        </div>
    );
};

export default TravelFlow;