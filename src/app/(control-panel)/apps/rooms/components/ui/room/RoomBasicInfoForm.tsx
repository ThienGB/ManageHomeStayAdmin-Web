'use client';

import { Checkbox, FormControlLabel, InputAdornment, MenuItem, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { RoomType } from '../../../api/types';

type RoomBasicInfoFormProps = {
	control: Control<any>;
	errors: FieldErrors;
};

function RoomBasicInfoForm(props: RoomBasicInfoFormProps) {
	const { control, errors } = props;

	const formatNumber = (value: number | string | undefined): string => {
		if (!value) return '';

		return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const parseNumber = (value: string): number => {
		const rawValue = value.replace(/\./g, '');
		return isNaN(Number(rawValue)) ? 0 : Number(rawValue);
	};

	return (
		<Grid
			container
			spacing={3}
		>
			<Grid size={{ sm: 12, md: 12 }}>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Tên phòng"
							fullWidth
							required
							error={!!errors.name}
							helperText={errors.name?.message as string}
						/>
					)}
				/>
			</Grid>
			<Grid size={{ sm: 12 }}>
				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Mô tả"
							fullWidth
							multiline
							rows={4}
							required
							error={!!errors.description}
							helperText={errors.description?.message as string}
						/>
					)}
				/>
			</Grid>
			<Grid size={{ xs: 12, md: 4 }}>
				{' '}
				{/* Sửa ở đây: md: 4 */}
				<Controller
					name="capacity"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Sức chứa"
							fullWidth
							required
							value={formatNumber(field.value)}
							onChange={(e) => field.onChange(parseNumber(e.target.value))}
							error={!!errors.capacity}
							helperText={errors.capacity?.message as string}
						/>
					)}
				/>
			</Grid>

			<Grid size={{ xs: 12, md: 4 }}>
				{' '}
				{/* Sửa ở đây: md: 4 */}
				<Controller
					name="numberOfBeds"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Số giường"
							fullWidth
							required
							value={formatNumber(field.value)}
							onChange={(e) => field.onChange(parseNumber(e.target.value))}
							error={!!errors.numberOfBeds}
							helperText={errors.numberOfBeds?.message as string}
						/>
					)}
				/>
			</Grid>

			<Grid size={{ xs: 12, md: 4 }}>
				{' '}
				{/* Sửa ở đây: md: 4 */}
				<Controller
					name="area"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Diện tích"
							fullWidth
							required
							value={formatNumber(field.value)}
							onChange={(e) => field.onChange(parseNumber(e.target.value))}
							InputProps={{
								endAdornment: <InputAdornment position="end">m²</InputAdornment>
							}}
							error={!!errors.area}
							helperText={errors.area?.message as string}
						/>
					)}
				/>
			</Grid>
			<Grid size={{ sm: 12, md: 12 }}>
			<Controller
				name="roomType"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						select
						label="Loại phòng"
						fullWidth
						error={!!errors.roomType}
						helperText={errors.roomType?.message as string}
					>
						<MenuItem value={RoomType.NORMAL}>Thường</MenuItem>
						<MenuItem value={RoomType.STANDARD}>Tiêu chuẩn</MenuItem>
						<MenuItem value={RoomType.VIP}>VIP</MenuItem>
						<MenuItem value={RoomType.PREMIUM}>Cao cấp</MenuItem>
					</TextField>
				)}
			/>
		</Grid>
			<Grid size={{ sm: 12, md: 12 }}>
				<Controller
					name="isActive"
					control={control}
					render={({ field }) => (
						<FormControlLabel
							control={
								<Checkbox
									checked={field.value}
									onChange={(e) => field.onChange(e.target.checked)}
								/>
							}
							label="Hoạt động"
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
}

export default RoomBasicInfoForm;
