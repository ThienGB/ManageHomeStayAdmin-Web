import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { type MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import DataTable from 'src/components/data-table/DataTable';
import { useAmenities } from '../../api/hooks/useAmenities';
import { useDeleteAmenity } from '../../api/hooks/useDeleteAmenity';
import { Amenity } from '../../api/types';

type AmenitiesTableProps = {
	searchTerm?: string;
};

function AmenitiesTable({ searchTerm = '' }: AmenitiesTableProps) {
	const { data, isLoading } = useAmenities();
	const allAmenities = data || [];
	const { mutate: deleteAmenity } = useDeleteAmenity();

	// Filter amenities locally based on search term
	const amenities = useMemo(() => {
		if (!searchTerm) return allAmenities;
		
		const lowerSearch = searchTerm.toLowerCase();
		return allAmenities.filter((amenity) =>
			amenity.name?.toLowerCase().includes(lowerSearch) ||
			amenity.description?.toLowerCase().includes(lowerSearch)
		);
	}, [allAmenities, searchTerm]);

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
						<u>{row.original?.name}</u>
					</Typography>
				)
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
				rowCount={amenities.length}
				enableRowSelection={false}
				enableColumnActions={false}
				enableTopToolbar={false}
				displayColumnDefOptions={{
					'mrt-row-actions': {
						size: 60,
					},
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
