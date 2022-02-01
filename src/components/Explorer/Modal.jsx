import { Fragment, useState, useContext } from "react";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// CSS
import "./Modal.scss";

const Modal = ({ operationType, handleClose }) => {
	const { addFile, addFolder } = useContext(FilesAndFoldersContext);
	const [name, setName] = useState("");

	const handleCreateFile = (name) => {
		addFile(name, "/");
		handleClose();
	};
	const handleCreateFolder = (name) => {
		addFolder(name, "/");
		handleClose();
	};

	// ——— Modal Content ———
	let modalFileOrFolder = "";
	if (operationType === "newFile") {
		modalFileOrFolder = "file";
	} else if (operationType === "newFolder") {
		modalFileOrFolder = "folder";
	}

	return (
		<Fragment>
			<div id="modalBackdrop" onClick={handleClose}></div>
			<div id="modal">
				<div className="title">Enter a name for the {modalFileOrFolder} :</div>
				<div className="input">
					<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div className="buttons">
					<button onClick={handleClose}>Cancel</button>
					{operationType === "newFile" && (
						<button onClick={() => handleCreateFile(name)}>Create file</button>
					)}
					{operationType === "newFolder" && (
						<button onClick={() => handleCreateFolder(name)}>Create folder</button>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default Modal;
