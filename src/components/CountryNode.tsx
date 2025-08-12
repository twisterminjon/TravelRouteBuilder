import { Handle, Position } from 'reactflow';
import { Country } from '../types';

interface CountryNodeProps {
  data: Country;
}

const CountryNode = ({ data }: CountryNodeProps) => {
  const nodeStyles = {
    padding: '10px',
    border: '2px solid #1e293b',
    borderRadius: '8px',
    backgroundColor: 'white',
    minWidth: '150px',
    textAlign: 'center' as const
  };

  const flagStyles = {
    fontSize: '24px',
    marginBottom: '5px'
  };

  const nameStyles = {
    fontWeight: 'bold' as const,
    fontSize: '14px'
  };

  const codeStyles = {
    fontSize: '12px',
    color: '#666'
  };

  return (
    <div style={nodeStyles}>
      <div style={flagStyles}>
        {data.flag}
      </div>
      <div style={nameStyles}>
        {data.name}
      </div>
      <div style={codeStyles}>
        {data.code}
      </div>
      
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CountryNode;