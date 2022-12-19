import { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

const useKeyPress = (targetKey) => {
	const [keyPressed, setKeyPressed] = useState(false);

	useEffect(() => {
		const downHandler = ({ key }) => {
			if (key === targetKey) {
				setKeyPressed(true);
			}
		};

		const upHandler = ({ key }) => {
			if (key === targetKey) {
				setKeyPressed(false);
			}
		};

		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);

		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	}, [targetKey]);

	return keyPressed;
};

function SearchBar(props) {
	const originalArray = props.data;
	const [users, setUsers] = useState(props.data);
	const [searchText, setSearchText] = useState("");
	const [cursor, setCursor] = useState(0);
	const arrowUpPressed = useKeyPress("ArrowUp");
	const arrowDownPressed = useKeyPress("ArrowDown");
	const selectedItemRef = useRef([]);
	selectedItemRef.current = [];

	useEffect(() => {
		if (arrowUpPressed) {
			setCursor((prevValue) => {
				const currentValue = prevValue !== 0 ? prevValue - 1 : users.length - 1;
				selectedItemRef.current[currentValue].scrollIntoView({ behavior: "smooth", block: "center" });
				return currentValue;
			});
		}
	}, [arrowUpPressed, users]);

	useEffect(() => {
		if (arrowDownPressed) {
			setCursor((prevValue) => {
				const currentValue = prevValue !== users.length - 1 ? prevValue + 1 : 0;
				selectedItemRef.current[currentValue].scrollIntoView({ behavior: "smooth", block: "center" });
				return currentValue;
			});
		}
	}, [arrowDownPressed, users]);

	const addRef = (element) => {
		if (element && !selectedItemRef.current.includes(element)) {
			selectedItemRef.current.push(element);
		}
	};

	const handleFilter = (event) => {
		const search = event.target.value;
		setSearchText(event.target.value);

		const filteredData = originalArray.filter((user, index) => {
			const isItemFound = user.items.filter((item) => item.toLowerCase().includes(search.toLocaleLowerCase()));
			user["isItemFound"] = isItemFound.length > 0 ? true : false;

			return (
				user.name.toLowerCase().includes(search.toLowerCase()) ||
				user.address.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
				user.id.toLowerCase().includes(search.toLocaleLowerCase()) ||
				user.pincode.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
				isItemFound.length > 0
			);
		});

		setUsers(filteredData);
	};

	const highlightText = (value) => {
		const split = value.split(new RegExp(`(${searchText})`, "gi"));
		return (
			<span>
				{split.map((word, i) => (
					<span key={i} style={word.toLowerCase() === searchText.toLowerCase() ? { fontWeight: "bold", color: "cornflowerblue" } : {}}>
						{word}
					</span>
				))}
			</span>
		);
	};

	return (
		<div className="col-sm-12">
			<div className="my-2">
				<input className="form-control" placeholder="Search users by ID, Name, Address, Pincode..." onChange={handleFilter} />
			</div>

			<div className={`col-sm-12 search-box-height ${searchText.length > 0 && users.length === 0 ? "d-none" : ""}`}>
				{searchText.length > 0 &&
					users.map((user, index) => {
						return (
							<div className={`card py-3 px-4 ${cursor === index ? "active" : ""}`} key={index} ref={addRef} onMouseMove={() => setCursor(index)}>
								<p className="m-0 fs-3">{highlightText(user.id)}</p>
								<p className="m-0 fst-italic">{highlightText(user.name)}</p>
								{user.isItemFound && (
									<>
										<hr className="my-1" />
										<ul className="m-0">
											<li>{`"${searchText}" found in items`}</li>
										</ul>
										<hr className="my-1" />
									</>
								)}
								<p className="m-0">{highlightText(user.address)}</p>
							</div>
						);
					})}
			</div>

			<div className="text-center">{searchText?.length > 0 && users.length === 0 && "No record found"}</div>
		</div>
	);
}

export default SearchBar;
