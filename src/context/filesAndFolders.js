import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Database
import db from "../database/database";

// Initial State
let initialState = [];

const FilesAndFoldersContext = React.createContext();
export function FilesAndFoldersContextProvider({ children }) {
	const [filesAndFolders, setFilesAndFolders] = useState(initialState);

	/*
	const [filesAndFolders, setFilesAndFolders] = useState([
		{
			id: "1",
			name: "public",
			type: "folder",
			path: "/",
			open: false,
		},
		{
			id: "2",
			name: "index.html",
			type: "file",
			path: "/public/",
			open: false,
			active: false,
			content: "",
		},
		{
			id: "3",
			name: "src",
			type: "folder",
			path: "/",
			open: false,
		},
		{
			id: "4",
			name: "components",
			type: "folder",
			path: "/src/",
			open: false,
		},
		{
			id: "5",
			name: "context",
			type: "folder",
			path: "/src/components/",
			open: false,
		},
		{
			id: "6",
			name: "App.jsx",
			type: "file",
			path: "/src/components/",
			content: "",
			open: false,
			active: false,
		},
		{
			id: "7",
			name: "index.js",
			type: "file",
			path: "/src/",
			open: false,
			active: false,
			content: "",
		},
		{
			id: "8",
			name: "package.json",
			type: "file",
			path: "/",
			open: false,
			active: false,
			content: "lkajaslkdajsklk",
		},
	]);
	*/

	useEffect(() => {
		const setFilesAndFoldersFromDatabase = async () => {
			const filesAndFoldersInDatabase = await db.collection("filesAndFolders").get();
			if (filesAndFoldersInDatabase) {
				setFilesAndFolders(filesAndFoldersInDatabase);
			}
		};
		setFilesAndFoldersFromDatabase();
	}, []);

	// useEffect(() => {
	// 	console.log("filesAndFolders Updated :", filesAndFolders);
	// }, [filesAndFolders]);

	const findFileIndexById = (array, fileId) => {
		return array.findIndex((fileOrFolder) => fileOrFolder.type === "file" && fileOrFolder.id === fileId);
	};
	const findFolderIndexById = (array, fileOrFolderId) => {
		return array.findIndex(
			(fileOrFolder) => fileOrFolder.type === "folder" && fileOrFolder.id === fileOrFolderId
		);
	};

	// ——— Add File ———
	const addFile = (name, path) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			if (name !== "") {
				if (
					newState.find(
						(fileOrFolder) =>
							fileOrFolder.type === "file" &&
							fileOrFolder.name === name &&
							fileOrFolder.path === path
					) === undefined
				) {
					let newFile = {
						id: uuidv4(),
						name: name,
						type: "file",
						path: path,
						open: false,
						active: false,
						content: "",
					};
					newState.push(newFile);

					// Add File to Database
					db.collection("filesAndFolders").add(newFile);
				}
			}

			return newState;
		});
	};

	// ——— Add Folder ———
	const addFolder = (name, path) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			if (name !== "") {
				if (
					newState.find(
						(fileOrFolder) =>
							fileOrFolder.type === "folder" &&
							fileOrFolder.name === name &&
							fileOrFolder.path === path
					) === undefined
				) {
					let newFolder = {
						id: uuidv4(),
						name: name,
						type: "folder",
						path: path,
						open: false,
					};
					newState.push(newFolder);

					// Add Folder to Database
					db.collection("filesAndFolders").add(newFolder);
				}
			}

			return newState;
		});
	};

	// ——— Rename File ———
	const renameFile = (newName, fileId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFileIndex = findFileIndexById(newState, fileId);
			const intendedFile = newState[intendedFileIndex];
			if (newName !== "") {
				if (
					newState.find(
						(fileOrFolder) =>
							fileOrFolder.name === newName && fileOrFolder.path === intendedFile.path
					) === undefined
				) {
					newState[intendedFileIndex].name = newName;

					// Upate name in Database
					db.collection("filesAndFolders").doc({ id: fileId }).update({
						name: newName,
					});
				}
			}

			return newState;
		});
	};

	// ——— Rename Folder ———
	const renameFolder = (newName, folderId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFolderIndex = findFolderIndexById(newState, folderId);
			const intendedFolder = newState[intendedFolderIndex];
			if (newName !== "") {
				if (
					newState.find(
						(fileOrFolder) =>
							fileOrFolder.name === newName && fileOrFolder.path === intendedFolder.path
					) === undefined
				) {
					const intendedFolderChildrenNewPath = `${intendedFolder.path}${newName}/`;
					const intendedFolderChildrenPath = `${intendedFolder.path}${intendedFolder.name}/`;
					const intendedFolderChildrenPathRegex = new RegExp(`^${intendedFolderChildrenPath}`);
					const intendedFolderChildren = newState.filter((fileOrFolder) =>
						intendedFolderChildrenPathRegex.test(fileOrFolder.path)
					);
					console.log(intendedFolderChildren);
					for (const child of intendedFolderChildren) {
						const childIndex = newState.findIndex(
							(fileOrFolder) => fileOrFolder.type === child.type && fileOrFolder.id === child.id
						);

						// Set new path for child
						newState[childIndex].path = newState[childIndex].path.replace(
							intendedFolderChildrenPathRegex,
							intendedFolderChildrenNewPath
						);

						// Set new path for child in Database
						db.collection("filesAndFolders").doc({ id: child.id }).update({
							path: intendedFolderChildrenNewPath,
						});
					}

					newState[intendedFolderIndex].name = newName;

					// Upate name in Database
					db.collection("filesAndFolders").doc({ id: folderId }).update({
						name: newName,
					});
				}
			}

			return newState;
		});
	};

	// ——— Delete File ———
	const deleteFile = (fileId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFileIndex = findFileIndexById(newState, fileId);
			newState.splice(intendedFileIndex, 1);

			// Delete File from Database
			db.collection("filesAndFolders").doc({ id: fileId }).delete();

			return newState;
		});
	};

	// ——— Delete Folder ———
	const deleteFolder = (folderId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFolderIndex = findFolderIndexById(newState, folderId);
			const intendedFolder = newState[intendedFolderIndex];
			const intendedFolderChildrenPath = `${intendedFolder.path}${intendedFolder.name}/`;
			const intendedFolderChildrenPathRegex = new RegExp(`^${intendedFolderChildrenPath}`);
			const intendedFolderChildren = newState.filter((fileOrFolder) =>
				intendedFolderChildrenPathRegex.test(fileOrFolder.path)
			);
			for (const child of intendedFolderChildren) {
				const childIndex = newState.findIndex(
					(fileOrFolder) => fileOrFolder.type === child.type && fileOrFolder.id === child.id
				);

				// Delete File/Folder from state
				newState.splice(childIndex, 1);

				// Delete File/Folder from Database
				db.collection("filesAndFolders").doc({ id: child.id }).delete();
			}

			// Delete Folder from state
			newState.splice(intendedFolderIndex, 1);

			// Delete Folder from Database
			db.collection("filesAndFolders").doc({ id: folderId }).delete();

			return newState;
		});
	};

	// ——— Set a File Open ———
	const setFileOpen = (fileId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFileIndex = findFileIndexById(newState, fileId);
			if (intendedFileIndex !== -1) {
				// Set All Of Files Active-state to false
				for (let i = 0; i < newState.length; i++) {
					if (newState[i].type === "file") {
						newState[i].active = false;
					}
				}

				newState[intendedFileIndex].open = true;
				newState[intendedFileIndex].active = true;
			}

			// Set new Data to Database
			db.collection("filesAndFolders").set(newState);

			return newState;
		});
	};

	// ——— Set a File Close ———
	const setFileClose = (fileId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFileIndex = findFileIndexById(newState, fileId);
			if (intendedFileIndex !== -1) {
				newState[intendedFileIndex].open = false;

				if (newState[intendedFileIndex].active === true) {
					const tabs = newState.filter(
						(fileOrFolder) => fileOrFolder.type === "file" && fileOrFolder.open === true
					);
					if (tabs.length > 0) {
						const newActiveFileIndex = findFileIndexById(newState, tabs[0].id);
						newState[newActiveFileIndex].active = true;
					}

					newState[intendedFileIndex].active = false;
				}

				// Add File to Database
				db.collection("filesAndFolders").doc({ id: fileId }).update({
					open: false,
					active: false,
				});
			}

			return newState;
		});
	};

	// ——— Set Folder Open ———
	const setFolderOpen = (folderId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFolderIndex = findFolderIndexById(newState, folderId);
			if (intendedFolderIndex !== -1) {
				newState[intendedFolderIndex].open = true;

				// Upate open status in Database
				db.collection("filesAndFolders").doc({ id: folderId }).update({
					open: true,
				});
			}

			return newState;
		});
	};

	// ——— Set Folder Close ———
	const setFolderClose = (folderId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFolderIndex = findFolderIndexById(newState, folderId);
			if (intendedFolderIndex !== -1) {
				newState[intendedFolderIndex].open = false;

				// Upate open status in Database
				db.collection("filesAndFolders").doc({ id: folderId }).update({
					open: false,
				});
			}

			return newState;
		});
	};

	// ——— Set a File Active ———
	const setFileActive = (fileId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFileIndex = findFileIndexById(newState, fileId);

			if (intendedFileIndex !== -1) {
				if (newState[intendedFileIndex].active !== true) {
					// Set All Of Files Active-state to false
					for (let i = 0; i < newState.length; i++) {
						if (newState[i].type === "file") {
							newState[i].active = false;
						}
					}

					// Set intended File Active-state to true
					newState[intendedFileIndex].active = true;

					// Set new Data to Database
					db.collection("filesAndFolders").set(newState);
				}
			}

			return newState;
		});
	};

	// ——— Set File Content ———
	const setFileContent = (content, fileId) => {
		setFilesAndFolders((state) => {
			let newState = [...state];
			const intendedFileIndex = findFileIndexById(newState, fileId);

			if (intendedFileIndex !== -1) {
				// Upate file content in Database
				db.collection("filesAndFolders").doc({ id: fileId }).update({
					content: content,
				});
			}

			return newState;
		});
	};

	return (
		<FilesAndFoldersContext.Provider
			value={{
				filesAndFolders,
				addFile,
				addFolder,
				renameFile,
				renameFolder,
				deleteFile,
				deleteFolder,
				setFileOpen,
				setFileClose,
				setFolderOpen,
				setFolderClose,
				setFileActive,
				setFileContent,
			}}
		>
			{children}
		</FilesAndFoldersContext.Provider>
	);
}

export default FilesAndFoldersContext;
