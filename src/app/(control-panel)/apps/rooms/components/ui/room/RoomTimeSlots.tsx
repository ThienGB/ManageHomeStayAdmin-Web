'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback, useState } from 'react';
import { useCreateBooking } from '../../../api/hooks/useCreateBooking';
import { useTimeSlotAvailability } from '../../../api/hooks/useTimeSlotAvailability';

type TimeSlot = {
	id?: string;
	startTime?: string;
	endTime?: string;
	price?: number;
	isOvernight?: boolean;
};

type RoomTimeSlotsProps = {
	timeSlots: TimeSlot[];
	roomId?: string;
};

function RoomTimeSlots(props: RoomTimeSlotsProps) {
	const { timeSlots, roomId } = props;
	const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

	// Fetch available time slots for selected date
	const { data: availableTimeSlots = [], isLoading: isLoadingAvailability } = useTimeSlotAvailability(
		roomId || '',
		selectedDate
	);

	// Booking mutation
	const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

	// Dialog state
	const [bookingDialog, setBookingDialog] = useState<{ open: boolean; slot: TimeSlot | null }>({ open: false, slot: null });

	// Helper function to check if a timeslot is available
	const isTimeSlotAvailable = useCallback((timeslot: TimeSlot): boolean => {
		if (!selectedDate || availableTimeSlots.length === 0) {
			return true; // Default to available if no date selected or no data
		}

		// Check if this timeslot exists in the available slots
		return availableTimeSlots.some(
			(availableSlot) =>
				availableSlot.startTime === timeslot.startTime &&
				availableSlot.endTime === timeslot.endTime
		);
	}, [selectedDate, availableTimeSlots]);

	// Handle booking
	const handleBookSlot = (slot: TimeSlot) => {
		setBookingDialog({ open: true, slot });
	};

	const handleConfirmBooking = () => {
		if (!bookingDialog.slot || !roomId || !selectedDate) return;

		// Format date as YYYY-MM-DD in local timezone
		const year = selectedDate.getFullYear();
		const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
		const day = String(selectedDate.getDate()).padStart(2, '0');
		const dateString = `${year}-${month}-${day}`;

		createBooking(
			{
				roomId,
				timeSlotId: bookingDialog.slot.id!,
				date: dateString
			},
			{
				onSuccess: () => {
					setBookingDialog({ open: false, slot: null });
				}
			}
		);
	};

	if (!timeSlots || timeSlots.length === 0) {
		return null;
	}

	return (
		<Paper
			className="mb-4 p-6"
			elevation={1}
		>
			<Typography
				variant="h5"
				className="mb-4 font-bold"
			>
				Khung giờ
			</Typography>

			{/* Date Picker for checking availability */}
			{roomId && (
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

			<Grid
				container
				spacing={3}
			>
				{timeSlots.map((slot, idx) => {
					const isAvailable = roomId ? isTimeSlotAvailable(slot) : true;

					return (
						<Grid
							key={slot.id || idx}
							size={{ sm: 12, md: 6 }}
						>
							<Paper
								className="p-4 h-full"
								elevation={0}
								sx={{
									bgcolor: isAvailable ? 'background.paper' : 'grey.50',
									opacity: isAvailable ? 1 : 0.7,
									borderWidth: 2,
									borderStyle: 'solid',
									borderColor: isAvailable ? 'success.light' : 'error.main',
									transition: 'all 0.2s ease-in-out',
									position: 'relative',
									overflow: 'hidden',
									'&::before': !isAvailable ? {
										content: '""',
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										height: '4px',
										bgcolor: 'error.main',
									} : {}
								}}
							>
								{/* Header with Title */}
								<Box className="mb-3">
									<Typography
										variant="h6"
										className="font-semibold mb-2"
									>
										Khung giờ {idx + 1}
									</Typography>
									
									{/* Status Chips Row */}
									<Box className="flex gap-1 items-center">
										{slot.isOvernight && (
											<Chip
												label="Qua đêm"
												size="small"
												color="primary"
												icon={<FuseSvgIcon size={14}>lucide:moon</FuseSvgIcon>}
												sx={{ fontWeight: 500 }}
											/>
										)}
										{roomId && !isAvailable && (
											<Chip
												size="small"
												label="Đã đặt"
												color="error"
												icon={<FuseSvgIcon size={14}>lucide:calendar-x</FuseSvgIcon>}
												variant="filled"
												sx={{ fontWeight: 500 }}
											/>
										)}
										{roomId && isAvailable && (
											<Chip
												size="small"
												label="Có sẵn"
												color="success"
												icon={<FuseSvgIcon size={14}>lucide:calendar-check</FuseSvgIcon>}
												variant="outlined"
												sx={{ fontWeight: 500 }}
											/>
										)}
									</Box>
								</Box>
								{/* Time Slot Information */}
								<Box className="space-y-2">
									<Box className="flex items-center gap-2">
										<FuseSvgIcon
											size={18}
											className="text-gray-500"
										>
											lucide:clock
										</FuseSvgIcon>
										<Typography variant="body2" className="font-medium">
											{slot.startTime} - {slot.endTime}
										</Typography>
									</Box>
									<Box className="flex items-center gap-2">
										<FuseSvgIcon
											size={18}
											className="text-gray-500"
										>
											lucide:dollar-sign
										</FuseSvgIcon>
										<Typography
											variant="body1"
											className="font-semibold"
											color="primary"
										>
											{slot.price?.toLocaleString() || 0} VND
										</Typography>
									</Box>

									{/* Book Button for available slots */}
									{roomId && isAvailable && selectedDate && (
										<Box className="pt-2">
											<Button
												variant="contained"
												color="primary"
												size="medium"
												fullWidth
												onClick={() => handleBookSlot(slot)}
												startIcon={<FuseSvgIcon size={16}>lucide:calendar-plus</FuseSvgIcon>}
												sx={{
													py: 1,
													fontWeight: 600,
													textTransform: 'none'
												}}
											>
												Đặt khung giờ
											</Button>
										</Box>
									)}

									{/* Message for unavailable slots */}
									{roomId && !isAvailable && (
										<Box className="pt-2">
											<Paper
												sx={{
													p: 1.5,
													bgcolor: 'error.50',
													border: '1px solid',
													borderColor: 'error.200'
												}}
												elevation={0}
											>
												<Typography
													variant="caption"
													color="error.dark"
													className="flex items-center gap-1"
												>
													<FuseSvgIcon size={14}>lucide:info</FuseSvgIcon>
													Khung giờ này đã được đặt
												</Typography>
											</Paper>
										</Box>
									)}
								</Box>
							</Paper>
						</Grid>
					);
				})}
			</Grid>

			{/* Booking Confirmation Dialog */}
			<Dialog
				open={bookingDialog.open}
				onClose={() => !isBooking && setBookingDialog({ open: false, slot: null })}
			>
				<DialogTitle>Xác nhận đặt phòng</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Bạn có chắc muốn đặt khung giờ này không?
						<br />
						<strong>Thời gian:</strong> {bookingDialog.slot?.startTime} - {bookingDialog.slot?.endTime}
						<br />
						<strong>Ngày:</strong> {selectedDate?.toLocaleDateString('vi-VN')}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button 
						onClick={() => setBookingDialog({ open: false, slot: null })}
						disabled={isBooking}
					>
						Hủy
					</Button>
					<Button
						onClick={handleConfirmBooking}
						color="primary"
						variant="contained"
						disabled={isBooking}
						startIcon={
							isBooking ? (
								<FuseSvgIcon size={16}>lucide:loader-2</FuseSvgIcon>
							) : (
								<FuseSvgIcon size={16}>lucide:check</FuseSvgIcon>
							)
						}
					>
						{isBooking ? 'Đang đặt...' : 'Xác nhận'}
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
}

export default RoomTimeSlots;
