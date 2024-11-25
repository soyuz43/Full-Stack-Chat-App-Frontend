// src/components/CustomNode.jsx
import { Handle } from 'reactflow';
import './CustomNode.css'; // Ensure you have appropriate styling

const CustomNode = ({ data, isConnectable, id, removeNode }) => {
  const handleDelete = () => {
    if (data.removable && removeNode) {
      removeNode(id);
    }
  };

  return (
    <div className="custom-node">
      <Handle
        type="target"
        position="left"
        style={{ top: '50%', background: '#555' }}
        isConnectable={isConnectable}
      />
      <div className="custom-node-content">
        <span>{data.label}</span>
        {data.removable && (
          <button className="delete-node-btn" onClick={handleDelete}>
            &times;
          </button>
        )}
      </div>
      <Handle
        type="source"
        position="right"
        style={{ top: '50%', background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default CustomNode;
