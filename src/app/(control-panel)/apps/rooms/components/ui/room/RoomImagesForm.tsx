'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRef } from 'react';
import { Control, useFieldArray } from 'react-hook-form';

export type LocalImage = {
	file?: File;
	url: string;
	isLocal: boolean; // true = local preview, false = already uploaded
};

type RoomImagesFormProps = {
	control: Control<any>;
};

function RoomImagesForm(props: RoomImagesFormProps) {
	const { control } = props;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'images'
	});

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (!files || files.length === 0) return;

		// Add files as local preview (not uploaded yet)
		Array.from(files).forEach((file) => {
			const localUrl = URL.createObjectURL(file);
			append({
				file,
				url: localUrl,
				isLocal: true
			});
		});

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const files = e.dataTransfer.files;

		if (!files || files.length === 0) return;

		Array.from(files).forEach((file) => {
			if (file.type.startsWith('image/')) {
				const localUrl = URL.createObjectURL(file);
				append({
					file,
					url: localUrl,
					isLocal: true
				});
			}
		});
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleRemove = (index: number) => {
		const field = fields[index] as any;

		// Revoke object URL if it's a local file
		if (field?.isLocal && field?.url) {
			URL.revokeObjectURL(field.url);
		}

		remove(index);
	};

	return (
		<div>
			{/* Upload Area */}
			<Paper
				className="hover:border-primary mb-4 cursor-pointer border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
				elevation={0}
				onClick={() => fileInputRef.current?.click()}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					multiple
					hidden
					onChange={handleFileSelect}
				/>
				<Box className="flex flex-col items-center gap-2">
					<FuseSvgIcon
						size={48}
						className="text-gray-400"
					>
						lucide:cloud-upload
					</FuseSvgIcon>
					<Typography
						variant="body1"
						fontWeight="medium"
					>
						Nhấp hoặc kéo hình ảnh vào đây
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Hỗ trợ: JPG, PNG, GIF, WebP
					</Typography>
					<Typography
						variant="caption"
						color="warning.main"
					>
						Hình ảnh sẽ được tải lên khi bạn lưu
					</Typography>
				</Box>
			</Paper>

			{/* Image Grid */}
			{fields.length > 0 && (
				<Grid
					container
					spacing={2}
				>
					{fields.map((field: any, index: number) => (
						<Grid
							key={field.id}
							size={{ xs: 6, sm: 4, md: 3 }}
						>
							<Paper
								className="group relative aspect-square overflow-hidden"
								elevation={2}
							>
								<img
									src={field.url}
									alt={`Room image ${index + 1}`}
									className="h-full w-full object-cover"
								/>
								{/* Local file indicator */}
								{field.isLocal && (
									<div className="absolute top-2 right-2 rounded bg-yellow-500 px-2 py-0.5 text-xs text-white">
										Chờ xử lý
									</div>
								)}
								{/* Overlay on hover */}
								<div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
									<IconButton
										size="small"
										className="bg-red-500 text-white hover:bg-red-600"
										onClick={() => handleRemove(index)}
									>
										<FuseSvgIcon size={20}>lucide:trash-2</FuseSvgIcon>
									</IconButton>
								</div>
								{/* Image index badge */}
								<div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs text-white">
									{index + 1}
								</div>
							</Paper>
						</Grid>
					))}
				</Grid>
			)}

			{/* Empty state */}
			{fields.length === 0 && (
				<Typography
					variant="body2"
					color="text.secondary"
					className="text-center"
				>
					Chưa có hình ảnh nào
				</Typography>
			)}
		</div>
	);
}

export default RoomImagesForm;
