'use client';

import { Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Control, Controller } from 'react-hook-form';

type Amenity = {
	id?: string;
	name: string;
	icon?: string;
};

type RoomAmenitiesFormProps = {
	control: Control<any>;
	amenities: Amenity[];
};

function RoomAmenitiesForm(props: RoomAmenitiesFormProps) {
	const { control, amenities } = props;

	if (!amenities || amenities.length === 0) {
		return null;
	}

	return (
		<Grid
			container
			spacing={3}
		>
			<Grid size={{ sm: 12, md: 12 }}>
				<Controller
					name="amenityIds"
					control={control}
					render={({ field }) => (
						<Grid
							container
							spacing={2}
						>
							{amenities.map((amenity) => {
								const current = field.value || [];
								// field.value may be an array of ids or array of objects
								const currentIds = (Array.isArray(current) ? current : []).map(
									(v: any) =>
										typeof v === 'string' ? v : v?.id || v?._id || v
								);
								const checked = currentIds.includes(amenity.id);

								return (
									<Grid
										key={amenity.id || amenity.name}
										size={{ sm: 12, md: 6 }}
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
	);
}

export default RoomAmenitiesForm;
