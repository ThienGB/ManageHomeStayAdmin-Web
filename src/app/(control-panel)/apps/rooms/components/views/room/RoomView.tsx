'use client';

import FuseLoading from '@fuse/core/FuseLoading';
import Link from '@fuse/core/Link';
import useParams from '@fuse/hooks/useParams';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRoom } from '../../../api/hooks/useRoom';

import { useGlobalContext } from '@/contexts/GlobalContext/useGlobalContext';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	CardMedia,
	Checkbox,
	Chip,
	Container,
	Divider,
	FormControlLabel,
	IconButton,
	Paper,
	TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAmenities } from '../../../api/hooks/useAmenities';
import { useCreateRoom } from '../../../api/hooks/useCreateRoom';
import { useCreateTimeSlot } from '../../../api/hooks/useCreateTimeSlot';
import { useDeleteTimeSlot } from '../../../api/hooks/useDeleteTimeSlot';
import { useTimeSlots } from '../../../api/hooks/useTimeSlots';
import { useUpdateRoom } from '../../../api/hooks/useUpdateRoom';
import { useUpdateTimeSlot } from '../../../api/hooks/useUpdateTimeSlot';
import TimeSlotModel from '../../../api/models/TimeSlotModel';

const schema = z
	.object({
		name: z.string().min(3, 'Name must be at least 3 characters'),
		description: z.string().min(10, 'Description must be at least 10 characters'),
		price: z.number().min(0, 'Price must be positive'),
		status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
		amenities: z.array(z.string()).optional(),
		timeslots: z.array(
			z.object({
				id: z.string().optional(),
				startTime: z.string().optional(),
				endTime: z.string().optional(),
				price: z.number().optional(),
				isOvernight: z.boolean().optional()
			})
		).default([])
	})
	.passthrough(); // Allow additional fields

function RoomView() {
	const routeParams = useParams();
	const { roomId } = routeParams as { roomId: string };
	const { data: room, isLoading, isError } = useRoom(roomId);

	const isCreateMode = (roomId || '').toLowerCase() === 'new';
	const [isEditMode, setIsEditMode] = useState(isCreateMode);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [amenitySearch, setAmenitySearch] = useState('');

	const { data: amenities } = useAmenities(amenitySearch);
	const { data: timeSlots } = useTimeSlots(roomId);
	const { mutate: updateRoom } = useUpdateRoom();
	const { mutate: createRoom } = useCreateRoom();
	const { mutate: createTimeSlot } = useCreateTimeSlot();
	const { mutate: updateTimeSlot } = useUpdateTimeSlot();
	const { mutate: deleteTimeSlot } = useDeleteTimeSlot();
	const { openModal } = useGlobalContext();

	type FormValues = z.infer<typeof schema>;

	const methods = useForm<FormValues>({
		mode: 'onChange',
		// defaultValues may be filled from server data via `reset`.
		defaultValues: {} as Partial<FormValues>,
		resolver: zodResolver(schema)
	});

	const {
		reset,
		control,
		watch,
		formState: { errors }
	} = methods;

	const { fields: timeslotFields, append: appendTimeSlot, remove: removeTimeSlot } = useFieldArray({
		control,
		name: 'timeslots'
	});

	useEffect(() => {
		if (room) {
			// Helper function to extract time in HH:mm format from various datetime formats
			const normalizeTime = (timeString?: string): string | undefined => {
				if (!timeString) return undefined;
				
				// If it's already in HH:mm format, return as is
				if (/^\d{2}:\d{2}$/.test(timeString)) {
					return timeString;
				}
				
				// If it's a full datetime string, extract time part
				try {
					const date = new Date(timeString);
					if (!isNaN(date.getTime())) {
						const hours = date.getHours().toString().padStart(2, '0');
						const minutes = date.getMinutes().toString().padStart(2, '0');
						return `${hours}:${minutes}`;
					}
				} catch (e) {
					// If parsing fails, try to extract HH:mm from string
					const match = timeString.match(/(\d{2}):(\d{2})/);
					if (match) {
						return `${match[1]}:${match[2]}`;
					}
				}
				
				return timeString;
			};

			// Normalize certain nested fields so the form values match our schema.
			const normalized = {
				...room,
				amenities: room.amenities
					? room.amenities.map((a: any) => (typeof a === 'string' ? a : a.id || a._id || a))
					: [],
				timeslots: timeSlots 
					? timeSlots.map((slot: any) => ({
						...slot,
						startTime: normalizeTime(slot.startTime),
						endTime: normalizeTime(slot.endTime)
					}))
					: []
			};

			reset(normalized as any);
		}
	}, [room, timeSlots, reset]);

	const statusColor = room?.isActive ? 'success' : 'error';

	const handleSave = (data: any) => {
		if (isCreateMode) {
			createRoom(data);
		} else {
			updateRoom({ roomId, data });
		}
		setIsEditMode(false);
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
									onClick={() => setIsEditMode(false)}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={methods.handleSubmit(handleSave)}
									startIcon={<FuseSvgIcon>lucide:save</FuseSvgIcon>}
								>
									Save Changes
								</Button>
							</>
						) : (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setIsEditMode(true)}
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
								<div className="group relative cursor-pointer">
									<CardMedia
										component="img"
										height="500"
										image={room.images[currentImageIndex].url}
										alt={room?.name}
										className="h-[500px] w-full object-cover"
										onClick={() =>
											openModal(
												room.images.map((img) => img.url),
												currentImageIndex
											)
										}
									/>
									{/* Overlay to indicate clickable */}
									<div
										className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20"
										onClick={() =>
											openModal(
												room.images.map((img) => img.url),
												currentImageIndex
											)
										}
									>
										<div className="rounded-lg bg-white/90 px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100">
											<div className="flex items-center gap-2">
												<FuseSvgIcon size={20}>lucide:maximize-2</FuseSvgIcon>
												<Typography
													variant="body2"
													fontWeight="medium"
												>
													Click to view gallery
												</Typography>
											</div>
										</div>
									</div>
									{room.images.length > 1 && (
										<>
											<IconButton
												className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/90 hover:bg-white"
												onClick={(e) => {
													e.stopPropagation();
													setCurrentImageIndex((prev) =>
														prev === 0 ? room.images.length - 1 : prev - 1
													);
												}}
											>
												<FuseSvgIcon>lucide:chevron-left</FuseSvgIcon>
											</IconButton>
											<IconButton
												className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/90 hover:bg-white"
												onClick={(e) => {
													e.stopPropagation();
													setCurrentImageIndex((prev) =>
														prev === room.images.length - 1 ? 0 : prev + 1
													);
												}}
											>
												<FuseSvgIcon>lucide:chevron-right</FuseSvgIcon>
											</IconButton>
										</>
									)}
									{/* Thumbnail Strip */}
									<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2">
										{room.images.slice(0, 5).map((img, idx) => (
											<button
												key={idx}
												onClick={(e) => {
													e.stopPropagation();
													setCurrentImageIndex(idx);
												}}
												className={`h-16 w-16 overflow-hidden rounded border-2 transition-all ${
													idx === currentImageIndex
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
								<Paper
									className="mb-4 w-full p-6"
									elevation={1}
								>
									<Typography
										variant="h5"
										className="mb-4 font-bold"
									>
										About This Room
									</Typography>
									<Typography
										variant="body1"
										className="leading-relaxed text-gray-700 dark:text-gray-300"
									>
										{room?.description}
									</Typography>
									<div className="flex items-center gap-2">
										<Typography variant="body2">{room?.capacity}</Typography>
										<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
											<FuseSvgIcon
												size={16}
												className="text-primary"
											>
												lucide:user
											</FuseSvgIcon>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Typography variant="body2">{room?.bed}</Typography>
										<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
											<FuseSvgIcon
												size={16}
												className="text-primary"
											>
												lucide:bed
											</FuseSvgIcon>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Typography variant="body2">{room?.area} m²</Typography>
										<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
											<FuseSvgIcon
												size={16}
												className="text-primary"
											>
												lucide:area
											</FuseSvgIcon>
										</div>
									</div>
								</Paper>

								{/* Amenities */}
								{room?.amenities && room.amenities.length > 0 && (
									<Paper
										className="mb-4 p-6"
										elevation={1}
									>
										<Typography
											variant="h5"
											className="mb-4 font-bold"
										>
											Amenities
										</Typography>
										<Grid
											container
											spacing={3}
										>
											{room.amenities.map((amenity, idx) => (
												<Grid
													key={idx}
													size={{ sm: 12, md: 12 }}
												>
													<div className="flex items-center gap-2">
														<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
															<FuseSvgIcon
																size={16}
																className="text-primary"
															>
																lucide:vector-square
															</FuseSvgIcon>
														</div>
														<Typography variant="body2">{amenity.name}</Typography>
													</div>
												</Grid>
											))}
										</Grid>
									</Paper>
								)}

								{/* TimeSlots Section */}
								{timeSlots && timeSlots.length > 0 && (
									<Paper
										className="mb-4 p-6"
										elevation={1}
									>
										<Typography
											variant="h5"
											className="mb-4 font-bold"
										>
											Time Slots
										</Typography>
										<Grid
											container
											spacing={3}
										>
											{timeSlots.map((slot, idx) => (
												<Grid
													key={idx}
													size={{ sm: 12, md: 6 }}
												>
													<Paper
														className="bg-gray-50 p-4 dark:bg-gray-800"
														elevation={0}
													>
														<div className="flex items-center justify-between mb-3">
															<Typography
																variant="h6"
																className="font-semibold"
															>
																Slot {idx + 1}
															</Typography>
															{slot.isOvernight && (
																<Chip
																	label="Overnight"
																	size="small"
																	color="primary"
																/>
															)}
														</div>
														<div className="space-y-2">
															<div className="flex items-center gap-2">
																<FuseSvgIcon
																	size={16}
																	className="text-gray-500"
																>
																	lucide:clock
																</FuseSvgIcon>
																<Typography variant="body2">
																	{slot.startTime} - {slot.endTime}
																</Typography>
															</div>
															<div className="flex items-center gap-2">
																<FuseSvgIcon
																	size={16}
																	className="text-gray-500"
																>
																	lucide:dollar-sign
																</FuseSvgIcon>
																<Typography variant="body2" className="font-semibold">
																	{slot.price?.toLocaleString() || 0} VND
																</Typography>
															</div>
														</div>
													</Paper>
												</Grid>
											))}
										</Grid>
									</Paper>
								)}
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
							Edit Room
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
								<Grid
									container
									spacing={3}
								>
									<Grid size={{ sm: 12, md: 12 }}>
										<Controller
											name="name"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Room Name"
													fullWidth
													required
													error={!!errors.name}
													helperText={errors.name?.message as string}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12 }}>
										<Controller
											name="description"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Description"
													fullWidth
													multiline
													rows={4}
													required
													error={!!errors.description}
													helperText={errors.description?.message as string}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12, md: 12 }}>
										<Controller
											name="capacity"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Room Capacity"
													fullWidth
													required
													error={!!errors.capacity}
													helperText={errors.capacity?.message as string}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12, md: 12 }}>
										<Controller
											name="bed"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Number of Beds"
													fullWidth
													required
													error={!!errors.bed}
													helperText={errors.bed?.message as string}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12, md: 12 }}>
										<Controller
											name="area"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Area"
													fullWidth
													required
													error={!!errors.area}
													helperText={errors.area?.message as string}
												/>
											)}
										/>
									</Grid>
								</Grid>
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
								<Grid
									container
									spacing={3}
								>
									<Grid size={{ sm: 12, md: 12 }}>
										<Controller
											name="amenities"
											control={control}
											render={({ field }) => (
												<Grid
													container
													spacing={2}
												>
													{amenities?.map((amenity: any) => {
														const current = field.value || [];
														// field.value may be an array of ids or array of objects
														const currentIds = (Array.isArray(current) ? current : []).map(
															(v: any) =>
																typeof v === 'string' ? v : v?.id || v?._id || v
														);
														const checked = currentIds.includes(amenity.id);

														return (
															<Grid
																key={amenity.id || amenity._id || amenity.name}
																size={{ sm: 12, md: 12 }}
															>
																<FormControlLabel
																	control={
																		<Checkbox
																			checked={checked}
																			onChange={(e) => {
																				const ids = currentIds.slice();
																				if (e.target.checked) {
																					// add id if not present
																					if (!ids.includes(amenity.id))
																						ids.push(amenity.id);
																					field.onChange(ids);
																				} else {
																					// remove id
																					field.onChange(
																						ids.filter(
																							(id: string) =>
																								id !== amenity.id
																						)
																					);
																				}
																			}}
																		/>
																	}
																	label={amenity.name}
																/>
															</Grid>
														);
													})}
												</Grid>
											)}
										/>
									</Grid>
								</Grid>
							</div>

							<Divider />

							{/* Operating Hours */}
							<div>
								<div className="mb-4 flex items-center justify-between">
									<Typography
										variant="h6"
										className="font-semibold"
									>
										TimeSlots
									</Typography>
									<Button
										size="small"
										startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
										onClick={() =>
											appendTimeSlot(
												TimeSlotModel({
													startTime: "09:00",
													endTime: "17:00",
													price: 0,
													roomId: room.id,
													isOvernight: false
												})
											)
										}
									>
										Add Time Slot
									</Button>
								</div>

								<div className="space-y-4">
									{timeslotFields.map((field, index) => (
										<Paper
											key={field.id}
											className="bg-gray-50 p-4 dark:bg-gray-900"
											elevation={0}
										>
											<div className="flex items-start gap-3">
												<div className="flex-1">
													<Grid
														container
														spacing={2}
													>
														<Grid size={{ sm: 12, md: 2 }}>
															<Controller
																name={`timeslots.${index}.isOvernight`}
																control={control}
																render={({ field }) => (
																	<FormControlLabel
																		control={
																			<Checkbox
																				checked={!!field.value}
																				onChange={(e) => field.onChange(e.target.checked)}
																			/>
																		}
																		label="Overnight"
																	/>
																)}
															/>
														</Grid>
														<Grid size={{ sm: 12, md: 3 }}>
															<Controller
																name={`timeslots.${index}.startTime`}
																control={control}
																render={({ field }) => (
																	<TextField
																		{...field}
																		label="Start Time"
																		type="time"
																		fullWidth
																		size="small"
																		InputLabelProps={{
																			shrink: true
																		}}
																	/>
																)}
															/>
														</Grid>
														<Grid size={{ sm: 12, md: 3 }}>
															<Controller
																name={`timeslots.${index}.endTime`}
																control={control}
																render={({ field }) => (
																	<TextField
																		{...field}
																		label="End Time"
																		type="time"
																		fullWidth
																		size="small"
																		InputLabelProps={{
																			shrink: true
																		}}
																	/>
																)}
															/>
														</Grid>
														<Grid size={{ sm: 12, md: 3 }}>
															<Controller
																name={`timeslots.${index}.price`}
																control={control}
																render={({ field }) => (
																	<TextField
																		{...field}
																		label="Price"
																		type="number"
																		fullWidth
																		size="small"
																		InputLabelProps={{
																			shrink: true
																		}}
																		onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
																	/>
																)}
															/>
														</Grid>
													</Grid>
												</div>
									<div className="flex gap-2">
										<IconButton
											size="small"
											color="primary"
											onClick={() => {
												const timeslotData = watch(`timeslots.${index}`);
												// Check if it's a new timeslot (local ID) or existing (server ID)
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
											}}
										>
											<FuseSvgIcon>lucide:save</FuseSvgIcon>
										</IconButton>
										<IconButton
											size="small"
											color="error"
											onClick={() => {
												// Only call API if ID exists and is not a local temp ID
												if (field.id && !field.id.startsWith('timeSlot-')) {
													// Existing timeslot from server - delete via API
													deleteTimeSlot({ timeslotId: field.id, roomId });
												}
												// Always remove from form array
												removeTimeSlot(index);
											}}
										>
											<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>
										</IconButton>
									</div>
								</div>
										</Paper>
									))}
								</div>
							</div>
						</div>
					</Paper>
				)}
			</Container>
		</FormProvider>
	);
}

export default RoomView;
