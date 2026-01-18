'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

type Amenity = {
	id?: string;
	name: string;
	icon?: string;
};

type RoomAmenitiesProps = {
	amenities: Amenity[];
};

function RoomAmenities(props: RoomAmenitiesProps) {
	const { amenities } = props;

	if (!amenities || amenities.length === 0) {
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
				Tiện nghi
			</Typography>
			<Grid
				container
				spacing={3}
			>
				{amenities.map((amenity, idx) => (
					<Grid
						key={amenity.id || idx}
						size={{ sm: 12, md: 6 }}
					>
						<div className="flex items-center gap-2">
							<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
								<FuseSvgIcon
									size={16}
									className="text-primary"
								>
									{amenity.icon || 'lucide:check'}
								</FuseSvgIcon>
							</div>
							<Typography variant="body2">{amenity.name}</Typography>
						</div>
					</Grid>
				))}
			</Grid>
		</Paper>
	);
}

export default RoomAmenities;
