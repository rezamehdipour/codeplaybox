import React from "react";
import ReactDOM from "react-dom";

// Context
import { FilesAndFoldersContextProvider } from "./context/filesAndFolders";

// Components
import App from "./components/App";

// CSS
import "./predefined.css";
import "./reset.css";
import "./index.scss";

ReactDOM.render(
	<React.StrictMode>
		<FilesAndFoldersContextProvider>
			<App />
		</FilesAndFoldersContextProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
