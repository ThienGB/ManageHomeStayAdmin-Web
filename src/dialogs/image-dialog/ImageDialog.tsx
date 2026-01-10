"use client";

import { useGlobalContext } from "@/contexts/GlobalContext/useGlobalContext";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
	Backdrop,
	Box,
	Fade,
	IconButton,
	Modal,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function ImageDialog() {
	const { imageDialog, closeModal } = useGlobalContext();
	const { open, images, currentIndex } = imageDialog;

	const [currentIndexState, setCurrentIndexState] = useState<number>(
		currentIndex || 0
	);

	const onChangeIndex = (index: number) => {
		setCurrentIndexState(index);
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!open) return;

			switch (event.key) {
				case "Escape":
					closeModal();
					break;
				case "ArrowLeft":
					handlePrevious();
					break;
				case "ArrowRight":
					handleNext();
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, currentIndexState, images.length]);

	const handlePrevious = () => {
		onChangeIndex(
			currentIndexState === 0 ? images.length - 1 : currentIndexState - 1
		);
	};

	const handleNext = () => {
		onChangeIndex(
			currentIndexState === images.length - 1 ? 0 : currentIndexState + 1
		);
	};

	if (!images || images.length === 0) return null;

	return (
		<Modal
			open={open}
			onClose={closeModal}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
					sx: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
				},
			}}
		>
			<Fade in={open}>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						outline: "none",
					}}
				>
					{/* Close Button */}
					<IconButton
						onClick={closeModal}
						sx={{
							position: "absolute",
							top: 16,
							right: 16,
							color: "white",
							backgroundColor: "rgba(255, 255, 255, 0.1)",
							"&:hover": {
								backgroundColor: "rgba(255, 255, 255, 0.2)",
							},
							zIndex: 2,
						}}
					>
						<FuseSvgIcon>lucide:x</FuseSvgIcon>
					</IconButton>

					{/* Image Counter */}
					<Box
						sx={{
							position: "absolute",
							top: 16,
							left: "50%",
							transform: "translateX(-50%)",
							backgroundColor: "rgba(0, 0, 0, 0.6)",
							color: "white",
							px: 3,
							py: 1,
							borderRadius: 2,
							zIndex: 2,
						}}
					>
						<Typography variant="body1" fontWeight="medium">
							{currentIndexState + 1} / {images.length}
						</Typography>
					</Box>

					{/* Main Image Container */}
					<Box
						sx={{
							flex: 1,
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							px: { xs: 2, md: 8 },
							py: 2,
							mb: "120px",
						}}
					>
						{/* Previous Button */}
						{images.length > 1 && (
							<IconButton
								onClick={handlePrevious}
								sx={{
									position: "absolute",
									left: { xs: 8, md: 24 },
									color: "white",
									backgroundColor: "rgba(255, 255, 255, 0.9)",
									"&:hover": {
										backgroundColor:
											"rgba(255, 255, 255, 1)",
									},
									width: 48,
									height: 48,
								}}
							>
								<FuseSvgIcon>lucide:chevron-left</FuseSvgIcon>
							</IconButton>
						)}

						{/* Main Image */}
						<Box
							component="img"
							src={images[currentIndexState]}
							alt={`Image ${currentIndexState + 1}`}
							sx={{
								maxWidth: "100%",
								maxHeight: "100%",
								objectFit: "contain",
								borderRadius: 2,
								userSelect: "none",
							}}
						/>

						{/* Next Button */}
						{images.length > 1 && (
							<IconButton
								onClick={handleNext}
								sx={{
									position: "absolute",
									right: { xs: 8, md: 24 },
									color: "white",
									backgroundColor: "rgba(255, 255, 255, 0.9)",
									"&:hover": {
										backgroundColor:
											"rgba(255, 255, 255, 1)",
									},
									width: 48,
									height: 48,
								}}
							>
								<FuseSvgIcon>lucide:chevron-right</FuseSvgIcon>
							</IconButton>
						)}
					</Box>

					{/* Thumbnail Strip */}
					{images.length > 1 && (
						<Box
							sx={{
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								backgroundColor: "rgba(0, 0, 0, 0.8)",
								py: 2,
								px: { xs: 2, md: 4 },
								display: "flex",
								justifyContent: "center",
								overflowX: "auto",
								"&::-webkit-scrollbar": {
									height: 8,
								},
								"&::-webkit-scrollbar-thumb": {
									backgroundColor: "rgba(255, 255, 255, 0.3)",
									borderRadius: 4,
								},
							}}
						>
							<Box
								sx={{
									display: "flex",
									gap: 2,
									alignItems: "center",
								}}
							>
								{images.map((image, index) => (
									<Box
										key={index}
										component="button"
										onClick={() => onChangeIndex(index)}
										sx={{
											width: 80,
											height: 80,
											flexShrink: 0,
											border:
												index === currentIndexState
													? "3px solid white"
													: "3px solid transparent",
											borderRadius: 1,
											overflow: "hidden",
											cursor: "pointer",
											opacity:
												index === currentIndexState
													? 1
													: 0.6,
											transition: "all 0.3s ease",
											transform:
												index === currentIndexState
													? "scale(1.1)"
													: "scale(1)",
											"&:hover": {
												opacity: 1,
												transform: "scale(1.05)",
											},
											padding: 0,
											background: "none",
										}}
									>
										<Box
											component="img"
											src={image}
											alt={`Thumbnail ${index + 1}`}
											sx={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												display: "block",
											}}
										/>
									</Box>
								))}
							</Box>
						</Box>
					)}
				</Box>
			</Fade>
		</Modal>
	);
}
