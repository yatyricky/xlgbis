import "./App.css";
import "./Polyfill.js"
import Node from "./UI/Node.js";
import System from "./System.js";
import Login from "./Objects/Login.js"
import App from "./Objects/App.js"

let system = System.Inst
system.AddObject(new App())
system.AddObject(new Login())

system.Awake()
system.Start()

window.DBGRoot = Node.Root
