import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import DataTable from 'src/components/data-table/DataTable';
import { useAmenities } from '../../api/hooks/useAmenities';
import { useDeleteAmenities } from '../../api/hooks/useDeleteAmenities';
import { useDeleteAmenity } from '../../api/hooks/useDeleteAmenity';
import { Amenity } from '../../api/types';
import { useAmenitiesAppContext } from '../../context/amenities-context/useAmenitiesAppContext';

function AmenitiesTable() {
	const { pagination, setPagination, searchQuery } = useAmenitiesAppContext();
	const { data, isLoading } = useAmenities(pagination, searchQuery);
	const amenities = data?.data?.content || [];
	const { mutate: deleteAmenities } = useDeleteAmenities();
	const { mutate: deleteAmenity } = useDeleteAmenity(pagination);

	const columns = useMemo<MRT_ColumnDef<Amenity>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/amenities/${row.original.id}`}
						role="button"
					>
						<u>{row.original.name}</u>
					</Typography>
				)
			},
			{
				accessorKey: 'categoryId',
				header: 'Category',
				Cell: ({ row }) => {
					const category = row.original.categoryId;
					const categoryName = typeof category === 'string' ? category : category.name;

					return <Typography>{categoryName}</Typography>;
				}
			},
			{
				accessorKey: 'icon',
				header: 'Icon',
				Cell: ({ row }) => (
					<div className="flex items-center gap-2">
						{row.original.icon && <FuseSvgIcon size={20}>{row.original.icon}</FuseSvgIcon>}
					</div>
				)
			},
			{
				accessorKey: 'description',
				header: 'Description',
				Cell: ({ row }) => (
					<Typography
						variant="body2"
						className="max-w-xs truncate"
					>
						{row.original.description}
					</Typography>
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
		<Paper
			className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
			elevation={2}
		>
			<DataTable
				data={amenities}
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
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteAmenity(row.original.id);
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
				// renderTopToolbarCustomActions={({ table }) => {
				// 	const { rowSelection } = table.getState();

				// 	if (Object.keys(rowSelection).length === 0) {
				// 		return null;
				// 	}

				// 	return (
				// 		<Button
				// 			variant="contained"
				// 			size="small"
				// 			onClick={() => {
				// 				const selectedRows = table.getSelectedRowModel().rows;
				// 				deleteAmenities(selectedRows.map((row) => row.original.id));
				// 				table.resetRowSelection();
				// 			}}
				// 			className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
				// 			color="secondary"
				// 		>
				// 			<FuseSvgIcon>lucide:trash</FuseSvgIcon>
				// 			<span className="mx-2 hidden sm:flex">Delete selected items</span>
				// 		</Button>
				// 	);
				// }}
			/>
		</Paper>
	);
}

export default AmenitiesTable;
