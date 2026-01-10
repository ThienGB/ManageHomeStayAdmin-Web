import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, FormLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { AmenityCategory } from '../../api/types';
import { useCreateAmenityCategory } from '../../api/hooks/useCreateAmenityCategory';
import { useUpdateAmenityCategory } from '../../api/hooks/useUpdateAmenityCategory';
import { useCategoriesAppContext } from '../../context/categories-context/useCategoriesAppContext';

const schema = z.object({
	name: z.string().nonempty('You must enter a category name').min(2, 'The category name must be at least 2 characters'),
	description: z.string().optional()
});

type CategoryDialogProps = {
	open: boolean;
	onClose: () => void;
	category?: AmenityCategory | null;
};

function CategoryDialog({ open, onClose, category }: CategoryDialogProps) {
	const {pagination} = useCategoriesAppContext()
	const { mutate: createCategory } = useCreateAmenityCategory(pagination);
	const { mutate: updateCategory } = useUpdateAmenityCategory(pagination);

	const { control, handleSubmit, reset, formState } = useForm({
		mode: 'onChange',
		defaultValues: {
			name: '',
			description: ''
		},
		resolver: zodResolver(schema)
	});

	const { errors } = formState;

	useEffect(() => {
		if (category) {
			reset({
				name: category.name,
				description: category.description || ''
			});
		} else {
			reset({
				name: '',
				description: ''
			});
		}
	}, [category, reset]);

	const onSubmit = (data: { name: string; description: string }) => {
		if (category) {
			updateCategory({
				...category,
				name: data.name,
				description: data.description
			});
		} else {
			createCategory({
				name: data.name,
				description: data.description
			});
		}
		onClose();
		reset();
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<div className="flex flex-col gap-4 mt-2">
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="category-name">Name</FormLabel>
									<TextField
										{...field}
										id="category-name"
										required
										autoFocus
										fullWidth
										error={!!errors.name}
										helperText={errors?.name?.message as string}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="category-description">Description</FormLabel>
									<TextField
										{...field}
										id="category-description"
										multiline
										rows={3}
										fullWidth
									/>
								</FormControl>
							)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={onClose}
						color="inherit"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
					>
						{category ? 'Update' : 'Create'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default CategoryDialog;
