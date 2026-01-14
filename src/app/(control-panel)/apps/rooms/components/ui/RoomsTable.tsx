import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import { Chip, ListItemIcon, MenuItem, Paper, Rating } from '@mui/material';
import Typography from '@mui/material/Typography';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import DataTable from 'src/components/data-table/DataTable';
import { useRooms } from '../../api/hooks/useRooms';
import { Room } from '../../api/types';
import { useRoomsAppContext } from '../../context/rooms-context/useRoomsAppContext';

function RoomsTable() {
	const { pagination, setPagination, filters } = useRoomsAppContext();
	
	const { data, isLoading } = useRooms({
		...pagination,
		...filters
	});
	const rooms = data?.data?.content || [];

	const columns = useMemo<MRT_ColumnDef<Room>[]>(
		() => [
			{
				accessorFn: (row) => row.images?.[0],
				id: 'image',
				header: '',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				Cell: ({ row }) => (
					<div className="flex items-center justify-center">
						{row.original?.images?.length > 0 ? (
							<img
								className="block max-h-9 w-full max-w-9 rounded-sm"
								src={row.original.images[0].url}
								alt={row.original.name}
							/>
						) : (
							<img
								className="block max-h-9 w-full max-w-9 rounded-sm"
								src="/assets/images/placeholder.jpg"
								alt={row.original.name}
							/>
						)}
					</div>
				)
			},
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/rooms/${row.original.id}`}
						role="button"
					>
						<u>{row.original.name}</u>
					</Typography>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip
						label={row.original.isActive ? 'ACTIVE' : 'INACTIVE'}
						size="small"
						color={row.original.isActive ? 'success' : 'warning'}
					/>
				)
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
			elevation={2}
		>
			<DataTable
				data={rooms}
				columns={columns}
				manualPagination
				rowCount={data?.data?.totalElements ?? 0}
				onPaginationChange={(updaterOrValue) => {
					const currentState = {
						pageIndex: Math.max(0, (pagination?.page ?? 1) - 1),
						pageSize: pagination?.limit ?? 10
					};

					const nextState =
						typeof updaterOrValue === 'function'
							? updaterOrValue(currentState)
							: updaterOrValue;

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
					}
				}}
				renderRowActionMenuItems={({ closeMenu, row }) => [
					<MenuItem
						key={0}
						onClick={() => {
							closeMenu();
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
	);
}

export default RoomsTable;
