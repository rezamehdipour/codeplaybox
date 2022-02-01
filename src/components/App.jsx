import { Fragment } from "react";

// Components
import Header from "./Header/Header";
import Playground from "./Playground/Playground";

const App = (props) => {
	return (
		<Fragment>
			<Header />
			<Playground />
		</Fragment>
	);
};

export default App;
