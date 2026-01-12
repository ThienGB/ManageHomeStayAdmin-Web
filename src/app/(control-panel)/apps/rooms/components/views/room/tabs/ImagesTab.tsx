import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function ImagesTab() {
	const methods = useFormContext();
	const { control, watch, setValue } = methods;

	const images = watch('images') || [];

	const handleAddImage = () => {
		const currentImages = watch('images') || [];
		setValue('images', [...currentImages, '']);
	};

	const handleRemoveImage = (index: number) => {
		const currentImages = watch('images') || [];
		setValue('images', currentImages.filter((_: string, i: number) => i !== index));
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<Typography variant="h6">Attraction Images</Typography>
				<IconButton
					onClick={handleAddImage}
					color="secondary"
					size="small"
				>
					<FuseSvgIcon>lucide:plus</FuseSvgIcon>
				</IconButton>
			</div>

			{images.length === 0 && (
				<Box className="text-center py-8">
					<Typography
						color="text.secondary"
						variant="body2"
					>
						No images added yet. Click the + button to add images.
					</Typography>
				</Box>
			)}

			{images.map((image: string, index: number) => (
				<Controller
					key={index}
					name={`images.${index}`}
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor={`image-${index}`}>Image URL {index + 1}</FormLabel>
							<div className="flex gap-2 items-start">
								{field.value && (
									<img
										src={field.value}
										alt={`Preview ${index + 1}`}
										className="w-20 h-20 object-cover rounded-sm"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = 'none';
										}}
									/>
								)}
								<TextField
									{...field}
									id={`image-${index}`}
									placeholder="Enter image URL"
									fullWidth
									multiline
									rows={2}
								/>
								<IconButton
									onClick={() => handleRemoveImage(index)}
									color="error"
									size="small"
								>
									<FuseSvgIcon>lucide:trash</FuseSvgIcon>
								</IconButton>
							</div>
						</FormControl>
					)}
				/>
			))}
		</div>
	);
}

export default ImagesTab;
