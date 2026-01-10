import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useScheduleTypes } from '../../api/hook/useScheduleTypes';
import { useDeleteScheduleType } from '../../api/hook/useDeleteScheduleType';
import { ScheduleType } from '../../api/types/ScheduleTypes';
import { format } from 'date-fns';
import { useScheduleTypesContext } from '../../context/schedule-types-context/useScheduleTypesContext';
import ScheduleTypeDialog from './ScheduleTypeDialog';

function ScheduleTypesTable() {
	const { pagination, setPagination, searchQuery, setSearchQuery } = useScheduleTypesContext();
	const { data, isLoading } = useScheduleTypes(pagination, searchQuery);
	const { mutate: deleteScheduleType } = useDeleteScheduleType(pagination);
	const [editScheduleType, setEditScheduleType] = useState<ScheduleType | null>(null);
	const [openDialog, setOpenDialog] = useState(false);

	const scheduleTypes = data?.data?.content || [];

	const handleEdit = (scheduleType: ScheduleType) => {
		setEditScheduleType(scheduleType);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setEditScheduleType(null);
	};

	const columns = useMemo<MRT_ColumnDef<ScheduleType>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						variant="body1"
						fontWeight="medium"
					>
						{row.original.name}
					</Typography>
				)
			},
			{
				accessorKey: 'description',
				header: 'Description',
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="max-w-md truncate"
					>
						{row.original.description || '-'}
					</Typography>
				)
			},
			{
				accessorFn: (row) => row.image,
				id: 'image',
				header: 'Image',
				enableColumnFilter: false,
				enableColumnDragging: false,
				enableSorting: false,
				size: 64,
				muiTableHeadCellProps: {
					sx: {
						verticalAlign: 'middle',
						textAlign: 'center'
					}
				},
				muiTableBodyCellProps: {
					align: 'center' as const,
					sx: {
						verticalAlign: 'middle'
					}
				},
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original.image && (
							<img
								className="block max-h-9 w-full max-w-9 rounded-sm"
								src={row.original.image as string}
								alt={row.original.name}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'createdAt',
				header: 'Created At',
				Cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM dd, yyyy')
			},
			{
				accessorKey: 'updatedAt',
				header: 'Updated At',
				Cell: ({ row }) => format(new Date(row.original.updatedAt), 'MMM dd, yyyy')
			}
		],
		[]
	);

	return (
		<>
			<Paper
				className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
				elevation={2}
			>
				<DataTable
					data={scheduleTypes}
					columns={columns}
					manualPagination
					rowCount={data?.data?.totalElements ?? 0}
					onPaginationChange={(updaterOrValue) => {
						const currentState = {
							pageIndex: Math.max(0, (pagination?.page ?? 1) - 1),
							pageSize: pagination?.limit ?? 10
						};

						const nextState =
							typeof updaterOrValue === 'function' ? updaterOrValue(currentState) : updaterOrValue;

						setPagination({
							page: (nextState.pageIndex ?? 0) + 1,
							limit: nextState.pageSize ?? currentState.pageSize
						});
					}}
					state={{
						isLoading,
						pagination: {
							pageIndex: Math.max(0, (pagination?.page ?? 1) - 1),
							pageSize: pagination?.limit ?? 10
						},
						globalFilter: searchQuery ?? ''
					}}
					onGlobalFilterChange={(updaterOrValue) => {
						const nextValue =
							typeof updaterOrValue === 'function' ? updaterOrValue(searchQuery ?? '') : updaterOrValue;

						const normalizedValue = nextValue ?? '';
						setSearchQuery(normalizedValue);
						setPagination({ ...pagination, page: 1 });
					}}
					renderRowActionMenuItems={({ closeMenu, row, table }) => [
						<MenuItem
							key={0}
							onClick={() => {
								handleEdit(row.original);
								closeMenu();
							}}
						>
							<ListItemIcon>
								<FuseSvgIcon>lucide:square-pen</FuseSvgIcon>
							</ListItemIcon>
							Edit
						</MenuItem>,
						<MenuItem
							key={1}
							onClick={() => {
								deleteScheduleType(row.original.id);
								closeMenu();
								table.resetRowSelection();
							}}
						>
							<ListItemIcon>
								<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							</ListItemIcon>
							Delete
						</MenuItem>
					]}
				/>
			</Paper>

			<ScheduleTypeDialog
				open={openDialog}
				onClose={handleCloseDialog}
				scheduleType={editScheduleType}
			/>
		</>
	);
}

export default ScheduleTypesTable;
