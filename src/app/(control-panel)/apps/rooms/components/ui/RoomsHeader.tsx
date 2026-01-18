import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import {
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useState } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

type RoomsHeaderProps = {
	totalResults?: number;
	isLoading?: boolean;
	onSearchChange?: (search: string) => void;
};

function RoomsHeader({ totalResults, isLoading, onSearchChange }: RoomsHeaderProps) {
	const [searchInput, setSearchInput] = useState('');

	const handleSearchChange = (value: string) => {
		setSearchInput(value);
		if (onSearchChange) {
			onSearchChange(value);
		}
	};
	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" skipHome={true} />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<div className="flex flex-col gap-1">
						<motion.span
							initial={{ x: -20 }}
							animate={{ x: 0, transition: { delay: 0.2 } }}
						>
							<Typography className="text-4xl leading-none font-extrabold tracking-tight">
								Phòng
							</Typography>
						</motion.span>
						{totalResults !== undefined && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
							>
								<Typography
									variant="body2"
									className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
								>
									<FuseSvgIcon size={16}>lucide:list-filter</FuseSvgIcon>
									{isLoading ? (
										'Đang tải...'
									) : (
										<>
											<span className="text-primary font-semibold">
												{totalResults.toLocaleString()}
											</span>
											<span>kết quả tìm thấy</span>
										</>
									)}
								</Typography>
							</motion.div>
						)}
					</div>

					<div className="flex flex-1 items-center justify-end gap-2">
						{/* Search Box */}
						<motion.div
							className="flex-1 max-w-md"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
						>
							<TextField
								placeholder="Tìm kiếm phòng..."
								value={searchInput}
								onChange={(e) => handleSearchChange(e.target.value)}
								size="medium"
								fullWidth
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
												onClick={() => handleSearchChange('')}
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
						</motion.div>

						{/* Add Button */}
						<motion.div
							className="flex grow-0"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
						>
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="/apps/rooms/add"
								startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
							>
								Thêm
							</Button>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RoomsHeader;
