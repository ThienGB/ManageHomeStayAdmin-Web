'use client';

import FuseLoading from '@fuse/core/FuseLoading';
import Link from '@fuse/core/Link';
import useParams from '@fuse/hooks/useParams';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRoom } from '../../api/hooks/useRoom';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Container, Divider, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router';
import { useAmenities } from '../../api/hooks/useAmenities';
import { useCreateRoom } from '../../api/hooks/useCreateRoom';
import { useCreateTimeSlot } from '../../api/hooks/useCreateTimeSlot';
import { useDeleteTimeSlot } from '../../api/hooks/useDeleteTimeSlot';
import { useTimeSlots } from '../../api/hooks/useTimeSlots';
import { useUpdateRoom } from '../../api/hooks/useUpdateRoom';
import { useUpdateTimeSlot } from '../../api/hooks/useUpdateTimeSlot';
import RoomModel from '../../api/models/RoomModel';
import { RoomImage } from '../../api/types';
import useRoomImages, { FormImage } from '../../hooks/useRoomImages';

// Import refactored components
import {
    RoomAmenities,
    RoomAmenitiesForm,
    RoomBasicInfoForm,
    RoomImageGallery,
    RoomImagesForm,
    RoomInfo,
    RoomTimeSlots,
    RoomTimeSlotsForm
} from '../ui/room';

const schema = z
	.object({
		name: z.string().min(3, 'Name must be at least 3 characters'),
		description: z.string().min(10, 'Description must be at least 10 characters'),
		isActive: z.boolean(),
		capacity: z.number().min(1, 'Capacity must be at least 1'),
		numberOfBeds: z.number().min(0, 'Bed count must be positive'),
		area: z.number().min(0, 'Area must be positive'),
		amenityIds: z.array(z.string()).optional()
	})
	.passthrough();

const timeSlotSchema = z.object({
	timeslots: z
		.array(
			z.object({
				id: z.string().optional(),
				startTime: z.string().optional(),
				endTime: z.string().optional(),
				price: z.number().optional(),
				isOvernight: z.boolean().optional()
			})
		)
		.default([])
});

type RoomViewProps = {
	mode?: 'create' | 'edit' | 'view';
};

function RoomView(props: RoomViewProps) {
	const { mode } = props;
	const routeParams = useParams();
	const { roomId } = routeParams as { roomId: string };
	const { data: room, isLoading, isError } = useRoom(roomId);

	const isCreateMode = mode === 'create' || !roomId || roomId === 'new' || roomId === 'add';
	const [isEditMode, setIsEditMode] = useState(
		mode === 'edit' || (mode !== 'view' && (isCreateMode || window.location.pathname.includes('/edit/')))
	);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [amenitySearch, setAmenitySearch] = useState('');

	const { data: timeSlots } = useTimeSlots(roomId);
	const { data: amenities } = useAmenities(amenitySearch);
	const { mutate: updateRoom } = useUpdateRoom();
	const { mutate: createRoom } = useCreateRoom();
	const { mutate: createTimeSlot } = useCreateTimeSlot();
	const { mutate: updateTimeSlot } = useUpdateTimeSlot();
	const { mutate: deleteTimeSlot } = useDeleteTimeSlot();

	// Image management hook
	const { syncImages, rollbackUploadedImages, isSyncing, syncStatus } = useRoomImages(roomId);

	const navigate = useNavigate();

	type FormValues = z.infer<typeof schema>;

	const methods = useForm<FormValues>({
		mode: 'onChange',
		defaultValues: RoomModel({}) as unknown as Partial<FormValues>,
		resolver: zodResolver(schema)
	});

	const timeSlotMethods = useForm<z.infer<typeof timeSlotSchema>>({
		mode: 'onChange',
		defaultValues: { timeslots: [] },
		resolver: zodResolver(timeSlotSchema)
	});

	const {
		reset,
		control,
		formState: { errors }
	} = methods;

	const {
		reset: resetTimeSlots,
		control: controlTimeSlots,
		getValues: getTimeSlotValues,
		setValue: setTimeSlotValue
	} = timeSlotMethods;

	const {
		fields: timeSlotFields,
		append: appendTimeSlot,
		remove: removeTimeSlot
	} = useFieldArray({
		control: controlTimeSlots,
		name: 'timeslots'
	});

	useEffect(() => {
		if (room) {
			const normalized = {
				...room,
				amenityIds: room.amenities
					? room.amenities.map((a: any) => (typeof a === 'string' ? a : a.id || a._id || a))
					: []
			};

			const normalizeTime = (timeString?: string): string | undefined => {
				if (!timeString) return undefined;

				if (/^\d{2}:\d{2}$/.test(timeString)) {
					return timeString;
				}

				try {
					const date = new Date(timeString);

					if (!isNaN(date.getTime())) {
						const hours = date.getHours().toString().padStart(2, '0');
						const minutes = date.getMinutes().toString().padStart(2, '0');
						return `${hours}:${minutes}`;
					}
				} catch (e) {
					const match = timeString.match(/(\d{2}):(\d{2})/);

					if (match) {
						return `${match[1]}:${match[2]}`;
					}
				}

				return timeString;
			};

			const normalizedTimeSlots = (timeSlots || []).map((ts: any) => ({
				id: ts.id,
				startTime: normalizeTime(ts.startTime),
				endTime: normalizeTime(ts.endTime),
				price: ts.price,
				isOvernight: ts.isOvernight
			}));

			reset(normalized as any);
			resetTimeSlots({ timeslots: normalizedTimeSlots });
		}
	}, [room, timeSlots, reset, resetTimeSlots]);

	const statusColor = room?.isActive ? 'success' : 'error';
	const [isSaving, setIsSaving] = useState(false);

	const handleSave = async (data: any) => {
		if (isCreateMode) {
			setIsSaving(true);
			// Track newly uploaded image URLs for potential rollback
			const newlyUploadedUrls: string[] = [];

			try {
				// Upload pending images first using Promise.allSettled for granular handling
				const images: FormImage[] = data.images || [];
				const localImages = images.filter((img) => img.isLocal && img.file);
				const existingImages = images.filter((img) => !img.isLocal && img.url);

				const uploadedImages: { url: string }[] = existingImages.map((img) => ({ url: img.url }));

				// Upload local images in parallel
				if (localImages.length > 0) {
					const { uploadsApi } = await import('@/services/uploadsApiService');
					const uploadResults = await Promise.allSettled(
						localImages.map((img) => uploadsApi.uploadFile(img.file!, 'ROOMS'))
					);

					uploadResults.forEach((result) => {
						if (result.status === 'fulfilled') {
							uploadedImages.push({ url: result.value.url });
							newlyUploadedUrls.push(result.value.url);
						}
					});

					// Check for upload failures
					const failedUploads = uploadResults.filter((r) => r.status === 'rejected');

					if (failedUploads.length > 0) {
						console.error(`${failedUploads.length} image(s) failed to upload`);
					}
				}

				const roomData = {
					name: data.name,
					description: data.description,
					capacity: data.capacity,
					numberOfBeds: data.numberOfBeds,
					area: data.area,
					images: uploadedImages,
					isActive: data.isActive,
					amenityIds: data.amenityIds || []
				};

				createRoom(roomData, {
					onSuccess: (responseData) => {
						setIsSaving(false);
						setIsEditMode(false);
						navigate(`/apps/rooms/${responseData.id}`);
					},
					onError: async () => {
						setIsSaving(false);
						// Room creation failed - rollback uploaded images
						await rollbackUploadedImages(newlyUploadedUrls);
					}
				});
			} catch (error) {
				console.error('Error uploading images:', error);
				setIsSaving(false);
				// Rollback any successfully uploaded images
				await rollbackUploadedImages(newlyUploadedUrls);
			}
		} else {
			// Edit mode - handle image changes after room update
			setIsSaving(true);

			try {
				const roomData = {
					id: roomId,
					name: data.name,
					description: data.description,
					capacity: data.capacity,
					numberOfBeds: data.numberOfBeds,
					amenityIds: data.amenityIds || [],
					area: data.area,
					isActive: data.isActive,
					hourlyRate: data.hourlyRate,
					overnightRate: data.overnightRate
				};

				// First update the room basic info
				updateRoom(
					{ roomId, data: roomData },
					{
						onSuccess: async () => {
							// After room update success, sync image changes
							const currentImages: FormImage[] = data.images || [];
							const originalImages: RoomImage[] = room?.images || [];

							// Use the hook for granular image sync with Promise.allSettled
							await syncImages(currentImages, originalImages);

							setIsSaving(false);
							setIsEditMode(false);
							navigate(`/apps/rooms/${roomId}`);
						},
						onError: () => {
							setIsSaving(false);
						}
					}
				);
			} catch (error) {
				console.error('Error updating room:', error);
				setIsSaving(false);
			}
		}
	};

	const handleSaveTimeSlot = (index: number, timeslotData: any) => {
		if (timeslotData.id && timeslotData.id.startsWith('timeSlot-')) {
			// New timeslot - create via API
			createTimeSlot({
				roomId,
				data: {
					startTime: timeslotData.startTime,
					endTime: timeslotData.endTime,
					price: timeslotData.price,
					roomId: room.id,
					status: 'AVAILABLE',
					isOvernight: timeslotData.isOvernight
				}
			});
		} else if (timeslotData.id) {
			// Existing timeslot - update via API
			updateTimeSlot({
				timeslotId: timeslotData.id,
				roomId: room.id,
				data: {
					startTime: timeslotData.startTime,
					endTime: timeslotData.endTime,
					price: timeslotData.price,
					roomId: room.id,
					status: 'AVAILABLE',
					isOvernight: timeslotData.isOvernight
				}
			});
		}
	};

	const handleDeleteTimeSlot = (id: string | undefined, index: number) => {
		if (id && !id.startsWith('timeSlot-')) {
			deleteTimeSlot({ timeslotId: id, roomId });
		}
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError && !isCreateMode) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex h-full flex-1 flex-col items-center justify-center"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such room!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/rooms"
					color="inherit"
				>
					Go to Rooms Page
				</Button>
			</motion.div>
		);
	}

	return (
		<FormProvider {...methods}>
			<Container className="py-6">
				{/* Header Actions */}
				<div className="mb-6 flex items-center justify-between">
					<Button
						component={Link}
						to="/apps/rooms"
						startIcon={<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>}
					>
						Back to Rooms
					</Button>
					<div className="flex gap-2">
						{isEditMode ? (
							<>
								<Button
									variant="outlined"
									onClick={() => {
										if (isCreateMode) {
											navigate('/apps/rooms');
										} else {
											reset();
											navigate(`/apps/rooms/${roomId}`);
											setIsEditMode(false);
										}
									}}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={methods.handleSubmit(handleSave)}
									startIcon={
										<FuseSvgIcon>
											{isSaving || isSyncing ? 'lucide:loader-2' : 'lucide:save'}
										</FuseSvgIcon>
									}
									disabled={isSaving || isSyncing}
								>
									{isSyncing && syncStatus ? syncStatus : isSaving ? 'Saving...' : 'Save Changes'}
								</Button>
							</>
						) : (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => {
									navigate(`/apps/rooms/edit/${roomId}`);
									setIsEditMode(true);
								}}
								startIcon={<FuseSvgIcon>lucide:edit</FuseSvgIcon>}
							>
								Edit
							</Button>
						)}
					</div>
				</div>

				{!isEditMode ? (
					/* VIEW MODE */
					<div className="w-full space-y-8">
						{/* Hero Section */}
						<Paper
							elevation={0}
							className="overflow-hidden rounded-2xl"
						>
							{/* Image Gallery */}
							{room?.images && room.images.length > 0 && (
								<RoomImageGallery
									images={room.images}
									roomName={room?.name || ''}
									currentImageIndex={currentImageIndex}
									onImageIndexChange={setCurrentImageIndex}
								/>
							)}

							{/* Title Section */}
							<div className="p-6">
								<div className="mb-4 flex items-start justify-between">
									<div className="flex-1">
										<Typography
											variant="h3"
											className="mb-2 font-bold"
										>
											{room?.name}
										</Typography>
									</div>
								</div>
								<Chip
									label={room?.isActive ? 'ACTIVE' : 'INACTIVE'}
									color={statusColor}
									size="medium"
									className="mb-4"
								/>
							</div>
						</Paper>

						<Grid
							container
							spacing={4}
							className="w-full"
						>
							<Grid size={{ sm: 12, md: 12 }}>
								{/* About This Room */}
								<RoomInfo
									name={room?.name}
									description={room?.description}
									capacity={room?.capacity}
									bed={room?.bed}
									area={room?.area}
									hourlyRate={room?.hourlyRate}
									overnightRate={room?.overnightRate}
								/>

								{/* Amenities */}
								{room?.amenities && room.amenities.length > 0 && (
									<RoomAmenities amenities={room.amenities} />
								)}

								{/* TimeSlots Section */}
								{timeSlots && timeSlots.length > 0 && <RoomTimeSlots timeSlots={timeSlots} roomId={roomId} />}
							</Grid>
						</Grid>
					</div>
				) : (
					/* EDIT MODE */
					<Paper className="p-8">
						<Typography
							variant="h4"
							className="mb-6 font-bold"
						>
							{isCreateMode ? 'Add Room' : 'Edit Room'}
						</Typography>

						<div className="space-y-6">
							{/* Basic Information */}
							<div>
								<Typography
									variant="h6"
									className="mb-4 font-semibold"
								>
									Basic Information
								</Typography>
								<RoomBasicInfoForm
									control={control}
									errors={errors}
								/>
							</div>

							<Divider />

							{/* Images */}
							<div>
								<Typography
									variant="h6"
									className="mb-4 font-semibold"
								>
									Images
								</Typography>
								<RoomImagesForm control={control} />
							</div>

							<Divider />

							{/* Amenities */}
							<div>
								<Typography
									variant="h6"
									className="mb-4 font-semibold"
								>
									Amenities
								</Typography>
								<RoomAmenitiesForm
									control={control}
									amenities={amenities || []}
								/>
							</div>

							<Divider />

							{/* Time Slots */}
							<RoomTimeSlotsForm
								control={controlTimeSlots}
								fields={timeSlotFields}
								append={appendTimeSlot}
								remove={removeTimeSlot}
								getValues={getTimeSlotValues}
								roomId={room?.id || roomId}
								onSaveTimeSlot={handleSaveTimeSlot}
								onDeleteTimeSlot={handleDeleteTimeSlot}
								setValue={setTimeSlotValue}
								isViewMode={false}
							/>
						</div>
					</Paper>
				)}
			</Container>
		</FormProvider>
	);
}

export default RoomView;
