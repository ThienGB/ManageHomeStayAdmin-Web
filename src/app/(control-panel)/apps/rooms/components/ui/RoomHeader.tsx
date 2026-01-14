import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useNavigate from '@fuse/hooks/useNavigate';
import useParams from '@fuse/hooks/useParams';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { motion } from 'motion/react';
import { useFormContext } from 'react-hook-form';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useCreateRoom } from '../../api/hooks/useCreateRoom';
import { useDeleteRoom } from '../../api/hooks/useDeleteRoom';
import { useUpdateRoom } from '../../api/hooks/useUpdateRoom';
import { Room } from '../../api/types';

function RoomHeader() {
	const routeParams = useParams<{ roomId: string }>();
	const { roomId } = routeParams as any;

	const { mutate: createRoom } = useCreateRoom();
	const { mutate: updateRoom } = useUpdateRoom();
	const { mutate: deleteRoom } = useDeleteRoom();

	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const navigate = useNavigate();

	const { name, images } = watch() as Room;
	const imageUrl = images && images.length > 0 
		? (typeof images[0] === 'string' ? images[0] : (images[0] as any)?.url)
		: undefined;

	function handleSaveRoom() {
		updateRoom( {roomId, data: getValues() as Room});
	}

	function handleCreateRoom() {
		createRoom(getValues() as Room);
	}

	function handleRemoveRoom() {
		deleteRoom(roomId);
		navigate('/apps/rooms');
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
								src={images[0]?.url}
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
							{name || 'New Room'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
								Room Detail
						</Typography>
					</motion.div>
				</div>
				<motion.div
					className="flex w-full flex-1 justify-end"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				>
					{roomId !== 'new' ? (
						<>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								onClick={handleRemoveRoom}
								startIcon={<FuseSvgIcon>lucide:trash</FuseSvgIcon>}
							>
								Remove
							</Button>
							<Button
								className="mx-1 whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSaveRoom}
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
							onClick={handleCreateRoom}
						>
							Add
						</Button>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export default RoomHeader;
