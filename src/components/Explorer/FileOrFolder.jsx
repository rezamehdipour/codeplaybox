import { useState, useContext, Fragment } from "react";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// Components
import Modal2 from "./Modal2";

// Icon
import { FcFile, FcFolder, FcOpenedFolder } from "react-icons/fc";
import { BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { FaFolderPlus, FaTrash } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";

const Childs = ({ childs }) => {
	return (
		<div className="children">
			{childs
				.sort((a, b) => (b.type === "folder" ? 1 : -1))
				.map((child) => (
					<FileOrFolder key={child.id} {...child} />
				))}
		</div>
	);
};

const FileOrFolder = ({ id, name, type, path, open, active = false, content = "" }) => {
	const { filesAndFolders, deleteFolder, deleteFile, setFolderOpen, setFolderClose, setFileOpen } =
		useContext(FilesAndFoldersContext);
	const handleToggleFolderOpen = (folderId, open) => {
		open ? setFolderClose(folderId) : setFolderOpen(folderId);
	};

	const [modal, setModal] = useState({
		open: false,
		operationType: false,
		fileOrFolder: false,
		fileOrFolderId: false,
	});
	const handleSetModal = (open, operationType, fileOrFolder, fileOrFolderId) => {
		setModal((state) => {
			const newState = { ...state };
			newState.open = open;
			newState.operationType = operationType;
			newState.fileOrFolder = fileOrFolder;
			newState.fileOrFolderId = fileOrFolderId;

			return newState;
		});
	};
	const handleCloseModal = () => {
		setModal({
			open: false,
			operationType: false,
			fileOrFolder: false,
			fileOrFolderId: false,
		});
	};

	// ——— Folder ———
	if (type === "folder") {
		let childsPath = `${path}${name}/`;
		let childs = filesAndFolders.filter((fileOrFolder) => fileOrFolder.path === childsPath);

		let icon = <FcFolder />;
		if (open) {
			icon = <FcOpenedFolder />;
		}

		return (
			<Fragment>
				<div className="folder">
					<div className="self">
						<div
							className="info"
							onClick={() => handleToggleFolderOpen(id, open)}
							onContextMenu={(e) => console.log(e.preventDefault())}
						>
							<div className="icon">{icon}</div>
							<div className="name">
								<span>{name}</span>
							</div>
						</div>

						<div className="operations">
							<button
								title="New File"
								onClick={() => handleSetModal(true, "newFile", "folder", id)}
							>
								<BsFillFileEarmarkPlusFill />
							</button>
							<button
								title="New Folder"
								onClick={() => handleSetModal(true, "newFolder", "folder", id)}
							>
								<FaFolderPlus />
							</button>
							<button
								title="Rename"
								onClick={() => handleSetModal(true, "rename", "folder", id)}
							>
								<RiPencilFill />
							</button>
							<button title="Delete" onClick={() => deleteFolder(id)}>
								<FaTrash />
							</button>
						</div>
					</div>
					{open && childs.length > 0 && <Childs childs={childs} />}
				</div>
				{modal.open && <Modal2 {...modal} handleClose={handleCloseModal} />}
			</Fragment>
		);

		// ——— File ———
	} else if (type === "file") {
		let icon = <FcFile />;

		return (
			<Fragment>
				<div className="file">
					<div className="self">
						<div className="info" onClick={() => setFileOpen(id)}>
							<div className="icon">{icon}</div>
							<div className="name">
								<span>{name}</span>
							</div>
						</div>

						<div className="operations">
							<button title="Rename" onClick={() => handleSetModal(true, "rename", "file", id)}>
								<RiPencilFill />
							</button>
							<button title="Delete" onClick={() => deleteFile(id)}>
								<FaTrash />
							</button>
						</div>
					</div>
				</div>
				{modal.open && <Modal2 {...modal} handleClose={handleCloseModal} />}
			</Fragment>
		);
	}
};

export default FileOrFolder;
