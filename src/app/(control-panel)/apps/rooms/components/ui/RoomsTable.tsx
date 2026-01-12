import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Chip, ListItemIcon, MenuItem, Paper, Rating } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import Typography from '@mui/material/Typography';
import { useAttractions } from '../../api/hooks/useAttractions';
import { Attraction } from '../../api/types';
import { useAttractionsAppContext } from '../../context/attractions-context/useAttractionsAppContext';

function AttractionsTable() {
	const { pagination, setPagination, filters } = useAttractionsAppContext();
	
	const { data, isLoading } = useAttractions({
		...pagination,
		...filters
	});
	const attractions = data?.data?.content || [];

	const columns = useMemo<MRT_ColumnDef<Attraction>[]>(
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
								src={row.original.images[0]}
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
						to={`/apps/attractions/${row.original.id}`}
						role="button"
					>
						<u>{row.original.name}</u>
					</Typography>
				)
			},
			{
				accessorKey: 'location',
				header: 'Location',
				Cell: ({ row }) => (
					<span>{row.original.location.city}</span>
				)
			},
			{
				accessorKey: 'contact',
				header: 'Contact',
				Cell: ({ row }) => (
					<span>{row.original.contact.phone}</span>
				)
			},
			{
				accessorKey: 'averageRating',
				header: 'Rating',
				Cell: ({ row }) => (
					<div className="flex items-center gap-1">
						<Rating
							value={row.original.averageRating}
							precision={0.1}
							readOnly
							size="small"
						/>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							({row.original.totalRatings})
						</Typography>
					</div>
				)
			},
			{
				accessorKey: 'price',
				header: 'Price',
				Cell: ({ row }) => (
					<span>
						{row.original.price.toLocaleString('vi-VN')} VND
					</span>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip
						label={row.original.status}
						size="small"
						color={row.original.status === 'PENDING' ? 'warning' : 'success'}
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
				data={attractions}
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

export default AttractionsTable;
