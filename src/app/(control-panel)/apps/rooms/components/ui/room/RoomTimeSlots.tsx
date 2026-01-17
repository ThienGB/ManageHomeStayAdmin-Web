'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

type TimeSlot = {
	id?: string;
	startTime?: string;
	endTime?: string;
	price?: number;
	isOvernight?: boolean;
};

type RoomTimeSlotsProps = {
	timeSlots: TimeSlot[];
};

function RoomTimeSlots(props: RoomTimeSlotsProps) {
	const { timeSlots } = props;

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
				Time Slots
			</Typography>
			<Grid
				container
				spacing={3}
			>
				{timeSlots.map((slot, idx) => (
					<Grid
						key={slot.id || idx}
						size={{ sm: 12, md: 6 }}
					>
						<Paper
							className="bg-gray-50 p-4 dark:bg-gray-800"
							elevation={0}
						>
							<div className="mb-3 flex items-center justify-between">
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
									<Typography
										variant="body2"
										className="font-semibold"
									>
										{slot.price?.toLocaleString() || 0} VND
									</Typography>
								</div>
							</div>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Paper>
	);
}

export default RoomTimeSlots;
