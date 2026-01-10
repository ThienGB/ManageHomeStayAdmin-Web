import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { 
	TextField, 
	MenuItem, 
	Select, 
	FormControl, 
	InputLabel, 
	InputAdornment, 
	Autocomplete,
	Checkbox,
	Chip,
	Paper,
	Divider,
	Collapse,
	IconButton,
	Tooltip,
	Badge,
	Rating,
	Slider,
	Box
} from '@mui/material';
import { useAttractionsAppContext } from '../../context/attractions-context/useAttractionsAppContext';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAmenitiesForFilter } from '../../api/hooks/useAmenitiesForFilter';
import { useAmenityCategoriesForFilter } from '../../api/hooks/useAmenityCategoriesForFilter';
import { debounce } from 'lodash';

type AttractionsHeaderProps = {
	totalResults?: number;
	isLoading?: boolean;
};

function AttractionsHeader({ totalResults, isLoading }: AttractionsHeaderProps) {
	const { filters, setFilters, resetFilters, setPagination } = useAttractionsAppContext();
	const [amenityCategoryId, setAmenityCategoryId] = useState(null);
	// Local state for debounced search
	const [searchInput, setSearchInput] = useState(filters.search || '');
	const [cityInput, setCityInput] = useState(filters.city || '');
	const [amenitySearch, setAmenitySearch] = useState('');
	const [categorySearch, setCategorySearch] = useState('');
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [priceRange, setPriceRange] = useState<number[]>([filters.minPrice || 0, filters.maxPrice || 1000000]);

	// Fetch data for autocompletes
	const { data: amenitiesData } = useAmenitiesForFilter(amenitySearch, filters.amenityCategoryId);
	const { data: categoriesData } = useAmenityCategoriesForFilter(categorySearch);

	const amenities = amenitiesData?.data?.content || [];
	const categories = categoriesData?.data?.content || [];

	// Count active filters
	const activeFiltersCount = useMemo(() => {
		let count = 0;
		if (filters.search) count++;
		if (filters.city) count++;
		if (filters.amenityCategoryId) count++;
		if (filters.amenityIds && filters.amenityIds.length > 0) count++;
		if (filters.status) count++;
		if (filters.rating) count++;
		if (filters.minPrice) count++;
		if (filters.maxPrice) count++;
		return count;
	}, [filters]);

	// Debounced filter update function
	const debouncedSetFilters = useCallback(
		debounce((key: string, value: string | number | undefined | string[]) => {
			setFilters({
				...filters,
				[key]: value,
			});
			setPagination({ page: 1, limit: 10 }); // Reset to first page on filter change
		}, 500),
		[filters]
	);

	// Handle search input change
	useEffect(() => {
		debouncedSetFilters('search', searchInput);
	}, [searchInput]);

	// Handle city input change
	useEffect(() => {
		debouncedSetFilters('city', cityInput);
	}, [cityInput]);

	const handleFilterChange = (key: string, value: string | number | undefined | string[]) => {
		setFilters({
			...filters,
			[key]: value,
		});
		setPagination({ page: 1, limit: 10 }); // Reset to first page
	};

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<div className="flex flex-col gap-1">
						<motion.span
							initial={{ x: -20 }}
							animate={{ x: 0, transition: { delay: 0.2 } }}
						>
							<Typography className="text-4xl leading-none font-extrabold tracking-tight">
								Attractions
							</Typography>
						</motion.span>
						{totalResults !== undefined && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
							>
								<Typography variant="body2" className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
									<FuseSvgIcon size={16}>lucide:list-filter</FuseSvgIcon>
									{isLoading ? (
										'Loading...'
									) : (
										<>
											<span className="font-semibold text-primary">{totalResults.toLocaleString()}</span>
											<span>{totalResults === 1 ? 'result' : 'results'} found</span>
										</>
									)}
								</Typography>
							</motion.div>
						)}
					</div>

					<div className="flex flex-1 items-center justify-end gap-2">
						<motion.div
							className="flex grow-0"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
						>
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="/apps/attractions/new"
								startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
							>
								Add
							</Button>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Filters Section */}
			<Paper 
				className="mt-6 overflow-hidden" 
				elevation={0} 
				sx={{ 
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 2
				}}
			>
				{/* Quick Search Bar */}
				<motion.div
					className="p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { delay: 0.2 } }}
				>
					<div className="flex flex-wrap gap-3 items-center">
						{/* Primary Search */}
						<TextField
							placeholder="Search attractions..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							size="medium"
							className="flex-1 min-w-[300px]"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20} color="action">lucide:search</FuseSvgIcon>
									</InputAdornment>
								),
								endAdornment: searchInput && (
									<InputAdornment position="end">
										<IconButton
											size="small"
											onClick={() => setSearchInput('')}
											edge="end"
										>
											<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>
										</IconButton>
									</InputAdornment>
								),
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									backgroundColor: 'background.paper',
									borderRadius: '8px',
								}
							}}
						/>

						{/* Quick Filters */}
						<FormControl size="medium" className="min-w-[140px]">
							<InputLabel>Status</InputLabel>
							<Select
								value={filters.status || ''}
								onChange={(e) => handleFilterChange('status', e.target.value)}
								label="Status"
								sx={{
									borderRadius: '8px',
								}}
							>
								<MenuItem value="">
									<em>All Status</em>
								</MenuItem>
								<MenuItem value="PENDING">
									<Chip label="Pending" size="small" color="warning" />
								</MenuItem>
								<MenuItem value="APPROVED">
									<Chip label="Approved" size="small" color="success" />
								</MenuItem>
								<MenuItem value="REJECTED">
									<Chip label="Rejected" size="small" color="error" />
								</MenuItem>
							</Select>
						</FormControl>

						{/* Advanced Filters Toggle */}
						<Tooltip title={showAdvancedFilters ? "Hide filters" : "Show more filters"}>
							<Badge badgeContent={activeFiltersCount} color="primary">
								<Button
									variant={showAdvancedFilters ? "contained" : "outlined"}
									size="medium"
									onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
									startIcon={<FuseSvgIcon>{showAdvancedFilters ? 'lucide:chevron-up' : 'lucide:sliders-horizontal'}</FuseSvgIcon>}
								>
									Filters
								</Button>
							</Badge>
						</Tooltip>

						{/* Clear All Filters */}
						{activeFiltersCount > 0 && (
							<Tooltip title="Clear all filters">
								<Button
									variant="text"
									size="medium"
									color="error"
									onClick={() => {
										resetFilters();
										setSearchInput('');
										setCityInput('');
										setAmenitySearch('');
										setCategorySearch('');
										setPriceRange([0, 1000000]);
										setPagination({ page: 1, limit: 10 });
									}}
									startIcon={<FuseSvgIcon>lucide:x</FuseSvgIcon>}
								>
									Clear All
								</Button>
							</Tooltip>
						)}
					</div>
				</motion.div>

				<Divider />

				{/* Advanced Filters */}
				<Collapse in={showAdvancedFilters}>
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
						className="p-4 bg-gray-50 dark:bg-gray-900"
					>
						{/* Filter Groups */}
						<div className="space-y-4">
							{/* Location Filters */}
							<div>
								<Typography variant="subtitle2" className="mb-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
									<FuseSvgIcon size={18}>lucide:map-pin</FuseSvgIcon>
									Location
								</Typography>
								<div className="flex flex-wrap gap-3">
									<TextField
										label="City"
										placeholder="Enter city name"
										value={cityInput}
										onChange={(e) => setCityInput(e.target.value)}
										size="small"
										className="w-64"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<FuseSvgIcon size={18} color="action">lucide:map</FuseSvgIcon>
												</InputAdornment>
											),
										}}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: '8px',
											}
										}}
									/>
								</div>
							</div>

							<Divider />

							{/* Amenities Filters */}
							<div>
								<Typography variant="subtitle2" className="mb-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
									<FuseSvgIcon size={18}>lucide:layers</FuseSvgIcon>
									Amenities
								</Typography>
								<div className="flex flex-wrap gap-3">
									<Autocomplete
										size="small"
										className="w-72"
										options={categories}
										getOptionLabel={(option) => option.name}
										isOptionEqualToValue={(option, value) => option.id === value.id}
										value={categories.find(c => c.id === amenityCategoryId) || null}
										onChange={(_, newValue) => {
											setAmenityCategoryId(newValue?.id || '');
											handleFilterChange('amenityIds', []);
										}}
										onInputChange={(_, value) => setCategorySearch(value)}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: '8px',
											}
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Category"
												placeholder="Select category first"
												InputProps={{
													...params.InputProps,
													startAdornment: (
														<>
															<InputAdornment position="start">
																<FuseSvgIcon size={18} color="action">lucide:folder</FuseSvgIcon>
															</InputAdornment>
															{params.InputProps.startAdornment}
														</>
													),
												}}
											/>
										)}
									/>

									<Autocomplete
										multiple
										size="small"
										className="flex-1 min-w-[300px]"
										options={amenities}
										disabled={!amenityCategoryId}
										disableCloseOnSelect
										getOptionLabel={(option) => option.name}
										isOptionEqualToValue={(option, value) => option.id === value.id}
										value={amenities.filter(a => filters.amenityIds?.includes(a.id))}
										onChange={(_, newValue) => {
											handleFilterChange('amenityIds', newValue.map(v => v.id));
										}}
										onInputChange={(_, value) => setAmenitySearch(value)}
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: '8px',
											}
										}}
										renderOption={(props, option, { selected }) => (
											<li {...props}>
												<Checkbox
													icon={<FuseSvgIcon size={20}>lucide:circle</FuseSvgIcon>}
													checkedIcon={<FuseSvgIcon size={20}>lucide:check-circle-2</FuseSvgIcon>}
													style={{ marginRight: 8 }}
													checked={selected}
												/>
												{option.name}
											</li>
										)}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Amenities"
												placeholder={
													!filters.amenityCategoryId 
														? "Select a category first" 
														: filters.amenityIds?.length 
															? `${filters.amenityIds.length} selected` 
															: "Select amenities"
												}
												InputProps={{
													...params.InputProps,
													startAdornment: (
														<>
															<InputAdornment position="start">
																<FuseSvgIcon size={18} color="action">lucide:check-square</FuseSvgIcon>
															</InputAdornment>
															{params.InputProps.startAdornment}
														</>
													),
												}}
											/>
										)}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip
													{...getTagProps({ index })}
													key={option.id}
													label={option.name}
													size="small"
													onDelete={getTagProps({ index }).onDelete}
												/>
											))
										}
									/>
								</div>
							</div>

							<Divider />

							{/* Rating & Price Filters */}
							<div>
								<Typography variant="subtitle2" className="mb-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
									<FuseSvgIcon size={18}>lucide:filter</FuseSvgIcon>
									Rating & Price
								</Typography>
								<div className="flex flex-wrap gap-6">
									{/* Rating Filter */}
									<Box className="flex-1 min-w-[280px] max-w-[400px]">
										<Box className="flex items-center justify-between mb-2">
											<Typography variant="body2" className="font-medium text-gray-700 dark:text-gray-300">
												Minimum Rating
											</Typography>
											{filters.rating && (
												<Chip 
													label={`${filters.rating}★`} 
													size="small" 
													color="primary"
													onDelete={() => handleFilterChange('rating', undefined)}
												/>
											)}
										</Box>
										<Box className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
											<div className="flex items-center gap-3">
												<FuseSvgIcon size={20} color="action">lucide:star</FuseSvgIcon>
												<Rating
													value={filters.rating || 0}
													onChange={(_, newValue) => handleFilterChange('rating', newValue || undefined)}
													precision={0.5}
													size="large"
													sx={{
														'& .MuiRating-iconFilled': {
															color: '#faaf00',
														},
													}}
												/>
												{filters.rating && (
													<Typography variant="body2" className="font-semibold min-w-[30px]">
														{filters.rating}+
													</Typography>
												)}
											</div>
										</Box>
									</Box>

									{/* Price Range Filter */}
									<Box className="flex-1 min-w-[320px] max-w-[500px]">
										<Box className="flex items-center justify-between mb-2">
											<Typography variant="body2" className="font-medium text-gray-700 dark:text-gray-300">
												Price Range (VND)
											</Typography>
											<Typography variant="caption" className="text-gray-600 dark:text-gray-400">
												{priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')}
											</Typography>
										</Box>
										<Box className="px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
											<div className="flex items-center gap-3">
												<FuseSvgIcon size={20} color="action">lucide:dollar-sign</FuseSvgIcon>
												<Slider
													value={priceRange}
													onChange={(_, newValue) => setPriceRange(newValue as number[])}
													onChangeCommitted={(_, newValue) => {
														const [min, max] = newValue as number[];
														handleFilterChange('minPrice', min > 0 ? min : undefined);
														handleFilterChange('maxPrice', max < 1000000 ? max : undefined);
													}}
													valueLabelDisplay="auto"
													valueLabelFormat={(value) => `${value.toLocaleString('vi-VN')} VND`}
													min={0}
													max={1000000}
													step={10000}
													sx={{
														flex: 1,
														'& .MuiSlider-thumb': {
															width: 20,
															height: 20,
														},
														'& .MuiSlider-valueLabel': {
															fontSize: 12,
															fontWeight: 'normal',
															top: -6,
															backgroundColor: 'primary.main',
															borderRadius: '8px',
															padding: '4px 8px',
														},
													}}
												/>
											</div>
										</Box>
									</Box>
								</div>
							</div>
						</div>

						{/* Active Filters Display */}
						{activeFiltersCount > 0 && (
							<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex flex-wrap gap-2 items-center">
									<Typography variant="caption" className="text-gray-600 dark:text-gray-400 mr-2">
										Active Filters:
									</Typography>
									{filters.search && (
										<Chip
											label={`Search: "${filters.search}"`}
											size="small"
											onDelete={() => {
												setSearchInput('');
												handleFilterChange('search', '');
											}}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
									{filters.city && (
										<Chip
											label={`City: ${filters.city}`}
											size="small"
											onDelete={() => {
												setCityInput('');
												handleFilterChange('city', '');
											}}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
									{filters.status && (
										<Chip
											label={`Status: ${filters.status}`}
											size="small"
											color={filters.status === 'PENDING' ? 'warning' : filters.status === 'APPROVED' ? 'success' : 'error'}
											onDelete={() => handleFilterChange('status', '')}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
									{filters.amenityCategoryId && (
										<Chip
											label={`Category: ${categories.find(c => c.id === filters.amenityCategoryId)?.name}`}
											size="small"
											onDelete={() => handleFilterChange('amenityCategoryId', '')}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
									{filters.amenityIds && filters.amenityIds.length > 0 && (
										<Chip
											label={`${filters.amenityIds.length} Amenities`}
											size="small"
											onDelete={() => handleFilterChange('amenityIds', [])}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
									{filters.rating && (
										<Chip
											label={`Rating ≥ ${filters.rating}`}
											size="small"
											onDelete={() => handleFilterChange('rating', undefined)}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
									{(filters.minPrice || filters.maxPrice) && (
										<Chip
											label={`Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}`}
											size="small"
											onDelete={() => {
												handleFilterChange('minPrice', undefined);
												handleFilterChange('maxPrice', undefined);
											}}
											deleteIcon={<FuseSvgIcon size={16}>lucide:x</FuseSvgIcon>}
										/>
									)}
								</div>
							</div>
						)}
					</motion.div>
				</Collapse>
			</Paper>
		</div>
	);
}

export default AttractionsHeader;
