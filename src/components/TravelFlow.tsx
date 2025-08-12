import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import CountryNodeComponent from './CountryNode';
import { CountryNodeClass } from '../core/CountryNodeClass';

const nodeTypes = {
  countryNode: CountryNodeComponent,
};

const TravelFlow = () => {
  const spainNode = new CountryNodeClass('1', { x: 250, y: 100 }, {
    name: 'Spain',
    code: 'ES',
    flag: 'flag1'
  });

  const franceNode = new CountryNodeClass('2', { x: 250, y: 300 }, {
    name: 'France',
    code: 'FR',
    flag: 'flag2'
  });

  const nodes = [
    spainNode.toReactFlowNode(),
    franceNode.toReactFlowNode()
  ];

  const edges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep'
    }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
};

export default TravelFlow;