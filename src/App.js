import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home.js";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} exact />
			</Routes>
		</Router>
	);
}

export default App;
