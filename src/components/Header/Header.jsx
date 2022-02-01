import { useContext } from "react";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// Icons
import { FiBarChart } from "react-icons/fi";

// CSS
import "./Header.scss";

const Header = (props) => {
	const { filesAndFolders } = useContext(FilesAndFoldersContext);
	const tabs = filesAndFolders.filter((f) => f.type === "file" && f.open === true);
	const activeTab = tabs.find((file) => file.active === true);
	let activeTabName = activeTab ? activeTab.name : "----";

	return (
		<header id="header">
			<div className="left">
				<div className="menu flex-center">
					<button>
						<FiBarChart />
					</button>
				</div>
				<div className="logo">
					<h1>CodePlaybox</h1>
				</div>
			</div>

			<div className="center">
				<h2>{activeTabName}</h2>
			</div>

			<div className="right"></div>
		</header>
	);
};

export default Header;
