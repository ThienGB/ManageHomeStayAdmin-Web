import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function LocationTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="location.city"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="city">City</FormLabel>
						<TextField
							{...field}
							id="city"
							fullWidth
							error={!!errors?.location?.city}
							helperText={errors?.location?.city?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="location.state"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="state">State/Province</FormLabel>
						<TextField
							{...field}
							id="state"
							fullWidth
							error={!!errors?.location?.state}
							helperText={errors?.location?.state?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="location.country"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="country">Country</FormLabel>
						<TextField
							{...field}
							id="country"
							fullWidth
							error={!!errors?.location?.country}
							helperText={errors?.location?.country?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="location.latitude"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="latitude">Latitude</FormLabel>
						<TextField
							{...field}
							id="latitude"
							type="number"
							fullWidth
							inputProps={{ step: 'any' }}
							error={!!errors?.location?.latitude}
							helperText={errors?.location?.latitude?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="location.longitude"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="longitude">Longitude</FormLabel>
						<TextField
							{...field}
							id="longitude"
							type="number"
							fullWidth
							inputProps={{ step: 'any' }}
							error={!!errors?.location?.longitude}
							helperText={errors?.location?.longitude?.message as string}
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default LocationTab;
