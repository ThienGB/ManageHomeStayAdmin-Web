import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useNavigate from '@fuse/hooks/useNavigate';
import { Amenity } from '../../api/types';
import { useCreateAmenity } from '../../api/hooks/useCreateAmenity';
import { useUpdateAmenity } from '../../api/hooks/useUpdateAmenity';
import { useDeleteAmenity } from '../../api/hooks/useDeleteAmenity';

function AmenityHeader() {
	const routeParams = useParams<{ amenityId: string }>();
	const { amenityId } = routeParams;

	const { mutate: createAmenity } = useCreateAmenity();
	const { mutate: saveAmenity } = useUpdateAmenity();
	const { mutate: removeAmenity } = useDeleteAmenity();

	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { name, icon } = watch() as Amenity;

	function handleSaveAmenity() {
		saveAmenity(getValues() as Amenity);
	}

	function handleCreateAmenity() {
		createAmenity(getValues() as Amenity);
	}

	function handleRemoveAmenity() {
		removeAmenity(amenityId);
		navigate('/apps/amenities');
	}

	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					{icon && (
						<motion.div
							className="flex border-1 rounded-md p-2"
							initial={{ scale: 0 }}
							animate={{ scale: 1, transition: { delay: 0.3 } }}
							
						>
							<FuseSvgIcon size={30}>{icon}</FuseSvgIcon>
						</motion.div>
					)}
					<motion.div
						className="flex min-w-0 flex-col"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="truncate text-lg font-semibold sm:text-2xl">
							{name || 'New Amenity'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Amenity Detail
						</Typography>
					</motion.div>
				</div>
				<motion.div
					className="flex w-full flex-1 justify-end"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					{amenityId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveAmenity}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveAmenity}
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
							onClick={handleCreateAmenity}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default AmenityHeader;
