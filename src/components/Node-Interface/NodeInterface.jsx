// src/components/Node-Interface/NodeInterface.jsx
import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import ReactFlow, { // Imports the ReactFlow component and related utilities for building the node-based interface.
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { Link } from "react-router-dom";
import CustomNode from "./CustomNode"; // Import the custom node component
import "reactflow/dist/style.css";
import "./NodeInterface.css";
import { AuthContext } from '../../context/AuthContextBase'; // Import AuthContext

const NodeInterface = () => {
  const { userToken, selectedSessionId } = useContext(AuthContext); // Destructure userToken and selectedSessionId from AuthContext

  // Define initial nodes: Input, Model, Output
  const initialNodes = [
    {
      id: "input",
      type: "custom",
      data: { label: "Input", removable: false },
      position: { x: 0, y: 200 },
    },
    {
      id: "model",
      type: "custom",
      data: { label: "Model (OpenAI)", removable: false },
      position: { x: 250, y: 200 },
    },
    {
      id: "output",
      type: "custom",
      data: { label: "Output", removable: false },
      position: { x: 500, y: 200 },
    },
  ];
  const [lastNodeId, setLastNodeId] = useState("model"); // keep track of the last node ID, start with 'model' as the last node
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); //Utilizes the useEdgesState hook to manage the state of edges, initializing connections between nodes.
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: "e1-2", source: "input", target: "model", animated: true },
    { id: "e2-3", source: "model", target: "output", animated: true },
  ]);
  const [nodeId, setNodeId] = useState(4); // Start from 4 to avoid conflicts

  // Defines a callback function to handle new connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  // function to remove a node and its associated edges after user confirmation
  const removeNode = useCallback(
    (nodeIdToRemove) => {
      if (window.confirm("Are you sure you want to delete this node?")) {
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
      custom: (nodeProps) => (
        <CustomNode {...nodeProps} removeNode={removeNode} />
      ),
    }),
    [removeNode]
  );

  const addNode = () => {
    const newNodeId = `${nodeId}`; // Get the new node's ID

    const newNode = {
      id: newNodeId,
      type: "custom",
      data: { label: `Node ${nodeId}`, removable: true },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };

    setNodes((nds) => nds.concat(newNode));

    setEdges((eds) => {
      // Remove the edge from the last node to 'output'
      const filteredEdges = eds.filter(
        (edge) => !(edge.source === lastNodeId && edge.target === "output")
      );

      // Add new edges: from last node to new node, and from new node to 'output'
      return filteredEdges.concat([
        {
          id: `e${lastNodeId}-${newNodeId}`,
          source: lastNodeId,
          target: newNodeId,
        },
        { id: `e${newNodeId}-output`, source: newNodeId, target: "output" },
      ]);
    });

    setLastNodeId(newNodeId); // Update lastNodeId to the new node
    setNodeId((id) => id + 1); // Increment nodeId for the next node
  };

  useEffect(() => {
    // Load workflow when the component mounts
    if (selectedSessionId) {
      loadWorkflow();
    } else {
      console.error('No session selected.');
    }
  }, [selectedSessionId]);

  const loadWorkflow = async () => {
    if (!userToken || !selectedSessionId) {
      console.error('User token or session ID is missing.');
      return;
    }

    try {
      const response = await fetch(`/api/get-workflow/${selectedSessionId}/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load workflow');
      }
      const data = await response.json();
      setNodes(data.workflow.nodes || []);
      setEdges(data.workflow.edges || []);
    } catch (error) {
      console.error('Error loading workflow:', error);
    }
  };

  const saveWorkflow = async () => {
    if (!userToken || !selectedSessionId) {
      console.error('User token or session ID is missing.');
      return;
    }

    const workflow = { nodes, edges };
    try {
      const response = await fetch(`/api/save-workflow/${selectedSessionId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
        body: JSON.stringify(workflow),
      });
      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }
      console.log('Workflow saved successfully');
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

// console.log('userToken:', userToken);
// console.log('selectedSessionId:', selectedSessionId);
  return (
    <div className="node-interface-container">
      <Link to="/" className="back-link">
        &larr; Back to Chat Interface
      </Link>
      <button onClick={addNode} className="add-node-btn">
        Add Node
      </button>
      <button onClick={saveWorkflow} className="save-workflow-btn">
        Save Workflow
      </button>
      <div style={{ width: "100%", height: "calc(100% - 60px)" }}>
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
