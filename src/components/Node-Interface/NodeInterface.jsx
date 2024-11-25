// src/components/NodeInterface.jsx
import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { Link } from 'react-router-dom';
import CustomNode from './CustomNode'; // Import the custom node component
import 'reactflow/dist/style.css';
import './NodeInterface.css';

const NodeInterface = () => {
  // Define initial nodes: Input, Model, Output
  const initialNodes = [
    {
      id: 'input',
      type: 'custom',
      data: { label: 'Input', removable: false },
      position: { x: 0, y: 200 },
    },
    {
      id: 'model',
      type: 'custom',
      data: { label: 'Model (OpenAI)', removable: false },
      position: { x: 250, y: 200 },
    },
    {
      id: 'output',
      type: 'custom',
      data: { label: 'Output', removable: false },
      position: { x: 500, y: 200 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: 'input', target: 'model', animated: true },
    { id: 'e2-3', source: 'model', target: 'output', animated: true },
  ]);
  const [nodeId, setNodeId] = useState(4); // Start from 4 to avoid conflicts

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Define removeNode with useCallback to ensure it's stable
  const removeNode = useCallback(
    (nodeIdToRemove) => {
      if (window.confirm('Are you sure you want to delete this node?')) {
        setNodes((nds) => nds.filter((node) => node.id !== nodeIdToRemove));
        setEdges((eds) =>
          eds.filter(
            (edge) =>
              edge.source !== nodeIdToRemove && edge.target !== nodeIdToRemove
          )
        );
      }
    },
    [setNodes, setEdges]
  );

  // Memoize nodeTypes to prevent recreation on every render
  const nodeTypes = useMemo(
    () => ({
      custom: (nodeProps) => <CustomNode {...nodeProps} removeNode={removeNode} />,
    }),
    [removeNode]
  );

  const addNode = () => {
    const newNode = {
      id: `${nodeId}`,
      type: 'custom',
      data: { label: `Node ${nodeId}`, removable: true },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat([
        { id: `e${nodeId}-model`, source: 'model', target: `${nodeId}` },
        { id: `e${nodeId}-output`, source: `${nodeId}`, target: 'output' },
      ])
    );
    setNodeId((id) => id + 1);
  };

  return (
    <div className="node-interface-container">
      <Link to="/" className="back-link">
        &larr; Back to Chat Interface
      </Link>
      <button onClick={addNode} className="add-node-btn">
        Add Node
      </button>
      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default NodeInterface;
