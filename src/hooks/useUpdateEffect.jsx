import { useRef, useEffect } from "react";

const useUpdateEffect = (effect, dependencies = [], ignoreTimes = 1) => {
	const isInitialMount = useRef(0);

	useEffect(() => {
		if (isInitialMount.current < ignoreTimes) {
			isInitialMount.current = isInitialMount.current + 1;
		} else {
			return effect();
		}
	}, dependencies);
};

export default useUpdateEffect;
