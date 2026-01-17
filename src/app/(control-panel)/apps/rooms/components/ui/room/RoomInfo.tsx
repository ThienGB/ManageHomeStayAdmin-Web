'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Paper, Typography } from '@mui/material';

type RoomInfoProps = {
	name?: string;
	description?: string;
	capacity?: number;
	bed?: number;
	area?: number;
	hourlyRate?: number;
	overnightRate?: number;
};

function RoomInfo(props: RoomInfoProps) {
	const { name, description, capacity, bed, area, hourlyRate, overnightRate } = props;

	return (
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
				{description}
			</Typography>
			<div className="mt-4 space-y-2">
				<div className="flex items-center gap-2">
					<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
						<FuseSvgIcon
							size={16}
							className="text-primary"
						>
							lucide:user
						</FuseSvgIcon>
					</div>
					<Typography variant="body2">{capacity} guests</Typography>
				</div>
				<div className="flex items-center gap-2">
					<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
						<FuseSvgIcon
							size={16}
							className="text-primary"
						>
							lucide:bed
						</FuseSvgIcon>
					</div>
					<Typography variant="body2">{bed} beds</Typography>
				</div>
				<div className="flex items-center gap-2">
					<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
						<FuseSvgIcon
							size={16}
							className="text-primary"
						>
							lucide:maximize
						</FuseSvgIcon>
					</div>
					<Typography variant="body2">{area} m²</Typography>
				</div>
			</div>
			<div className="mt-4 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Hourly Rate:
					</Typography>
					<Typography
						variant="body1"
						fontWeight="bold"
					>
						{hourlyRate?.toLocaleString('vi-VN', {
							style: 'currency',
							currency: 'VND'
						})}
					</Typography>
				</div>
				<div className="flex items-center justify-between">
					<Typography
						variant="body2"
						color="text.secondary"
					>
						Overnight Rate:
					</Typography>
					<Typography
						variant="body1"
						fontWeight="bold"
					>
						{overnightRate?.toLocaleString('vi-VN', {
							style: 'currency',
							currency: 'VND'
						})}
					</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default RoomInfo;
