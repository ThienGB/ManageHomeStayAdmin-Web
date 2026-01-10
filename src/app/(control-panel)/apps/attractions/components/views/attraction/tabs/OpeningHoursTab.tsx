import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Typography } from '@mui/material';

function OpeningHoursTab() {
	const methods = useFormContext();
	const { control } = methods;

	const days = [
		{ key: 'monday', label: 'Monday' },
		{ key: 'tuesday', label: 'Tuesday' },
		{ key: 'wednesday', label: 'Wednesday' },
		{ key: 'thursday', label: 'Thursday' },
		{ key: 'friday', label: 'Friday' },
		{ key: 'saturday', label: 'Saturday' },
		{ key: 'sunday', label: 'Sunday' }
	];

	return (
		<div className="flex flex-col gap-4">
			<Typography
				variant="body2"
				color="text.secondary"
			>
				Enter opening hours in format: "9:00 AM - 5:00 PM" or "Closed"
			</Typography>

			{days.map((day) => (
				<Controller
					key={day.key}
					name={`openingHours.${day.key}`}
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor={day.key}>{day.label}</FormLabel>
							<TextField
								{...field}
								id={day.key}
								placeholder="e.g., 9:00 AM - 5:00 PM"
								fullWidth
							/>
						</FormControl>
					)}
				/>
			))}
		</div>
	);
}

export default OpeningHoursTab;
