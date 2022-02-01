// Components
import Explorer from "../Explorer/Explorer";
import Editor from "../Editor/Editor";
import Preview from "../Preview/Preview";

// CSS
import "./Playground.scss";

const Playground = (props) => {
	return (
		<main id="playground">
			<Explorer />
			<Editor />
			<Preview />
		</main>
	);
};

export default Playground;
