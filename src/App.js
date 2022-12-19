import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = () => {
		fetch("https://www.mocky.io/v2/5ba8efb23100007200c2750c")
			.then((response) => response.json())
			.then((data) => setUsers(data));
	};

	return (
		<div className="container-fluid px-0">
			<header className="text-center py-3 bg-light border-bottom">
				<h2>Search App</h2>
			</header>

			<div className="container">
				<div className="row my-5">{users.length > 0 && <SearchBar data={users} />}</div>
			</div>
		</div>
	);
}

export default App;
