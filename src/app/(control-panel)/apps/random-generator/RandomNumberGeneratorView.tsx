import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Typography
} from '@mui/material';
import { motion } from 'motion/react';
import { useState } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useRoomPassword } from '../rooms/api/hooks/useRoomPassword';
import { useRooms } from '../rooms/api/hooks/useRooms';
import { useSetRoomPassword } from '../rooms/api/hooks/useSetRoomPassword';
import { Room } from '../rooms/api/types';

function RandomNumberGeneratorView() {
	const [randomNumber, setRandomNumber] = useState<string>('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedRoomForPassword, setSelectedRoomForPassword] = useState<Room | null>(null);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	// Fetch all rooms
	const { data: roomsData, isLoading: isLoadingRooms } = useRooms({
		page: 1,
		limit: 100 // Get all rooms
	});

	// Mutation for setting password
	const setPasswordMutation = useSetRoomPassword();

	const handleGenerateMainDoor = () => {
		setIsGenerating(true);

		// Animation effect
		setTimeout(() => {
			const min = 10000; // 5 digits minimum
			const max = 99999; // 5 digits maximum
			const random = Math.floor(Math.random() * (max - min + 1)) + min;
			setRandomNumber(random.toString() + '!');
			setIsGenerating(false);
		}, 300);
	};

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handleCreatePassword = (room: Room) => {
		setSelectedRoomForPassword(room);
		setConfirmDialogOpen(true);
	};

	const handleConfirmCreatePassword = async () => {
		if (!selectedRoomForPassword) return;

		// Generate random 4-digit password
		const min = 1000;
		const max = 9999;
		const newPassword = Math.floor(Math.random() * (max - min + 1)) + min;

		try {
			await setPasswordMutation.mutateAsync({
				roomId: selectedRoomForPassword.id,
				password: newPassword.toString()
			});
		} catch (error) {
			console.error('Error creating password:', error);
		} finally {
			setConfirmDialogOpen(false);
			setSelectedRoomForPassword(null);
		}
	};

	const handleCancelDialog = () => {
		setConfirmDialogOpen(false);
		setSelectedRoomForPassword(null);
	};

	return (
		<div className="flex flex-col flex-auto min-h-full">
			{/* Header */}
			<div className="flex flex-auto flex-col py-3 px-4 sm:px-6">
				<PageBreadcrumb className="mb-2" skipHome={true} />
				<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center mb-4">
					<div className="flex flex-auto items-center gap-2">
						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<Typography className="text-2xl sm:text-3xl leading-none font-bold tracking-tight">
								Trình tạo mật khẩu
							</Typography>
							<Typography
								variant="caption"
								className="mt-1 text-gray-600 dark:text-gray-400"
							>
								Tạo mật khẩu cho cửa chính và phòng
							</Typography>
						</motion.div>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Rooms Password Section - Takes 2 columns */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
						className="lg:col-span-2"
					>
						<Card
							className="shadow-lg h-full"
							sx={{
								backdropFilter: 'blur(10px)',
								border: '1px solid',
								borderColor: 'divider'
							}}
						>
							<CardContent className="p-5 sm:p-6">
								<Typography
									variant="h6"
									className="mb-4 font-semibold flex items-center gap-2"
								>
									<FuseSvgIcon size={20} color="secondary">
										lucide:lock-keyhole
									</FuseSvgIcon>
									Mật khẩu phòng
								</Typography>

								{isLoadingRooms ? (
									<Box className="flex justify-center items-center h-40">
										<CircularProgress />
									</Box>
								) : (
									<div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
										{roomsData?.data?.content
											?.sort((a, b) => a.name.localeCompare(b.name))
											?.map((room) => (
												<RoomPasswordItem
													key={room.id}
													room={room}
													onCreatePassword={handleCreatePassword}
													onCopyPassword={handleCopy}
												/>
											))}
										{(!roomsData?.data?.content || roomsData.data.content.length === 0) && (
											<Typography className="text-center text-gray-500 py-8">
												Không có phòng nào
											</Typography>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>

					{/* Main Door Section - Takes 1 column */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
						className="lg:col-span-1"
					>
						<Card
							className="shadow-lg h-full"
							sx={{
								backdropFilter: 'blur(10px)',
								border: '1px solid',
								borderColor: 'divider'
							}}
						>
							<CardContent className="p-5 sm:p-6">
								<Typography
									variant="h6"
									className="mb-4 font-semibold flex items-center gap-2"
								>
									<FuseSvgIcon size={20} color="secondary">
										lucide:door-open
									</FuseSvgIcon>
									Mật khẩu cửa chính
								</Typography>

								<Button
									variant="contained"
									size="large"
									fullWidth
									onClick={handleGenerateMainDoor}
									disabled={isGenerating}
									color="secondary"
									sx={{
										height: '64px',
										borderRadius: '12px',
										justifyContent: 'flex-start',
										paddingX: 3,
										gap: 2,
										'&:hover': {
											transform: 'translateY(-2px)',
											boxShadow: 3
										},
										transition: 'all 0.3s ease',
										'& svg': {
											animation: isGenerating ? 'spin 1s linear infinite' : 'none'
										},
										'@keyframes spin': {
											'0%': { transform: 'rotate(0deg)' },
											'100%': { transform: 'rotate(360deg)' }
										}
									}}
								>
									<FuseSvgIcon className="text-white" size={28}>
										{isGenerating ? 'lucide:loader-2' : 'lucide:door-open'}
									</FuseSvgIcon>
									<div className="text-left flex-1">
										<Typography className="text-white font-bold text-base">
											Tạo mật khẩu cửa chính
										</Typography>
										<Typography variant="caption" className="text-white/80 block">
											5 chữ số + !
										</Typography>
									</div>
								</Button>

								{/* Result Display */}
								{randomNumber && (
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ type: 'spring', stiffness: 200, damping: 15 }}
										className="mt-4"
									>
										<Box
											className="p-5 rounded-xl text-center relative overflow-hidden"
											sx={{
												bgcolor: 'secondary.main'
											}}
										>
											{/* Decorative background pattern */}
											<div
												className="absolute inset-0 opacity-10"
												style={{
													backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
													backgroundSize: '20px 20px'
												}}
											/>

											<Typography
												className="text-white font-bold tracking-wider relative z-10 break-all"
												sx={{
													fontSize: '2.25rem',
													textShadow: '0 2px 10px rgba(0,0,0,0.2)',
													letterSpacing: '0.08em'
												}}
											>
												{randomNumber}
											</Typography>
										</Box>

										<div className="flex justify-center mt-3">
											<Button
												variant="outlined"
												size="small"
												onClick={() => handleCopy(randomNumber)}
												startIcon={<FuseSvgIcon size={16}>lucide:copy</FuseSvgIcon>}
												sx={{
													borderColor: 'secondary.main',
													color: 'secondary.main',
													'&:hover': {
														borderColor: 'secondary.dark',
														backgroundColor: 'action.hover'
													}
												}}
											>
												Sao chép
											</Button>
										</div>
									</motion.div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>

			{/* Confirmation Dialog */}
			<Dialog
				open={confirmDialogOpen}
				onClose={handleCancelDialog}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle className="flex items-center gap-2">
					<FuseSvgIcon color="warning">lucide:alert-triangle</FuseSvgIcon>
					Xác nhận tạo mật khẩu
				</DialogTitle>
				<DialogContent>
					<Typography>
						Bạn có chắc chắn muốn tạo mật khẩu mới cho phòng{' '}
						<strong>{selectedRoomForPassword?.name}</strong>?
					</Typography>
					<Typography className="mt-2 text-orange-600 dark:text-orange-400">
						Lưu ý: Nếu phòng đã có mật khẩu, mật khẩu cũ sẽ bị thay thế.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDialog} color="inherit">
						Hủy
					</Button>
					<Button
						onClick={handleConfirmCreatePassword}
						variant="contained"
						color="secondary"
						disabled={setPasswordMutation.isPending}
						startIcon={
							setPasswordMutation.isPending ? (
								<CircularProgress size={16} />
							) : (
								<FuseSvgIcon size={16}>lucide:check</FuseSvgIcon>
							)
						}
					>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

// Room Password Item Component
function RoomPasswordItem({
	room,
	onCreatePassword,
	onCopyPassword
}: {
	room: Room;
	onCreatePassword: (room: Room) => void;
	onCopyPassword: (password: string) => void;
}) {
	const { data: password, isLoading } = useRoomPassword(room.id);

	return (
		<Paper
			className="p-4"
			sx={{
				border: '1px solid',
				borderColor: 'divider',
				'&:hover': {
					borderColor: 'secondary.main',
					boxShadow: 1
				},
				transition: 'all 0.3s ease'
			}}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex-1 min-w-0">
					<Typography className="font-semibold truncate">{room.name}</Typography>
					{isLoading ? (
						<CircularProgress size={16} className="mt-1" />
					) : password ? (
						<div className="flex items-center gap-2 mt-1">
							<Chip
								label={password}
								size="small"
								sx={{
									backgroundColor: 'secondary.main',
									color: 'secondary.contrastText',
									fontWeight: 'bold',
									letterSpacing: '0.05em'
								}}
							/>
							<Button
								size="small"
								onClick={() => onCopyPassword(password)}
								sx={{
									minWidth: 'auto',
									p: 0.5
								}}
							>
								<FuseSvgIcon size={16}>lucide:copy</FuseSvgIcon>
							</Button>
						</div>
					) : (
						<Typography variant="caption" className="text-gray-500 mt-1">
							Chưa có mật khẩu
						</Typography>
					)}
				</div>
				<Button
					variant="contained"
					size="small"
					onClick={() => onCreatePassword(room)}
					startIcon={<FuseSvgIcon size={16}>lucide:key</FuseSvgIcon>}
					color="secondary"
					sx={{
						borderRadius: '8px',
						textTransform: 'none',
						'&:hover': {
							transform: 'translateY(-1px)',
							boxShadow: 2
						},
						transition: 'all 0.3s ease'
					}}
				>
					{password ? 'Đổi MK' : 'Tạo MK'}
				</Button>
			</div>
		</Paper>
	);
}

export default RandomNumberGeneratorView;
