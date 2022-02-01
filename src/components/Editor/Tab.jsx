import { useContext } from "react";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// Icons
import { MdClose } from "react-icons/md";

const Tab = ({ fileId }) => {
	const { filesAndFolders, setFileActive, setFileClose } = useContext(FilesAndFoldersContext);
	const intendedFile = filesAndFolders.find(
		(fileOrFolder) => fileOrFolder.type === "file" && fileOrFolder.id === fileId
	);
	const { name: fileName, active: isFileActive } = intendedFile;

	return (
		<div className={`tab ${isFileActive ? "active" : ""}`}>
			<div className="name" onClick={() => setFileActive(fileId)}>
				{fileName}
			</div>
			<div className="close" onClick={() => setFileClose(fileId)}>
				<MdClose />
			</div>
		</div>
	);
};

export default Tab;
