'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Alert,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Paper,
	Switch,
	TextField,
	Tooltip,
	Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useEffect, useState } from 'react';
import {
	Control,
	Controller,
	FieldArrayWithId,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormGetValues,
	UseFormSetValue,
	useWatch
} from 'react-hook-form';
import { useTimeSlotAvailability } from '../../../api/hooks/useTimeSlotAvailability';
import TimeSlotModel from '../../../api/models/TimeSlotModel';

type TimeSlot = {
	id?: string;
	startTime?: string;
	endTime?: string;
	price?: number;
	isOvernight?: boolean;
	roomId?: string;
};

type TimeSlotStatus = 'new' | 'saved' | 'modified';

type RoomTimeSlotsFormProps = {
	control: Control<any>;
	fields: FieldArrayWithId<any, 'timeslots', 'id'>[];
	append: UseFieldArrayAppend<any, 'timeslots'>;
	remove: UseFieldArrayRemove;
	getValues: UseFormGetValues<any>;
	setValue: UseFormSetValue<any>;
	roomId: string;
	onSaveTimeSlot: (index: number, data: TimeSlot) => void;
	onDeleteTimeSlot: (id: string | undefined, index: number) => void;
	isViewMode?: boolean; // Only show availability in view mode
};

// Helper to format number with thousand separators
const formatNumber = (value: number | string | undefined): string => {
	if (!value) return '';

	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Helper to parse formatted number back to number
const parseNumber = (value: string): number => {
	const rawValue = value.replace(/\./g, '');
	return isNaN(Number(rawValue)) ? 0 : Number(rawValue);
};

// Component for a single timeslot row with status tracking
function TimeSlotRow({
	field,
	index,
	control,
	getValues,
	setValue,
	onSave,
	onDelete,
	isAvailable = true
}: {
	field: FieldArrayWithId<any, 'timeslots', 'id'>;
	index: number;
	control: Control<any>;
	getValues: UseFormGetValues<any>;
	setValue: UseFormSetValue<any>;
	onSave: (index: number, data: TimeSlot) => void;
	onDelete: (id: string | undefined, index: number) => void;
	isAvailable?: boolean;
}) {
	const [originalValues, setOriginalValues] = useState<TimeSlot | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	// Watch all fields for this timeslot
	const watchedValues = useWatch({
		control,
		name: `timeslots.${index}`
	});

	// Determine status based on ID and changes
	const getStatus = useCallback((): TimeSlotStatus => {
		const currentId = watchedValues?.id || '';
		const isNew = !currentId || currentId.startsWith('timeSlot-');

		if (isNew) return 'new';

		if (originalValues) {
			const hasChanges =
				watchedValues?.startTime !== originalValues.startTime ||
				watchedValues?.endTime !== originalValues.endTime ||
				watchedValues?.price !== originalValues.price ||
				watchedValues?.isOvernight !== originalValues.isOvernight;

			if (hasChanges) return 'modified';
		}

		return 'saved';
	}, [watchedValues, originalValues]);

	// Initialize original values on mount
	useEffect(() => {
		if (!originalValues && watchedValues) {
			const currentId = watchedValues?.id || '';

			if (currentId && !currentId.startsWith('timeSlot-')) {
				setOriginalValues({ ...watchedValues });
			}
		}
	}, [watchedValues, originalValues]);

	const status = getStatus();

	// Status styles with availability
	const getStatusStyles = () => {
		// If unavailable, apply dimmed style
		if (!isAvailable) {
			return {
				borderColor: 'grey.300',
				borderWidth: 1,
				bgcolor: 'grey.50',
				opacity: 0.6
			};
		}

		switch (status) {
			case 'new':
				return {
					borderColor: 'success.main',
					borderWidth: 2,
					bgcolor: 'success.50',
					opacity: 1
				};
			case 'modified':
				return {
					borderColor: 'warning.main',
					borderWidth: 2,
					bgcolor: 'warning.50',
					opacity: 1
				};
			default:
				return {
					borderColor: 'success.light',
					borderWidth: 2,
					bgcolor: 'background.paper',
					opacity: 1
				};
		}
	};

	const statusInfo = {
		new: { label: 'Mới', color: 'success' as const, icon: 'lucide:sparkles' },
		modified: { label: 'Đã sửa', color: 'warning' as const, icon: 'lucide:edit-3' },
		saved: { label: 'Đã lưu', color: 'default' as const, icon: 'lucide:check' }
	};

	const handleSave = () => {
		const timeslotData = getValues(`timeslots.${index}`);
		onSave(index, timeslotData);
		// Update original values after save
		setOriginalValues({ ...timeslotData });
	};

	const handleCancel = () => {
		if (originalValues) {
			// Reset to original values
			setValue(`timeslots.${index}.startTime`, originalValues.startTime);
			setValue(`timeslots.${index}.endTime`, originalValues.endTime);
			setValue(`timeslots.${index}.price`, originalValues.price);
			setValue(`timeslots.${index}.isOvernight`, originalValues.isOvernight);
		}
	};

	const handleDeleteClick = () => {
		// If it's a new unsaved item, delete immediately without API call
		// We pass the actual timeslot ID (watchedValues?.id), not the react-hook-form field.id
		if (status === 'new') {
			onDelete(watchedValues?.id, index);
		} else {
			// Show confirmation dialog for saved items
			setDeleteDialogOpen(true);
		}
	};

	const handleConfirmDelete = () => {
		setDeleteDialogOpen(false);
		// Pass the actual timeslot ID for API deletion
		onDelete(watchedValues?.id, index);
	};

	const styles = getStatusStyles();

	return (
		<>
			<Paper
				sx={{
					p: 2,
					border: styles.borderWidth,
					borderStyle: 'solid',
					borderColor: styles.borderColor,
					bgcolor: styles.bgcolor,
					transition: 'all 0.2s ease-in-out'
				}}
				elevation={0}
			>
				{/* Header with status badge */}
				<Box className="mb-3 flex items-center justify-between">
					<Box className="flex items-center gap-2">
						<Typography
							variant="subtitle2"
							color="text.secondary"
						>
							Khung giờ #{index + 1}
						</Typography>
						<Chip
							size="small"
							label={statusInfo[status].label}
							color={statusInfo[status].color}
							icon={<FuseSvgIcon size={14}>{statusInfo[status].icon}</FuseSvgIcon>}
							variant={status === 'saved' ? 'outlined' : 'filled'}
						/>
						{/* Availability badge */}
						{!isAvailable && (
							<Chip
								size="small"
								label="Đã đặt"
								color="error"
								icon={<FuseSvgIcon size={14}>lucide:calendar-x</FuseSvgIcon>}
								variant="filled"
							/>
						)}
						{isAvailable && status === 'saved' && (
							<Chip
								size="small"
								label="Có sẵn"
								color="success"
								icon={<FuseSvgIcon size={14}>lucide:calendar-check</FuseSvgIcon>}
								variant="outlined"
							/>
						)}
					</Box>

					{/* Actions */}
					<Box className="flex items-center gap-1">
						{status === 'modified' && (
							<Tooltip title="Hủy thay đổi">
								<IconButton
									size="small"
									color="default"
									onClick={handleCancel}
								>
									<FuseSvgIcon size={18}>lucide:undo-2</FuseSvgIcon>
								</IconButton>
							</Tooltip>
						)}
						{status !== 'saved' && (
							<Tooltip title="Lưu khung giờ">
								<IconButton
									size="small"
									color="primary"
									onClick={handleSave}
								>
									<FuseSvgIcon size={18}>lucide:save</FuseSvgIcon>
								</IconButton>
							</Tooltip>
						)}
						<Tooltip title="Xóa">
							<IconButton
								size="small"
								color="error"
								onClick={handleDeleteClick}
							>
								<FuseSvgIcon size={18}>lucide:trash-2</FuseSvgIcon>
							</IconButton>
						</Tooltip>
					</Box>
				</Box>

				{/* Form fields */}
				<Grid
					container
					spacing={2}
					alignItems="center"
				>
					{/* Start Time */}
					<Grid size={{ xs: 6, sm: 3 }}>
						<Controller
							name={`timeslots.${index}.startTime`}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Bắt đầu"
									type="time"
									fullWidth
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
							)}
						/>
					</Grid>

					{/* End Time */}
					<Grid size={{ xs: 6, sm: 3 }}>
						<Controller
							name={`timeslots.${index}.endTime`}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Kết thúc"
									type="time"
									fullWidth
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
							)}
						/>
					</Grid>

					{/* Price */}
					<Grid size={{ xs: 8, sm: 4 }}>
						<Controller
							name={`timeslots.${index}.price`}
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Giá"
									fullWidth
									size="small"
									InputLabelProps={{ shrink: true }}
									InputProps={{
										endAdornment: <InputAdornment position="end">₫</InputAdornment>
									}}
									value={formatNumber(field.value)}
									onChange={(e) => field.onChange(parseNumber(e.target.value))}
								/>
							)}
						/>
					</Grid>

					{/* Overnight toggle */}
					<Grid size={{ xs: 4, sm: 2 }}>
						<Controller
							name={`timeslots.${index}.isOvernight`}
							control={control}
							render={({ field }) => (
								<FormControlLabel
									control={
										<Switch
											checked={!!field.value}
											onChange={(e) => field.onChange(e.target.checked)}
											color="primary"
										/>
									}
									label={
										<Typography
											variant="body2"
											sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
										>
											<FuseSvgIcon size={16}>lucide:moon</FuseSvgIcon>
											Qua đêm
										</Typography>
									}
									labelPlacement="start"
									sx={{ ml: 0, justifyContent: 'flex-end' }}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</Paper>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
			>
				<DialogTitle>Xác nhận xóa</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Bạn có chắc muốn xóa khung giờ này không? Hành động này không thể hoàn tác.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
					>
						Xóa
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

function RoomTimeSlotsForm(props: RoomTimeSlotsFormProps) {
	const { control, fields, append, remove, getValues, setValue, roomId, onSaveTimeSlot, onDeleteTimeSlot, isViewMode = false } = props;

	// Date picker state
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

	// Fetch available time slots for selected date
	const { data: availableTimeSlots = [], isLoading: isLoadingAvailability } = useTimeSlotAvailability(
		roomId,
		selectedDate
	);

	// Watch all timeslots to check for unsaved items
	const watchedTimeslots = useWatch({
		control,
		name: 'timeslots'
	});

	// Check if there are any unsaved (new) timeslots
	const hasUnsavedTimeslots = (watchedTimeslots || []).some((ts: TimeSlot) => {
		const id = ts?.id || '';
		return !id || id.startsWith('timeSlot-');
	});

	// Helper function to check if a timeslot is available
	const isTimeSlotAvailable = useCallback((timeslot: TimeSlot): boolean => {
		if (!selectedDate || availableTimeSlots.length === 0) {
			return true; // Default to available if no date selected or no data
		}

		// Check if this timeslot exists in the available slots
		// Match by startTime and endTime
		return availableTimeSlots.some(
			(availableSlot) =>
				availableSlot.startTime === timeslot.startTime &&
				availableSlot.endTime === timeslot.endTime
		);
	}, [selectedDate, availableTimeSlots]);

	const handleAddTimeSlot = () => {
		append(
			TimeSlotModel({
				startTime: '08:00',
				endTime: '22:00',
				price: 100000,
				roomId,
				isOvernight: false
			})
		);
	};

	const handleDelete = (id: string | undefined, index: number) => {
		onDeleteTimeSlot(id, index);
		remove(index);
	};

	return (
		<div>
			{/* Header */}
			<Box className="mb-4 flex items-center justify-between">
				<div>
					<Typography
						variant="h6"
						className="font-semibold"
					>
						Khung giờ
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Thiết lập các khung giờ cho phòng này
					</Typography>
				</div>
				<Tooltip title={hasUnsavedTimeslots ? 'Vui lòng lưu khung giờ hiện tại trước' : ''}>
					<span>
						<Button
							variant="contained"
							size="small"
							startIcon={<FuseSvgIcon size={16}>lucide:plus</FuseSvgIcon>}
							onClick={handleAddTimeSlot}
							disabled={hasUnsavedTimeslots}
						>
							Thêm khung giờ
						</Button>
					</span>
				</Tooltip>
			</Box>

			{/* Date Picker for checking availability - Only in view mode */}
			{isViewMode && (
				<Box className="mb-4">
					<Paper sx={{ p: 2, bgcolor: 'background.default' }} elevation={0}>
						<Box className="flex items-center gap-3">
							<FuseSvgIcon size={20} color="action">lucide:calendar</FuseSvgIcon>
							<Box className="flex-1">
								<DatePicker
									label="Kiểm tra tình trạng theo ngày"
									value={selectedDate}
									onChange={(newDate) => setSelectedDate(newDate)}
									slotProps={{
										textField: {
											size: 'small',
											fullWidth: true
										}
									}}
								/>
							</Box>
							{isLoadingAvailability && (
								<Typography variant="caption" color="text.secondary">
									Đang kiểm tra...
								</Typography>
							)}
						</Box>
						<Typography variant="caption" color="text.secondary" className="mt-2 block">
							Chọn ngày để xem khung giờ nào còn trống hoặc đã được đặt
						</Typography>
					</Paper>
				</Box>
			)}

			{/* Empty state */}
			{fields.length === 0 && (
				<Alert
					severity="info"
					icon={<FuseSvgIcon>lucide:clock</FuseSvgIcon>}
				>
					Chưa có khung giờ nào. Nhấn "Thêm khung giờ" để bắt đầu.
				</Alert>
			)}

			{/* Timeslots list */}
			<div className="space-y-3">
				{fields.map((field, index) => {
					const timeslot = watchedTimeslots?.[index];
					const isAvailable = timeslot ? isTimeSlotAvailable(timeslot) : true;

					return (
						<TimeSlotRow
							key={field.id}
							field={field}
							index={index}
							control={control}
							getValues={getValues}
							setValue={setValue}
							onSave={onSaveTimeSlot}
							onDelete={handleDelete}
							isAvailable={isAvailable}
						/>
					);
				})}
			</div>

			{/* Helper text */}
			{fields.length > 0 && (
				<Box
					className="mt-4 flex items-center gap-4"
					sx={{ opacity: 0.7 }}
				>
					<Box className="flex items-center gap-1">
						<Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'success.main' }} />
						<Typography variant="caption">Mới</Typography>
					</Box>
					<Box className="flex items-center gap-1">
						<Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'warning.main' }} />
						<Typography variant="caption">Đã sửa</Typography>
					</Box>
					<Box className="flex items-center gap-1">
						<Box sx={{ width: 12, height: 12, borderRadius: 1, border: 1, borderColor: 'divider' }} />
						<Typography variant="caption">Đã lưu</Typography>
					</Box>
				</Box>
			)}
		</div>
	);
}

export default RoomTimeSlotsForm;
