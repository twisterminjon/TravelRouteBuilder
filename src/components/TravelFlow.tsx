import React, { useState } from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import CountryNodeComponent from './CountryNode';
import CountrySearch from './CountrySearch';
import { CountryNodeClass } from '../core/CountryNodeClass';
import { Country } from '../types';

const nodeTypes = {
  countryNode: CountryNodeComponent,
};

const TravelFlow: React.FC = () => {
  const [nodeInstances, setNodeInstances] = useState<CountryNodeClass[]>([]);

  // add new country to canvas
  const handleCountrySelect = (country: Country) => {
    const newNode = new CountryNodeClass(
      `country-${Date.now()}`, //id
      { x: Math.random() * 400, y: Math.random() * 400 }, // position
      country
    );

    setNodeInstances(prev => [...prev, newNode]);
  };

  // to React Flow format
  const nodes: Node[] = nodeInstances.map(instance => instance.toReactFlowNode());

  const edges: Edge[] = []; // temp

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
          fitView
        />
      </div>
    </div>
  );
};

export default TravelFlow;