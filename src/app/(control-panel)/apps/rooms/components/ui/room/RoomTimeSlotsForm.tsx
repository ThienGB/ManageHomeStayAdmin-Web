'use client';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Button,
	Checkbox,
	FormControlLabel,
	IconButton,
	Paper,
	TextField,
	Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Control, Controller, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormGetValues } from 'react-hook-form';
import TimeSlotModel from '../../../api/models/TimeSlotModel';

type TimeSlot = {
	id?: string;
	startTime?: string;
	endTime?: string;
	price?: number;
	isOvernight?: boolean;
	roomId?: string;
};

type RoomTimeSlotsFormProps = {
	control: Control<any>;
	fields: FieldArrayWithId<any, 'timeslots', 'id'>[];
	append: UseFieldArrayAppend<any, 'timeslots'>;
	remove: UseFieldArrayRemove;
	getValues: UseFormGetValues<any>;
	roomId: string;
	onSaveTimeSlot: (index: number, data: TimeSlot) => void;
	onDeleteTimeSlot: (id: string | undefined, index: number) => void;
};

function RoomTimeSlotsForm(props: RoomTimeSlotsFormProps) {
	const { control, fields, append, remove, getValues, roomId, onSaveTimeSlot, onDeleteTimeSlot } = props;

	const handleAddTimeSlot = () => {
		append(
			TimeSlotModel({
				startTime: '09:00',
				endTime: '17:00',
				price: 0,
				roomId,
				isOvernight: false
			})
		);
	};

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<Typography
					variant="h6"
					className="font-semibold"
				>
					TimeSlots
				</Typography>
				<Button
					size="small"
					startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
					onClick={handleAddTimeSlot}
				>
					Add Time Slot
				</Button>
			</div>

			<div className="space-y-4">
				{fields.map((field, index) => (
					<Paper
						key={field.id}
						className="bg-gray-50 p-4 dark:bg-gray-900"
						elevation={0}
					>
						<div className="flex items-start gap-3">
							<div className="flex-1">
								<Grid
									container
									spacing={2}
								>
									<Grid size={{ sm: 12, md: 2 }}>
										<Controller
											name={`timeslots.${index}.isOvernight`}
											control={control}
											render={({ field }) => (
												<FormControlLabel
													control={
														<Checkbox
															checked={!!field.value}
															onChange={(e) =>
																field.onChange(e.target.checked)
															}
														/>
													}
													label="Overnight"
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12, md: 3 }}>
										<Controller
											name={`timeslots.${index}.startTime`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Start Time"
													type="time"
													fullWidth
													size="small"
													InputLabelProps={{
														shrink: true
													}}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12, md: 3 }}>
										<Controller
											name={`timeslots.${index}.endTime`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="End Time"
													type="time"
													fullWidth
													size="small"
													InputLabelProps={{
														shrink: true
													}}
												/>
											)}
										/>
									</Grid>
									<Grid size={{ sm: 12, md: 3 }}>
										<Controller
											name={`timeslots.${index}.price`}
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													label="Price"
													type="number"
													fullWidth
													size="small"
													InputLabelProps={{
														shrink: true
													}}
													onChange={(e) =>
														field.onChange(
															parseFloat(e.target.value) || 0
														)
													}
												/>
											)}
										/>
									</Grid>
								</Grid>
							</div>
							<div className="flex gap-2">
								<IconButton
									size="small"
									color="primary"
									onClick={() => {
										const timeslotData = getValues(`timeslots.${index}`);
										onSaveTimeSlot(index, timeslotData);
									}}
								>
									<FuseSvgIcon>lucide:save</FuseSvgIcon>
								</IconButton>
								<IconButton
									size="small"
									color="error"
									onClick={() => {
										onDeleteTimeSlot(field.id, index);
										remove(index);
									}}
								>
									<FuseSvgIcon>lucide:trash-2</FuseSvgIcon>
								</IconButton>
							</div>
						</div>
					</Paper>
				))}
			</div>
		</div>
	);
}

export default RoomTimeSlotsForm;
