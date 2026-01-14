import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { MenuItem, Select, Switch, FormControlLabel, Rating, Chip, CircularProgress } from '@mui/material';
import { useAmenities } from '@/app/(control-panel)/apps/amenities/api/hooks/useAmenities';
import { useState } from 'react';
import useDebounce from '@fuse/hooks/useDebounce';

function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	
	const [debouncedSearch, setDebouncedSearch] = useState('');
	
	const debouncedSetSearch = useDebounce((value: string) => {
		setDebouncedSearch(value);
	}, 500);
	
	const { data, isLoading } = useAmenities();
	const amenities = data || [];
	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="name">Name</FormLabel>
						<TextField
							id="name"
							{...field}
							required
							autoFocus
							fullWidth
							error={!!errors.name}
							helperText={errors?.name?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="description">Description</FormLabel>
						<TextField
							{...field}
							id="description"
							type="text"
							multiline
							rows={4}
							fullWidth
							error={!!errors.description}
							helperText={errors?.description?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="category"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="category">Category</FormLabel>
						<TextField
							{...field}
							id="category"
							fullWidth
							error={!!errors.category}
							helperText={errors?.category?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="tags">Tags</FormLabel>
						<Autocomplete
							multiple
							freeSolo
							options={[]}
							value={value || []}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple tags"
									id="tags"
								/>
							)}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="amenities"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => {
					const selectedAmenities = amenities.filter((amenity) => value?.includes(amenity.id));

					return (
						<FormControl className="w-full">
							<FormLabel htmlFor="amenities">Amenities</FormLabel>
							<Autocomplete
								multiple
								options={amenities}
								value={selectedAmenities}
								loading={isLoading}
								onInputChange={(event, newInputValue, reason) => {
									if (reason === 'input') {
										debouncedSetSearch(newInputValue);
									}
								}}
								onChange={(event, newValue) => {
									onChange(newValue.map((item) => item.id));
								}}
								getOptionLabel={(option) => option.name}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								filterOptions={(x) => x}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											{...getTagProps({ index })}
											key={option.id}
											label={option.name}
											size="small"
										/>
									))
								}
								renderInput={(params) => (
									<TextField
										{...params}
										placeholder="Select amenities"
										id="amenities"
										InputProps={{
											...params.InputProps,
											endAdornment: (
												<>
													{isLoading ? <CircularProgress color="inherit" size={20} /> : null}
													{params.InputProps.endAdornment}
												</>
											),
										}}
									/>
								)}
							/>
						</FormControl>
					);
				}}
			/>

			<Controller
				name="status"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="status">Status</FormLabel>
						<Select
							{...field}
							id="status"
							fullWidth
						>
							<MenuItem value="active">Active</MenuItem>
							<MenuItem value="inactive">Inactive</MenuItem>
							<MenuItem value="draft">Draft</MenuItem>
						</Select>
					</FormControl>
				)}
			/>

			<Controller
				name="featured"
				control={control}
				render={({ field: { onChange, value } }) => (
					<FormControl className="w-full">
						<FormControlLabel
							control={
								<Switch
									checked={value || false}
									onChange={(e) => onChange(e.target.checked)}
								/>
							}
							label="Featured Attraction"
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="rating"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="rating">Rating</FormLabel>
						<Rating
							{...field}
							precision={0.1}
							size="large"
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="reviewCount"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="reviewCount">Review Count</FormLabel>
						<TextField
							{...field}
							id="reviewCount"
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
