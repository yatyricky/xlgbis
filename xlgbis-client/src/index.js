import "./App.css";
import "./Polyfill.js"
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Node from "./UI/Node.js";
import RootNode from "./UI/RootNode.js";
import Rect from "./Maths/Rect.js";

const domNode = document.getElementById('root');
const root = createRoot(domNode);

Node.Root = new Node("root")
Node.AutoBuild = true
Node.Root.parent = { size: new Rect() }
window.DBGRoot = Node.Root

root.render(<App />);
