import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import { Chip, ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import DataTable from 'src/components/data-table/DataTable';
import { useRooms } from '../../api/hooks/useRooms';
import { Room } from '../../api/types';
import { useRoomsAppContext } from '../../context/rooms-context/useRoomsAppContext';

type RoomsTableProps = {
	searchTerm?: string;
};

function RoomsTable({ searchTerm = '' }: RoomsTableProps) {
	const { pagination, setPagination, filters } = useRoomsAppContext();

	const { data, isLoading } = useRooms({
		...pagination,
		...filters
	});
	const allRooms = data?.data?.content || [];

	// Filter rooms locally based on search term
	const rooms = useMemo(() => {
		if (!searchTerm) return allRooms;
		
		const lowerSearch = searchTerm.toLowerCase();
		return allRooms.filter((room) =>
			room.name?.toLowerCase().includes(lowerSearch) ||
			room.description?.toLowerCase().includes(lowerSearch)
		);
	}, [allRooms, searchTerm]);

	const columns = useMemo<MRT_ColumnDef<Room>[]>(
		() => [
			{
				accessorFn: (row) => row.images?.[0],
				id: 'image',
				header: 'Image',
				enableColumnFilter: false,
				enableColumnDragging: false,
				size: 64,
				enableSorting: false,
				muiTableHeadCellProps: {
					align: 'left',
					sx: {
						verticalAlign: 'middle'
					}
				},
				Cell: ({ row }) => (
					<div className="flex items-center justify-start">
						{row.original?.images?.length > 0 ? (
							<img
								className="block max-h-20 w-full max-w-20 rounded-sm"
								src={row.original.images[0].url}
								alt={row.original.name}
							/>
						) : (
							<img
								className="block max-h-16 w-full max-w-16 rounded-sm"
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
					}
				}}
				enableRowSelection={false}
				enableColumnActions={false}
				enableTopToolbar={false}
				displayColumnDefOptions={{
					'mrt-row-actions': {
						size: 60,
					},
				}}
				renderRowActionMenuItems={({ closeMenu, row }) => [
					<MenuItem
						key={0}
						onClick={() => {
							closeMenu();
							// TODO: Implement delete functionality
							console.log('Delete room:', row.original.id);
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
