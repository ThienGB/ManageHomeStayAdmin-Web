"use client";

import FuseLoading from "@fuse/core/FuseLoading";
import Link from "@fuse/core/Link";
import useParams from "@fuse/hooks/useParams";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { z } from "zod";
import { useAttraction } from "../../../api/hooks/useAttraction";

import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
	Autocomplete,
	Box,
	CardMedia,
	Checkbox,
	Chip,
	Container,
	Divider,
	FormControl,
	FormControlLabel,
	IconButton,
	InputLabel,
	LinearProgress,
	MenuItem,
	Paper,
	Rating,
	Select,
	TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { format } from "date-fns";
import { useAmenitiesForFilter } from "../../../api/hooks/useAmenitiesForFilter";
import { useAmenityCategoriesForFilter } from "../../../api/hooks/useAmenityCategoriesForFilter";
import { useUpdateAttraction } from "../../../api/hooks/useUpdateAttraction";
import { Partner } from "../../../api/types";
import AttractionMap from "../../ui/AttractionMap";
import { useGlobalContext } from "@/contexts/GlobalContext/useGlobalContext";

const schema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters"),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters"),
		price: z.number().min(0, "Price must be positive"),
		status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
		contact: z
			.object({
				phone: z.string().optional(),
				email: z.string().email().optional(),
				website: z.string().url().optional().or(z.literal("")),
			})
			.optional(),
		location: z
			.object({
				type: z.string().optional(),
				coordinates: z.array(z.number()).optional(),
				address: z.string().optional(),
				city: z.string().optional(),
			})
			.optional(),
		amenities: z.array(z.string()).optional(),
		operatingHour: z
			.array(
				z.object({
					day: z.string().optional(),
					startDay: z.string().optional(),
					endDay: z.string().optional(),
					openTime: z.string().optional(),
					closeTime: z.string().optional(),
					isFullDay: z.boolean().optional(),
					_id: z.string().optional(),
				})
			)
			.optional(),
	})
	.passthrough(); // Allow additional fields

function AttractionView() {
	const routeParams = useParams();
	const { attractionId } = routeParams as { attractionId: string };
	const {
		data: attraction,
		isLoading,
		isError,
	} = useAttraction(attractionId);

	const [isEditMode, setIsEditMode] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [categorySearch, setCategorySearch] = useState("");
	const [amenitySearch, setAmenitySearch] = useState("");

	const { data: categoriesData } =
		useAmenityCategoriesForFilter(categorySearch);
	const { data: amenitiesData } = useAmenitiesForFilter(
		amenitySearch,
		selectedCategory
	);
	const { mutate: updateAttraction } = useUpdateAttraction();
	const { openModal } = useGlobalContext();

	const categories = categoriesData?.data?.content || [];
	const amenities = amenitiesData?.data?.content || [];

	const methods = useForm({
		mode: "onChange",
		defaultValues: {},
		resolver: zodResolver(schema),
	});

	const {
		reset,
		control,
		watch,
		formState: { errors },
	} = methods;
	const {
		fields: operatingHourFields,
		append: appendHour,
		remove: removeHour,
	} = useFieldArray({
		control,
		name: "operatingHour",
	});

	useEffect(() => {
		if (attraction) {
			reset({ ...attraction });
		}
	}, [attraction, reset]);

	const partner =
		typeof attraction?.partnerId === "object"
			? (attraction.partnerId as Partner)
			: null;
	const statusColor =
		attraction?.status === "APPROVED"
			? "success"
			: attraction?.status === "PENDING"
				? "warning"
				: "error";

	const handleSave = (data: any) => {
		updateAttraction(data);
		setIsEditMode(false);
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex h-full flex-1 flex-col items-center justify-center"
			>
				<Typography color="text.secondary" variant="h5">
					There is no such attraction!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/attractions"
					color="inherit"
				>
					Go to Attractions Page
				</Button>
			</motion.div>
		);
	}

	return (
		<FormProvider {...methods}>
			<Container maxWidth="xl" className="py-6">
				{/* Header Actions */}
				<div className="mb-6 flex items-center justify-between">
					<Button
						component={Link}
						to="/apps/attractions"
						startIcon={<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>}
					>
						Back to Attractions
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
									startIcon={
										<FuseSvgIcon>lucide:save</FuseSvgIcon>
									}
								>
									Save Changes
								</Button>
							</>
						) : (
							<Button
								variant="contained"
								color="secondary"
								onClick={() => setIsEditMode(true)}
								startIcon={
									<FuseSvgIcon>lucide:edit</FuseSvgIcon>
								}
							>
								Edit
							</Button>
						)}
					</div>
				</div>

				{!isEditMode ? (
					/* VIEW MODE */
					<div className="space-y-8">
						{/* Hero Section */}
						<Paper
							elevation={0}
							className="overflow-hidden rounded-2xl"
						>
							{/* Image Gallery */}
							{attraction?.images &&
								attraction.images.length > 0 && (
									<div className="group relative cursor-pointer">
										<CardMedia
											component="img"
											height="500"
											image={
												attraction.images[
													currentImageIndex
												]
											}
											alt={attraction.name}
											className="h-[500px] w-full object-cover"
											onClick={() =>
												openModal(
													attraction.images,
													currentImageIndex
												)
											}
										/>
										{/* Overlay to indicate clickable */}
										<div
											className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20"
											onClick={() =>
												openModal(
													attraction.images,
													currentImageIndex
												)
											}
										>
											<div className="rounded-lg bg-white/90 px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100">
												<div className="flex items-center gap-2">
													<FuseSvgIcon size={20}>
														lucide:maximize-2
													</FuseSvgIcon>
													<Typography
														variant="body2"
														fontWeight="medium"
													>
														Click to view gallery
													</Typography>
												</div>
											</div>
										</div>
										{attraction.images.length > 1 && (
											<>
												<IconButton
													className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/90 hover:bg-white"
													onClick={(e) => {
														e.stopPropagation();
														setCurrentImageIndex(
															(prev) =>
																prev === 0
																	? attraction
																			.images
																			.length -
																		1
																	: prev - 1
														);
													}}
												>
													<FuseSvgIcon>
														lucide:chevron-left
													</FuseSvgIcon>
												</IconButton>
												<IconButton
													className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/90 hover:bg-white"
													onClick={(e) => {
														e.stopPropagation();
														setCurrentImageIndex(
															(prev) =>
																prev ===
																attraction
																	.images
																	.length -
																	1
																	? 0
																	: prev + 1
														);
													}}
												>
													<FuseSvgIcon>
														lucide:chevron-right
													</FuseSvgIcon>
												</IconButton>
											</>
										)}
										{/* Thumbnail Strip */}
										<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2">
											{attraction.images
												.slice(0, 5)
												.map((img, idx) => (
													<button
														key={idx}
														onClick={(e) => {
															e.stopPropagation();
															setCurrentImageIndex(
																idx
															);
														}}
														className={`h-16 w-16 overflow-hidden rounded border-2 transition-all ${
															idx ===
															currentImageIndex
																? "scale-110 border-white"
																: "border-transparent opacity-70"
														}`}
													>
														<img
															src={img}
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
											{attraction?.name}
										</Typography>
										<div className="flex flex-wrap items-center gap-4">
											<div className="flex items-center gap-2">
												<FuseSvgIcon
													size={20}
													color="action"
												>
													lucide:map-pin
												</FuseSvgIcon>
												<Typography
													variant="body2"
													color="text.secondary"
												>
													{
														attraction?.location
															?.address
													}
													,{" "}
													{attraction?.location?.city}
												</Typography>
											</div>
											<div className="flex items-center gap-2">
												<Rating
													value={
														attraction?.averageRating ||
														0
													}
													precision={0.5}
													readOnly
												/>
												<Typography
													variant="body2"
													color="text.secondary"
												>
													({attraction?.totalRatings}{" "}
													Reviews)
												</Typography>
											</div>
										</div>
									</div>
									<div className="text-right">
										<Typography
											variant="caption"
											color="text.secondary"
										>
											From
										</Typography>
										<Typography
											variant="h4"
											className="text-primary font-bold"
										>
											{attraction?.price?.toLocaleString(
												"vi-VN"
											)}{" "}
											VND
										</Typography>
										<Typography variant="caption">
											/ Person
										</Typography>
									</div>
								</div>
								<Chip
									label={attraction?.status}
									color={statusColor}
									size="medium"
									className="mb-4"
								/>
							</div>
						</Paper>

						<Grid container spacing={4}>
							<Grid item xs={12} md={8}>
								{/* Customer Reviews */}
								<Paper className="mb-4 p-6" elevation={1}>
									<Typography
										variant="h5"
										className="mb-4 font-bold"
									>
										Customer Reviews
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										className="mb-6"
									>
										{attraction?.description}
									</Typography>

									<div className="mb-6 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
										<Grid container spacing={4}>
											<Grid
												item
												xs={12}
												md={4}
												className="text-center"
											>
												<Typography
													variant="h2"
													className="text-primary mb-2 font-bold"
												>
													{attraction?.averageRating?.toFixed(
														1
													) || "0.0"}
												</Typography>
												<Typography
													variant="h6"
													className="mb-1 font-semibold"
												>
													Excellent
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
												>
													Based On{" "}
													{attraction?.totalRatings}{" "}
													Reviews
												</Typography>
											</Grid>
											<Grid item xs={12} md={8}>
												<div className="space-y-3">
													{[
														{
															label: "Location",
															value: attraction?.averageAttractionRate,
														},
														{
															label: "Amenities",
															value: attraction?.averageServiceRate,
														},
														{
															label: "Services",
															value: attraction?.averageServiceRate,
														},
														{
															label: "Price",
															value: attraction?.averageRating,
														},
														{
															label: "Rooms",
															value: attraction?.averageRoomRate,
														},
													].map((item, idx) => (
														<div
															key={idx}
															className="flex items-center gap-3"
														>
															<Typography
																variant="body2"
																className="w-24 font-medium"
															>
																{item.label}
															</Typography>
															<Box className="flex-1">
																<LinearProgress
																	variant="determinate"
																	value={
																		(item.value ||
																			0) *
																		20
																	}
																	className="h-2 rounded-full"
																	sx={{
																		backgroundColor:
																			"rgba(0,0,0,0.1)",
																		"& .MuiLinearProgress-bar":
																			{
																				borderRadius:
																					"8px",
																			},
																	}}
																/>
															</Box>
															<Typography
																variant="body2"
																className="w-12 text-right font-semibold"
															>
																{item.value?.toFixed(
																	1
																) || "0.0"}
																/5
															</Typography>
														</div>
													))}
												</div>
											</Grid>
										</Grid>
									</div>
								</Paper>

								{/* About This Tour */}
								<Paper className="mb-4 p-6" elevation={1}>
									<Typography
										variant="h5"
										className="mb-4 font-bold"
									>
										About This Tour
									</Typography>
									<Typography
										variant="body1"
										className="leading-relaxed text-gray-700 dark:text-gray-300"
									>
										{attraction?.description}
									</Typography>
								</Paper>

								{/* Trip Highlights - Operating Hours */}
								{attraction?.operatingHour &&
									attraction.operatingHour.length > 0 && (
										<Paper
											className="mb-4 p-6"
											elevation={1}
										>
											<Typography
												variant="h5"
												className="mb-4 font-bold"
											>
												Trip Highlights
											</Typography>
											<div className="space-y-3">
												{attraction.operatingHour.map(
													(hour, index) => (
														<div
															key={index}
															className="flex items-center gap-3"
														>
															<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
																<FuseSvgIcon
																	size={16}
																	className="text-primary"
																>
																	lucide:check
																</FuseSvgIcon>
															</div>
															<Typography variant="body1">
																{hour.startDay &&
																hour.endDay
																	? `Open ${hour.startDay} - ${hour.endDay}, ${hour.openTime} - ${hour.closeTime}`
																	: `Open ${hour.day}, ${hour.openTime} - ${hour.closeTime}`}
															</Typography>
														</div>
													)
												)}
											</div>
										</Paper>
									)}

								{/* Amenities */}
								{attraction?.amenities &&
									attraction.amenities.length > 0 && (
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
											<Typography
												variant="body2"
												color="text.secondary"
												className="mb-6"
											>
												{attraction.description}
											</Typography>
											<Grid container spacing={3}>
												{attraction.amenities.map(
													(amenity, idx) => (
														<Grid
															key={idx}
															item
															size={{
																xs: 12,
																sm: 6,
															}}
														>
															<div className="flex items-center gap-2">
																<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
																	<FuseSvgIcon
																		size={
																			16
																		}
																		className="text-primary"
																	>
																		lucide:check
																	</FuseSvgIcon>
																</div>
																<Typography variant="body2">
																	{amenity}
																</Typography>
															</div>
														</Grid>
													)
												)}
											</Grid>
										</Paper>
									)}

								{/* Location */}
								<Paper className="p-6" elevation={1}>
									<Typography
										variant="h5"
										className="mb-4 font-bold"
									>
										Location
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										className="mb-4"
									>
										{attraction?.location?.address}
									</Typography>
									<AttractionMap
										coordinates={
											attraction?.location?.coordinates
										}
										name={attraction?.name}
										className="overflow-hidden rounded-lg"
									/>
								</Paper>
							</Grid>

							{/* Sidebar */}
							<Grid xs={12} md={4}>
								<div className="sticky top-4 space-y-4">
									{/* Contact */}
									<Paper className="p-6" elevation={1}>
										<Typography
											variant="h6"
											className="mb-4 font-semibold"
										>
											Contact Information
										</Typography>
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<FuseSvgIcon
													size={20}
													color="action"
												>
													lucide:phone
												</FuseSvgIcon>
												<Typography variant="body2">
													{attraction?.contact?.phone}
												</Typography>
											</div>
											<div className="flex items-center gap-3">
												<FuseSvgIcon
													size={20}
													color="action"
												>
													lucide:mail
												</FuseSvgIcon>
												<Typography variant="body2">
													{attraction?.contact?.email}
												</Typography>
											</div>
											{attraction?.contact?.website && (
												<div className="flex items-center gap-3">
													<FuseSvgIcon
														size={20}
														color="action"
													>
														lucide:globe
													</FuseSvgIcon>
													<Typography
														variant="body2"
														component="a"
														href={
															attraction.contact
																.website
														}
														target="_blank"
														className="text-primary hover:underline"
													>
														{
															attraction.contact
																.website
														}
													</Typography>
												</div>
											)}
										</div>
									</Paper>

									{/* Partner */}
									{partner && (
										<Paper className="p-6" elevation={1}>
											<Typography
												variant="h6"
												className="mb-4 font-semibold"
											>
												Partner
											</Typography>
											<Typography
												variant="body1"
												className="mb-1 font-medium"
											>
												{partner.name}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{partner.email}
											</Typography>
										</Paper>
									)}

									{/* Important Dates */}
									<Paper className="p-6" elevation={1}>
										<Typography
											variant="h6"
											className="mb-4 font-semibold"
										>
											Important Dates
										</Typography>
										<div className="space-y-3">
											<div>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Registered
												</Typography>
												<Typography variant="body2">
													{attraction?.registerDate
														? format(
																new Date(
																	attraction.registerDate
																),
																"MMM dd, yyyy"
															)
														: "N/A"}
												</Typography>
											</div>
											<Divider />
											<div>
												<Typography
													variant="caption"
													color="text.secondary"
												>
													Last Updated
												</Typography>
												<Typography variant="body2">
													{attraction?.updatedAt
														? format(
																new Date(
																	attraction.updatedAt
																),
																"MMM dd, yyyy"
															)
														: "N/A"}
												</Typography>
											</div>
										</div>
									</Paper>
								</div>
							</Grid>
						</Grid>
					</div>
				) : (
					/* EDIT MODE */
					<Paper className="p-8">
						<Typography variant="h4" className="mb-6 font-bold">
							Edit Attraction
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
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Controller
											name="name"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Attraction Name"
													fullWidth
													required
													error={!!errors.name}
													helperText={
														errors.name
															?.message as string
													}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12}>
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
													helperText={
														errors.description
															?.message as string
													}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<Controller
											name="price"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Price (VND)"
													type="number"
													fullWidth
													required
													error={!!errors.price}
													helperText={
														errors.price
															?.message as string
													}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<Controller
											name="status"
											control={control}
											render={({ field }) => (
												<FormControl fullWidth>
													<InputLabel>
														Status
													</InputLabel>
													<Select
														{...field}
														label="Status"
													>
														<MenuItem value="PENDING">
															Pending
														</MenuItem>
														<MenuItem value="APPROVED">
															Approved
														</MenuItem>
														<MenuItem value="REJECTED">
															Rejected
														</MenuItem>
													</Select>
												</FormControl>
											)}
										/>
									</Grid>
								</Grid>
							</div>

							<Divider />

							{/* Contact Information */}
							<div>
								<Typography
									variant="h6"
									className="mb-4 font-semibold"
								>
									Contact Information
								</Typography>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Controller
											name="contact.phone"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Phone Number"
													fullWidth
													InputProps={{
														startAdornment: (
															<FuseSvgIcon
																size={20}
																className="mr-2"
															>
																lucide:phone
															</FuseSvgIcon>
														),
													}}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<Controller
											name="contact.email"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Email"
													type="email"
													fullWidth
													InputProps={{
														startAdornment: (
															<FuseSvgIcon
																size={20}
																className="mr-2"
															>
																lucide:mail
															</FuseSvgIcon>
														),
													}}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12}>
										<Controller
											name="contact.website"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Website"
													fullWidth
													InputProps={{
														startAdornment: (
															<FuseSvgIcon
																size={20}
																className="mr-2"
															>
																lucide:globe
															</FuseSvgIcon>
														),
													}}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</div>

							<Divider />

							{/* Location */}
							<div>
								<Typography
									variant="h6"
									className="mb-4 font-semibold"
								>
									Location
								</Typography>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Controller
											name="location.address"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Address"
													fullWidth
													multiline
													rows={2}
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<Controller
											name="location.city"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="City"
													fullWidth
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<Controller
											name="location.coordinates.0"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Longitude"
													type="number"
													fullWidth
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={3}>
										<Controller
											name="location.coordinates.1"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Latitude"
													type="number"
													fullWidth
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
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Autocomplete
											options={categories}
											getOptionLabel={(option) =>
												option.name
											}
											value={
												categories.find(
													(c) =>
														c.id ===
														selectedCategory
												) || null
											}
											onChange={(_, newValue) =>
												setSelectedCategory(
													newValue?.id || ""
												)
											}
											onInputChange={(_, value) =>
												setCategorySearch(value)
											}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Select Category"
													placeholder="Choose a category first"
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<Controller
											name="amenities"
											control={control}
											render={({ field }) => (
												<Autocomplete
													{...field}
													multiple
													options={amenities}
													disabled={!selectedCategory}
													getOptionLabel={(option) =>
														option.name
													}
													value={
														amenities.filter((a) =>
															field.value?.includes(
																a.id
															)
														) || []
													}
													onChange={(_, newValue) =>
														field.onChange(
															newValue.map(
																(v) => v.id
															)
														)
													}
													onInputChange={(_, value) =>
														setAmenitySearch(value)
													}
													renderInput={(params) => (
														<TextField
															{...params}
															label="Select Amenities"
															placeholder={
																selectedCategory
																	? "Select amenities"
																	: "Select category first"
															}
														/>
													)}
													renderOption={(
														props,
														option,
														{ selected }
													) => (
														<li {...props}>
															<Checkbox
																checked={
																	selected
																}
																className="mr-2"
															/>
															{option.name}
														</li>
													)}
												/>
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
										Operating Hours
									</Typography>
									<Button
										size="small"
										startIcon={
											<FuseSvgIcon>
												lucide:plus
											</FuseSvgIcon>
										}
										onClick={() =>
											appendHour({
												day: "MONDAY",
												openTime: "09:00",
												closeTime: "17:00",
												startDay: "MONDAY",
												endDay: "MONDAY",
											})
										}
									>
										Add Day
									</Button>
								</div>

								<div className="space-y-4">
									{operatingHourFields.map((field, index) => (
										<Paper
											key={field.id}
											className="bg-gray-50 p-4 dark:bg-gray-900"
											elevation={0}
										>
											<div className="flex items-start gap-3">
												<div className="flex-1">
													<Grid container spacing={2}>
														<Grid size={{ xs: 12, md: 6 }}>
															<Controller
																name={`operatingHour.${index}.isFullDay`}
																control={
																	control
																}
																render={({
																	field,
																}) => (
																	<FormControlLabel
																		control={
																			<Checkbox
																				{...field}
																				checked={
																					field.value ||
																					false
																				}
																			/>
																		}
																		label="Open 24 hours"
																	/>
																)}
															/>
														</Grid>
														<Grid
															item
															xs={12}
															md={6}
														>
															<Controller
																name={`operatingHour.${index}.startDay`}
																control={
																	control
																}
																render={({
																	field,
																}) => (
																	<FormControl
																		fullWidth
																		size="small"
																	>
																		<InputLabel>
																			From
																			Day
																		</InputLabel>
																		<Select
																			{...field}
																			label="From Day"
																		>
																			{[
																				"MONDAY",
																				"TUESDAY",
																				"WEDNESDAY",
																				"THURSDAY",
																				"FRIDAY",
																				"SATURDAY",
																				"SUNDAY",
																			].map(
																				(
																					day
																				) => (
																					<MenuItem
																						key={
																							day
																						}
																						value={
																							day
																						}
																					>
																						{
																							day
																						}
																					</MenuItem>
																				)
																			)}
																		</Select>
																	</FormControl>
																)}
															/>
														</Grid>
														<Grid
															item
															xs={12}
															md={6}
														>
															<Controller
																name={`operatingHour.${index}.endDay`}
																control={
																	control
																}
																render={({
																	field,
																}) => (
																	<FormControl
																		fullWidth
																		size="small"
																	>
																		<InputLabel>
																			To
																			Day
																		</InputLabel>
																		<Select
																			{...field}
																			label="To Day"
																		>
																			{[
																				"MONDAY",
																				"TUESDAY",
																				"WEDNESDAY",
																				"THURSDAY",
																				"FRIDAY",
																				"SATURDAY",
																				"SUNDAY",
																			].map(
																				(
																					day
																				) => (
																					<MenuItem
																						key={
																							day
																						}
																						value={
																							day
																						}
																					>
																						{
																							day
																						}
																					</MenuItem>
																				)
																			)}
																		</Select>
																	</FormControl>
																)}
															/>
														</Grid>
														<Grid
															size={{ xs: 12, md: 6 }}
														>
															<Controller
																name={`operatingHour.${index}.openTime`}
																control={
																	control
																}
																render={({
																	field,
																}) => (
																	<TextField
																		{...field}
																		label="Open Time"
																		type="time"
																		fullWidth
																		size="small"
																		InputLabelProps={{
																			shrink: true,
																		}}
																		disabled={watch(
																			`operatingHour.${index}.isFullDay`
																		)}
																	/>
																)}
															/>
														</Grid>
														<Grid
															item
															xs={12}
															md={6}
														>
															<Controller
																name={`operatingHour.${index}.closeTime`}
																control={
																	control
																}
																render={({
																	field,
																}) => (
																	<TextField
																		{...field}
																		label="Close Time"
																		type="time"
																		fullWidth
																		size="small"
																		InputLabelProps={{
																			shrink: true,
																		}}
																		disabled={watch(
																			`operatingHour.${index}.isFullDay`
																		)}
																	/>
																)}
															/>
														</Grid>
													</Grid>
												</div>
												<IconButton
													size="small"
													color="error"
													onClick={() =>
														removeHour(index)
													}
												>
													<FuseSvgIcon>
														lucide:trash-2
													</FuseSvgIcon>
												</IconButton>
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

export default AttractionView;
