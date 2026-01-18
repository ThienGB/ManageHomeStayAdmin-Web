'use client';

import { useGlobalContext } from '@/contexts/GlobalContext/useGlobalContext';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { CardMedia, IconButton, Typography } from '@mui/material';

type RoomImage = {
	id?: string;
	url: string;
};

type RoomImageGalleryProps = {
	images: RoomImage[];
	roomName: string;
	currentImageIndex: number;
	onImageIndexChange: (index: number) => void;
};

function RoomImageGallery(props: RoomImageGalleryProps) {
	const { images, roomName, currentImageIndex, onImageIndexChange } = props;
	const { openModal } = useGlobalContext();

	if (!images || images.length === 0) {
		return null;
	}

	const handlePrevImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		onImageIndexChange(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
	};

	const handleNextImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		onImageIndexChange(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
	};

	const handleOpenGallery = () => {
		openModal(
			images.map((img) => img.url),
			currentImageIndex
		);
	};

	return (
		<div className="group relative cursor-pointer">
			<CardMedia
				component="img"
				height="500"
				image={images[currentImageIndex].url}
				alt={roomName}
				className="h-[500px] w-full object-cover"
				onClick={handleOpenGallery}
			/>
			{/* Overlay to indicate clickable */}
			<div
				className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20"
				onClick={handleOpenGallery}
			>
				<div className="rounded-lg bg-white/90 px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100">
					<div className="flex items-center gap-2">
						<FuseSvgIcon size={20}>lucide:maximize-2</FuseSvgIcon>
						<Typography
							variant="body2"
							fontWeight="medium"
						>
							Nhấp để xem thư viện
						</Typography>
					</div>
				</div>
			</div>
			{images.length > 1 && (
				<>
					<IconButton
						className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/90 hover:bg-white"
						onClick={handlePrevImage}
					>
						<FuseSvgIcon>lucide:chevron-left</FuseSvgIcon>
					</IconButton>
					<IconButton
						className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/90 hover:bg-white"
						onClick={handleNextImage}
					>
						<FuseSvgIcon>lucide:chevron-right</FuseSvgIcon>
					</IconButton>
				</>
			)}
			{/* Thumbnail Strip */}
			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2">
				{images.slice(0, 5).map((img, idx) => (
					<button
						key={idx}
						onClick={(e) => {
							e.stopPropagation();
							onImageIndexChange(idx);
						}}
						className={`h-16 w-16 overflow-hidden rounded border-2 transition-all ${idx === currentImageIndex
								? 'scale-110 border-white'
								: 'border-transparent opacity-70'
							}`}
					>
						<img
							src={img.url}
							alt={`Thumbnail ${idx + 1}`}
							className="h-full w-full object-cover"
						/>
					</button>
				))}
			</div>
		</div>
	);
}

export default RoomImageGallery;
