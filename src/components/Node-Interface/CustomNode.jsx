// src/components/Node-Interface/CustomNode.jsx
import { useState } from 'react';
import { Handle } from 'reactflow';
import './CustomNode.css';

const CustomNode = ({ data, isConnectable, id, removeNode }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [instructions, setInstructions] = useState(data.instructions || '');

  const handleDelete = () => {
    if (data.removable && removeNode) {
      removeNode(id);
    }
  };

  const toggleEditor = () => {
    setShowEditor((prev) => !prev);
  };

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };

  const saveInstructions = () => {
    data.instructions = instructions; // Save locally (for now)
    setShowEditor(false);
  };

  // Determine if this node should allow editing instructions
  const allowInstructionsEdit =
    data.label !== 'Input' && data.label !== 'Output'; // Restrict editor for Input and Output nodes

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
      {allowInstructionsEdit && (
        <>
          <button className="edit-node-btn" onClick={toggleEditor}>
            Edit Instructions
          </button>
          {showEditor && (
            <div className="editor-popup">
              <textarea
                value={instructions}
                onChange={handleInstructionsChange}
                placeholder="Enter instructions..."
              />
              <button onClick={saveInstructions}>Save</button>
              <button onClick={toggleEditor}>Cancel</button>
            </div>
          )}
        </>
      )}
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
