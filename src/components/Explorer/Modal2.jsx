import { Fragment, useState, useContext } from "react";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// CSS
import "./Modal.scss";

const Modal = ({ operationType, fileOrFolder, fileOrFolderId, handleClose }) => {
	// operationType : 'newFile' | 'newFolder' | 'rename'
	// fileOrFolder : 'file' | 'folder'
	const { filesAndFolders, addFile, addFolder, renameFile, renameFolder, setFolderOpen } =
		useContext(FilesAndFoldersContext);
	const intendedFileOrFolder = filesAndFolders.find((f) => f.id === fileOrFolderId);

	const [name, setName] = useState(operationType === "rename" ? intendedFileOrFolder.name : "");

	const handleCreateFile = (name) => {
		const newFilePath = `${intendedFileOrFolder.path}${intendedFileOrFolder.name}/`;
		addFile(name, newFilePath);
		setFolderOpen(fileOrFolderId);
		handleClose();
	};
	const handleCreateFolder = (name) => {
		const newFolderPath = `${intendedFileOrFolder.path}${intendedFileOrFolder.name}/`;
		addFolder(name, newFolderPath);
		setFolderOpen(fileOrFolderId);
		handleClose();
	};

	const handleRenameFileOrFolder = (newName, fileOrFolder, fileOrFolderId) => {
		if (fileOrFolder === "file") {
			renameFile(newName, fileOrFolderId);
		} else if (fileOrFolder === "folder") {
			renameFolder(newName, fileOrFolderId);
		}
		handleClose();
	};

	// ——— Modal Content ———
	let modalTitle = "";
	if (operationType === "newFile") {
		modalTitle = "Enter a name for the file";
	} else if (operationType === "newFolder") {
		modalTitle = "Enter a name for the folder";
	} else if (operationType === "rename") {
		modalTitle = `Enter a new name for the ${fileOrFolder}`;
	}

	return (
		<Fragment>
			<div id="modalBackdrop" onClick={handleClose}></div>
			<div id="modal">
				<div className="title">{modalTitle} :</div>
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
					{operationType === "rename" && (
						<button onClick={() => handleRenameFileOrFolder(name, fileOrFolder, fileOrFolderId)}>
							Rename {fileOrFolder}
						</button>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default Modal;
