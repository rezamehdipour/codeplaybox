import { Fragment, useContext, useState } from "react";
import useUpdateEffect from "../../hooks/useUpdateEffect";

// Context
import FilesAndFoldersContext from "../../context/filesAndFolders";

// Ace Editor
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-tsx";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-monokai";

// Components
import Tab from "./Tab";

// Icons
import { GiEmptyChessboard } from "react-icons/gi";

// CSS
import "./Editor.scss";

const Editor = (props) => {
	const { filesAndFolders, setFileContent } = useContext(FilesAndFoldersContext);
	const tabs = filesAndFolders.filter((f) => f.type === "file" && f.open === true);
	const activeTab = tabs.find((file) => file.active === true);
	let activeTabId = activeTab ? activeTab.id : "";
	let activeTabExtension = activeTab ? activeTab.name.split(".").at(-1) : "txt";

	const [fileContent, setTheFileContent] = useState(activeTab ? activeTab.content : "");
	const handleChange = (newContent) => setTheFileContent(newContent);

	// Change Active tab content when switching between tabs
	useUpdateEffect(() => {
		if (activeTab) {
			setTheFileContent(activeTab.content);
		}
	}, [activeTabId]);

	useUpdateEffect(() => {
		const timeout = setTimeout(() => {
			setFileContent(fileContent, activeTab.id);
		}, 500);

		return () => clearTimeout(timeout);
	}, [fileContent]);

	// ——— Ace Editor ———
	let editorLanguage = "plain_text";
	const editorLanguages = {
		txt: "plain_text",
		svg: "xml",
		html: "html",
		css: "css",
		scss: "sass",
		sass: "sass",
		js: "javascript",
		jsx: "jsx",
		json: "json",
		ts: "typescript",
		tsx: "tsx",
		py: "python",
		java: "java",
		rb: "ruby",
		go: "golang",
		cs: "csharp",
	};
	if (editorLanguages[activeTabExtension]) {
		editorLanguage = editorLanguages[activeTabExtension];
	}

	return (
		<div id="editor">
			{tabs.length === 0 && (
				<div className="empty">
					<div className="center">
						<div className="icon">
							<GiEmptyChessboard />
						</div>
						<div className="text">
							<p>No tab is open!</p>
						</div>
					</div>
				</div>
			)}

			{tabs.length > 0 && (
				<Fragment>
					<div className="tabs">
						{tabs.map(({ id }) => (
							<Tab key={id} fileId={id} />
						))}
					</div>
					<div className="editor">
						<AceEditor
							placeholder="..."
							theme="monokai"
							mode={editorLanguage}
							name="aceEditorTab"
							onChange={handleChange}
							fontSize={15}
							showPrintMargin={false}
							showGutter={true}
							highlightActiveLine={true}
							value={fileContent}
							setOptions={{
								showLineNumbers: true,
								tabSize: 2,
							}}
						/>
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default Editor;
