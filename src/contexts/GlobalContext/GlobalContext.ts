import { createContext } from "react";

export interface GlobalContextState {
	/* Image Dialog */
	imageDialog: {
		open: boolean;
		images: string[];
		currentIndex: number;
	};

	openModal: (images: string[], startIndex?: number) => void;
	closeModal: () => void;
}

const GlobalContext = createContext<GlobalContextState | null>(null);

export default GlobalContext;
