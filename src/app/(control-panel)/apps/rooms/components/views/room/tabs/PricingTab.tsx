import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { MenuItem, Select } from '@mui/material';

function PricingTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="price.amount"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="amount">Price Amount</FormLabel>
						<TextField
							{...field}
							id="amount"
							type="number"
							fullWidth
							inputProps={{ step: '0.01', min: '0' }}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="price.currency"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="currency">Currency</FormLabel>
						<Select
							{...field}
							id="currency"
							fullWidth
						>
							<MenuItem value="USD">USD ($)</MenuItem>
							<MenuItem value="EUR">EUR (€)</MenuItem>
							<MenuItem value="GBP">GBP (£)</MenuItem>
							<MenuItem value="VND">VND (₫)</MenuItem>
							<MenuItem value="JPY">JPY (¥)</MenuItem>
						</Select>
					</FormControl>
				)}
			/>

			<Controller
				name="price.type"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="priceType">Price Type</FormLabel>
						<Select
							{...field}
							id="priceType"
							fullWidth
						>
							<MenuItem value="per person">Per Person</MenuItem>
							<MenuItem value="per group">Per Group</MenuItem>
							<MenuItem value="per ticket">Per Ticket</MenuItem>
							<MenuItem value="per day">Per Day</MenuItem>
							<MenuItem value="free">Free</MenuItem>
						</Select>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default PricingTab;
