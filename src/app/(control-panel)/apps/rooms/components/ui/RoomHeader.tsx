import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Attraction } from '../../api/types';
import { useCreateAttraction } from '../../api/hooks/useCreateAttraction';
import { useUpdateAttraction } from '../../api/hooks/useUpdateAttraction';
import { useDeleteAttraction } from '../../api/hooks/useDeleteAttraction';

function AttractionHeader() {
	const routeParams = useParams<{ attractionId: string }>();
	const { attractionId } = routeParams;

	const { mutate: createAttraction } = useCreateAttraction();
	const { mutate: saveAttraction } = useUpdateAttraction();
	const { mutate: removeAttraction } = useDeleteAttraction();

	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { name, images } = watch() as Attraction;

	function handleSaveAttraction() {
		saveAttraction( {attractionId, data: getValues() as Attraction});
	}

	function handleCreateAttraction() {
		createAttraction(getValues() as Attraction);
	}

	function handleRemoveAttraction() {
		removeAttraction(attractionId);
		navigate('/apps/attractions');
	}

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						{images && images.length > 0 ? (
							<img
								className="w-8 rounded-sm sm:w-12"
								src={images[0]}
								alt={name}
							/>
						) : (
							<img
								className="w-8 rounded-sm sm:w-12"
								src="/assets/images/placeholder.jpg"
								alt={name}
							/>
						)}
					</motion.div>
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{name || 'New Attraction'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Attraction Detail
						</Typography>
					</motion.div>
				</div>
				<motion.div
					className="flex w-full flex-1 justify-end"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					{attractionId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveAttraction}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveAttraction}
							>
								Save
							</Button>
						</>
					) : (
						<Button
							className="mx-1 whitespace-nowrap"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							onClick={handleCreateAttraction}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default AttractionHeader;
