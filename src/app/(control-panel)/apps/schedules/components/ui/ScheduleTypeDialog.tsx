import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	FormLabel,
	Box,
	IconButton
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { ScheduleType } from '../../api/types/ScheduleTypes';
import { useCreateScheduleType } from '../../api/hook/useCreateScheduleType';
import { useUpdateScheduleType } from '../../api/hook/useUpdateScheduleType';
import { useScheduleTypesContext } from '../../context/schedule-types-context/useScheduleTypesContext';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const baseSchema = z.object({
	name: z
		.string()
		.nonempty('You must enter a schedule type name')
		.min(2, 'The schedule type name must be at least 2 characters'),
	description: z
		.string()
		.nonempty('You must enter a description')
		.min(2, 'The description must be at least 2 characters')
});

const createScheduleTypeSchema = () =>
	baseSchema.extend({
		image: z
			.instanceof(File, { message: 'Image file is required' })
			.refine((file) => file.size > 0, 'Image file cannot be empty')
			.refine(
				(file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
				'Only JPEG and PNG images are allowed'
			)
	});

const updateScheduleTypeSchema = () =>
	baseSchema.extend({
		image: z.union([
			z
				.instanceof(File)
				.refine((file) => file.size > 0, 'Image file cannot be empty')
				.refine(
					(file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
					'Only JPEG and PNG images are allowed'
				),
			z.undefined()
		])
	});

type ScheduleTypeDialogProps = {
	open: boolean;
	onClose: () => void;
	scheduleType?: ScheduleType | null;
};

function ScheduleTypeDialog({ open, onClose, scheduleType }: ScheduleTypeDialogProps) {
	const { pagination } = useScheduleTypesContext();
	const { mutate: createScheduleType, isPending: isCreating } = useCreateScheduleType(pagination);
	const { mutate: updateScheduleType, isPending: isUpdating } = useUpdateScheduleType(pagination);
	const [imagePreview, setImagePreview] = useState<string>('');

	const schema = scheduleType ? updateScheduleTypeSchema() : createScheduleTypeSchema();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
		watch
	} = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: '',
			image: undefined as File | undefined
		},
		resolver: zodResolver(schema)
	});

	const imageValue = watch('image');

	useEffect(() => {
		if (scheduleType) {
			reset({
				name: scheduleType.name,
				description: scheduleType.description || '',
				image: undefined
			});
			setImagePreview(scheduleType.image as string);
		} else {
			reset({
				name: '',
				description: '',
				image: undefined
			});
			setImagePreview('');
		}
	}, [scheduleType, reset]);

	useEffect(() => {
		if (imageValue instanceof File) {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					setImagePreview(reader.result);
				}
			};
			reader.readAsDataURL(imageValue);
		} else {
			setImagePreview(imageValue);
		}
	}, [imageValue]);

	const handleClose = () => {
		onClose();
		reset();
		setImagePreview('');
	};

	const onSubmit = (data: { name: string; description: string; image?: File }) => {
		if (scheduleType) {
			const updateData = {
				...scheduleType,
				name: data.name,
				description: data.description,
				...(data.image && { image: data.image })
			};
			updateScheduleType(updateData, {
				onSuccess: () => {
					handleClose();
				}
			});
		} else {
			createScheduleType(
				{
					name: data.name,
					description: data.description,
					image: data.image!
				},
				{
					onSuccess: () => {
						handleClose();
					}
				}
			);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>{scheduleType ? 'Edit Schedule Type' : 'Add Schedule Type'}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<div className="mt-2 flex flex-col gap-4">
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="schedule-type-name">Name</FormLabel>
									<TextField
										{...field}
										id="schedule-type-name"
										required
										autoFocus
										fullWidth
										error={!!errors.name}
										helperText={errors?.name?.message as string}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="schedule-type-description">
										Description <span className="text-red-500">*</span>
									</FormLabel>
									<TextField
										{...field}
										id="schedule-type-description"
										required
										multiline
										rows={3}
										fullWidth
										error={!!errors.description}
										helperText={errors?.description?.message as string}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="image"
							control={control}
							render={({ field: { onChange } }) => (
								<FormControl
									className="w-full"
									error={!!errors.image}
								>
									<FormLabel htmlFor="schedule-type-image">
										Image {!scheduleType && <span className="text-red-500">*</span>}
									</FormLabel>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											gap: 2,
											mt: 1
										}}
									>
										{imagePreview && (
											<Box
												sx={{
													position: 'relative',
													width: '100%',
													maxWidth: 200,
													height: 150,
													border: '1px solid',
													borderColor: errors.image ? 'error.main' : 'divider',
													borderRadius: 1,
													overflow: 'hidden',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													backgroundColor: 'background.default'
												}}
											>
												<img
													src={imagePreview}
													alt="Preview"
													style={{
														maxWidth: '100%',
														maxHeight: '100%',
														objectFit: 'contain'
													}}
												/>
												<IconButton
													onClick={() => {
														onChange(undefined);
														setImagePreview('');
													}}
													sx={{
														position: 'absolute',
														top: 4,
														right: 4,
														backgroundColor: 'background.paper',
														'&:hover': {
															backgroundColor: 'action.hover'
														}
													}}
													size="small"
												>
													<FuseSvgIcon>lucide:x</FuseSvgIcon>
												</IconButton>
											</Box>
										)}
										<label htmlFor="button-image-file">
											<input
												accept="image/jpeg,image/jpg,image/png"
												className="hidden"
												id="button-image-file"
												type="file"
												onChange={(e) => {
													const file = e.target.files?.[0];
													onChange(file);
												}}
											/>
											<Button
												component="span"
												variant="outlined"
												color={errors.image ? 'error' : 'inherit'}
												startIcon={<FuseSvgIcon>lucide:upload</FuseSvgIcon>}
											>
												{imagePreview ? 'Change Image' : 'Upload Image (JPEG/PNG)'}
											</Button>
										</label>
										{errors.image && (
											<span className="mt-1 text-sm text-red-500">
												{errors.image.message as string}
											</span>
										)}
									</Box>
								</FormControl>
							)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={onClose}
						color="inherit"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						disabled={isUpdating || isCreating}
					>
						{isUpdating || isCreating ? 'Submitting...' : scheduleType ? 'Update' : 'Create'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default ScheduleTypeDialog;
