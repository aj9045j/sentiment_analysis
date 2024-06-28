import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Movie from './pages/Movie';
import Amazon from './pages/Amazon';
import Election from './pages/Election';
import Twitter from './pages/Twitter';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path="/movie" element={<Movie />} />
				<Route path="/amazon" element={<Amazon />} />
				<Route path='/twitter' element={<Twitter />} />
				<Route path='/election' element={<Election />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;