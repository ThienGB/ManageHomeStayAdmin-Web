'use client';

import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useEffect, useState, useMemo } from 'react';
import useParams from '@fuse/hooks/useParams';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AmenityHeader from '../../ui/AmenityHeader';
import { useAmenity } from '../../../api/hooks/useAmenity';
import AmenityModel from '../../../api/models/AmenityModel';
import { TextField, Autocomplete, FormControl, FormLabel } from '@mui/material';
import { Controller } from 'react-hook-form';
import IconSearchField from '../../ui/IconSearchField';

const schema = z.object({
	name: z.string().nonempty('You must enter an amenity name').min(2, 'The amenity name must be at least 2 characters'),
	categoryId: z.string().nonempty('You must select a category'),
	description: z.string().optional(),
	icon: z.string().optional()
});

function AmenityView() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { amenityId } = routeParams as { amenityId: string };

	const { data: amenity, isLoading, isError } = useAmenity(amenityId);
	
	const [categorySearch, setCategorySearch] = useState('');
	const [inputValue, setInputValue] = useState('');
	
	const debouncedSearch = useMemo(() => {
		return _.debounce((value: string) => {
			setCategorySearch(value);
		}, 300);
	}, []);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch, control, formState } = methods;
	const { errors } = formState;

	const form = watch();

	useEffect(() => {
		if (amenityId === 'new') {
			reset(AmenityModel({}));
			setInputValue('');
		}
	}, [amenityId, reset]);

	useEffect(() => {
		if (amenity) {
			reset({ ...amenity});
		}
	}, [amenity, reset]);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError && amenityId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex h-full flex-1 flex-col items-center justify-center"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such amenity!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/amenities"
					color="inherit"
				>
					Go to Amenities Page
				</Button>
			</motion.div>
		);
	}

	if (_.isEmpty(form) || (amenity && routeParams.amenityId !== amenity.id && routeParams.amenityId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<AmenityHeader />}
				content={
					<div className="flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
						<div className="flex flex-col gap-4">
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="name">Name</FormLabel>
										<TextField
											id="name"
											{...field}
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
								name="icon"
								control={control}
								render={({ field: { onChange, value } }) => (
									<IconSearchField
										label="Icon"
										value={value}
										onChange={onChange}
										placeholder="Search icons (e.g., home, wifi, user)"
										iconSet="heroicons"
										error={!!errors.icon}
										helperText={errors?.icon?.message as string}
									/>
								)}
							/>

							<Controller
								name="description"
								control={control}
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="description">Description</FormLabel>
										<TextField
											{...field}
											id="description"
											type="text"
											multiline
											rows={4}
											fullWidth
											error={!!errors.description}
											helperText={errors?.description?.message as string}
										/>
									</FormControl>
								)}
							/>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default AmenityView;
