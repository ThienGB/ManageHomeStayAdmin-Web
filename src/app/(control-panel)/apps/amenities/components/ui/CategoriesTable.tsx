import { useMemo, useState } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import DataTable from "src/components/data-table/DataTable";
import { ListItemIcon, MenuItem, Paper } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAmenityCategories } from "../../api/hooks/useAmenityCategories";
import { useDeleteAmenityCategories } from "../../api/hooks/useDeleteAmenityCategories";
import { useDeleteAmenityCategory } from "../../api/hooks/useDeleteAmenityCategory";
import { AmenityCategory } from "../../api/types";
import { format } from "date-fns";
import CategoryDialog from "./CategoryDialog";
import { useCategoriesAppContext } from "../../context/categories-context/useCategoriesAppContext";

function CategoriesTable() {
  // Table pagination (0-based index for UI)
  const { pagination, setPagination } = useCategoriesAppContext();
  // Fetch categories with server-side pagination (1-based page for API)
  const { data, isLoading } = useAmenityCategories(pagination);

  const categories = data?.data?.content || [];
  const { mutate: deleteCategories } = useDeleteAmenityCategories();
  const { mutate: deleteCategory } = useDeleteAmenityCategory(pagination);
  const [editCategory, setEditCategory] = useState<AmenityCategory | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  const columns = useMemo<MRT_ColumnDef<AmenityCategory>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        Cell: ({ row }) => (
          <Typography variant="body1" fontWeight="medium">
            {row.original.name}
          </Typography>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ row }) => (
          <Typography variant="body2" className="truncate max-w-md">
            {row.original.description}
          </Typography>
        ),
      },
      	{
			accessorKey: "createdAt",
			header: "Created At",
			Cell: ({ row }) =>
			format(new Date(row.original.createdAt), "MMM dd, yyyy"),
      	},
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ row }) =>
          format(new Date(row.original.updatedAt), "MMM dd, yyyy"),
      },
    ],
    []
  );

  const handleEdit = (category: AmenityCategory) => {
    setEditCategory(category);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditCategory(null);
  };

  return (
    <>
      <Paper
        className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
        elevation={2}
      >
        <DataTable
          data={categories}
          columns={columns}
          manualPagination
          rowCount={data?.data?.totalElements ?? 0}
          onPaginationChange={(updaterOrValue) => {
            // Build a PaginationState-like current value from your app pagination
            const currentState = {
              pageIndex: Math.max(0, (pagination?.page ?? 1) - 1),
              pageSize: pagination?.limit ?? 10,
            };

            // Support both functional updater and direct value (OnChangeFn signature)
            const nextState =
              typeof updaterOrValue === "function"
                ? updaterOrValue(currentState)
                : updaterOrValue;

            // Map back to your app's Pagination shape
            setPagination({
              page: (nextState.pageIndex ?? 0) + 1,
              limit: nextState.pageSize ?? currentState.pageSize,
            });
          }}
          state={{
            isLoading,
            pagination: {
              pageIndex: Math.max(0, (pagination?.page ?? 1) - 1),
              pageSize: pagination?.limit ?? 10,
            },
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
                <FuseSvgIcon>lucide:edit</FuseSvgIcon>
              </ListItemIcon>
              Edit
            </MenuItem>,
            <MenuItem
              key={1}
              onClick={() => {
                deleteCategory(row.original.id);
                closeMenu();
                table.resetRowSelection();
              }}
            >
              <ListItemIcon>
                <FuseSvgIcon>lucide:trash</FuseSvgIcon>
              </ListItemIcon>
              Delete
            </MenuItem>,
          ]}
          renderTopToolbarCustomActions={({ table }) => {
            const { rowSelection } = table.getState();

            if (Object.keys(rowSelection).length === 0) {
              return null;
            }

            return (
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  const selectedRows = table.getSelectedRowModel().rows;
                  deleteCategories(selectedRows.map((row) => row.original.id));
                  table.resetRowSelection();
                }}
                className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
                color="secondary"
              >
                <FuseSvgIcon>lucide:trash</FuseSvgIcon>
                <span className="mx-2 hidden sm:flex">
                  Delete selected items
                </span>
              </Button>
            );
          }}
        />
      </Paper>

      <CategoryDialog
        open={openDialog}
        onClose={handleCloseDialog}
        category={editCategory}
      />
    </>
  );
}

export default CategoriesTable;
