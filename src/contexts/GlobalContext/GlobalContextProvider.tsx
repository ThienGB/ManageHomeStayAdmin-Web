"use client";

import { ReactNode, useState } from "react";
import GlobalContext, { GlobalContextState } from "./GlobalContext";

interface GlobalContextProviderProps {
	children: ReactNode;
}

export function GlobalContextProvider({
	children,
}: GlobalContextProviderProps) {
	const [imageDialog, setImageDialog] = useState({
		open: false,
		images: [],
		currentIndex: 0,
	});

	const openModal = (images: string[], startIndex = 0) => {
		console.log("open image")
		setImageDialog({
			open: true,
			images,
			currentIndex: startIndex,
		});
	};

	const closeModal = () => {
		setImageDialog({
			...imageDialog,
			open: false,
		});
	}


	const value: GlobalContextState = {
		/* Image Dialog */
		imageDialog,
		openModal,
		closeModal,
	};

	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	);
}

export default GlobalContextProvider;
