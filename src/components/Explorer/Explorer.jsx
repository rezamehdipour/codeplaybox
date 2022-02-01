import { useState, useContext } from "react";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// Components
import FileOrFolder from "./FileOrFolder";
import Modal from "./Modal";

// Icons
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { FaFolderPlus } from "react-icons/fa";

// CSS
import "./Explorer.scss";

const Explorer = (props) => {
	const { filesAndFolders } = useContext(FilesAndFoldersContext);

	const [modal, setModal] = useState({
		open: false,
		operationType: false,
	});
	const handleSetModal = (open, operationType) => {
		setModal((state) => {
			let newState = { ...state };
			newState.open = open;
			newState.operationType = operationType;
			return newState;
		});
	};
	const handleCloseModal = () => {
		setModal({
			open: false,
			operationType: false,
		});
	};

	return (
		<aside id="explorer">
			{/* ——— Top ——— */}
			<div className="top">
				<div className="operations">
					<button title="New File" onClick={() => handleSetModal(true, "newFile")}>
						<BsFillFileEarmarkPlusFill />
					</button>
					<button title="New Folder" onClick={() => handleSetModal(true, "newFolder")}>
						<FaFolderPlus />
					</button>
				</div>
			</div>

			{/* ——— Empty ——— */}
			{filesAndFolders.length === 0 && (
				<div className="empty">
					<p>Empty!</p>
				</div>
			)}

			{/* ——— Not-Empty ——— */}
			{filesAndFolders.length > 0 && (
				<div className="filesAndFolders">
					{filesAndFolders
						.filter((fileOrFolder) => fileOrFolder.path === "/")
						.sort((a, b) => (b.type === "folder" ? 1 : -1))
						.map((fileOrFolder) => (
							<FileOrFolder key={fileOrFolder.id} {...fileOrFolder} />
						))}
				</div>
			)}

			{modal.open && <Modal operationType={modal.operationType} handleClose={handleCloseModal} />}
		</aside>
	);
};

export default Explorer;
