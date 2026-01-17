import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { useState } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

function RandomNumberGeneratorView() {
	const [randomNumber, setRandomNumber] = useState<string>('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [doorType, setDoorType] = useState<'main' | 'cabinet' | null>(null);

	const handleGenerateMainDoor = () => {
		setIsGenerating(true);
		setDoorType('main');
		
		// Animation effect
		setTimeout(() => {
			const min = 10000; // 5 digits minimum
			const max = 99999; // 5 digits maximum
			const random = Math.floor(Math.random() * (max - min + 1)) + min;
			setRandomNumber(random.toString() + '!');
			setIsGenerating(false);
		}, 300);
	};

	const handleGenerateCabinet = () => {
		setIsGenerating(true);
		setDoorType('cabinet');
		
		// Animation effect
		setTimeout(() => {
			const min = 1000; // 4 digits minimum
			const max = 9999; // 4 digits maximum
			const random = Math.floor(Math.random() * (max - min + 1)) + min;
			setRandomNumber(random.toString());
			setIsGenerating(false);
		}, 300);
	};

	const handleCopy = () => {
		if (randomNumber) {
			navigator.clipboard.writeText(randomNumber);
		}
	};

	return (
		<div className="flex flex-col flex-auto min-h-full py-4">
			{/* Header */}
			<div className="flex flex-auto flex-col py-4 px-4 sm:px-6">
				<PageBreadcrumb className="mb-2" skipHome={true} />
				<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center mb-4">
					<div className="flex flex-auto items-center gap-2">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1, transition: { delay: 0.2 } }}
							className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
						>
							<FuseSvgIcon className="text-white" size={20}>
								lucide:shuffle
							</FuseSvgIcon>
						</motion.div>
						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<Typography className="text-2xl sm:text-3xl leading-none font-bold tracking-tight">
								Random Number Generator
							</Typography>
							<Typography
								variant="caption"
								className="mt-1 text-gray-600 dark:text-gray-400"
							>
								Generate random numbers with custom type
							</Typography>
						</motion.div>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
						className="w-full max-w-xl"
					>
						<Card
							className="shadow-lg"
							sx={{
								background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
								backdropFilter: 'blur(10px)',
								border: '1px solid rgba(99, 102, 241, 0.1)',
							}}
						>
							<CardContent className="p-5 sm:p-6">
								{/* Button Section */}
								<div className="mb-5">
									<Typography
										variant="subtitle1"
										className="mb-3 font-semibold flex items-center gap-2"
									>
										<FuseSvgIcon size={18} color="primary">
											lucide:sparkles
										</FuseSvgIcon>
										Select Door Type
									</Typography>
									
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{/* Main Door Button */}
										<Button
											variant="contained"
											size="large"
											fullWidth
											onClick={handleGenerateMainDoor}
											disabled={isGenerating}
											sx={{
												height: '64px',
												borderRadius: '12px',
												justifyContent: 'flex-start',
												paddingX: 3,
												gap: 2,
												background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												'&:hover': {
													background: 'linear-gradient(135deg, #5568d3 0%, #63408f 100%)',
													transform: 'translateY(-2px)',
													boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
												},
												transition: 'all 0.3s ease',
												'& svg': {
													animation: isGenerating && doorType === 'main' ? 'spin 1s linear infinite' : 'none',
												},
												'@keyframes spin': {
													'0%': { transform: 'rotate(0deg)' },
													'100%': { transform: 'rotate(360deg)' },
												},
											}}
										>
											<FuseSvgIcon className="text-white" size={28}>
												{isGenerating && doorType === 'main' ? 'lucide:loader-2' : 'lucide:door-open'}
											</FuseSvgIcon>
											<div className="text-left flex-1">
												<Typography className="text-white font-bold text-base">
													Main Door
												</Typography>
												<Typography variant="caption" className="text-white/80 block">
													5 digits + !
												</Typography>
											</div>
										</Button>

										{/* Cabinet Button */}
										<Button
											variant="contained"
											size="large"
											fullWidth
											onClick={handleGenerateCabinet}
											disabled={isGenerating}
											sx={{
												height: '64px',
												borderRadius: '12px',
												justifyContent: 'flex-start',
												paddingX: 3,
												gap: 2,
												background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
												'&:hover': {
													background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
													transform: 'translateY(-2px)',
													boxShadow: '0 8px 16px rgba(240, 147, 251, 0.3)',
												},
												transition: 'all 0.3s ease',
												'& svg': {
													animation: isGenerating && doorType === 'cabinet' ? 'spin 1s linear infinite' : 'none',
												},
											}}
										>
											<FuseSvgIcon className="text-white" size={28}>
												{isGenerating && doorType === 'cabinet' ? 'lucide:loader-2' : 'lucide:lock-keyhole'}
											</FuseSvgIcon>
											<div className="text-left flex-1">
												<Typography className="text-white font-bold text-base">
													Cabinet
												</Typography>
												<Typography variant="caption" className="text-white/80 block">
													4 digits
												</Typography>
											</div>
										</Button>
									</div>
								</div>

								{/* Result Display */}
								{randomNumber && (
									<motion.div
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ type: 'spring', stiffness: 200, damping: 15 }}
									>
										<div className="relative">
											<Typography
												variant="subtitle1"
												className="mb-2 font-semibold flex items-center gap-2"
											>
												<FuseSvgIcon size={18} color="primary">
													{doorType === 'main' ? 'lucide:door-open' : 'lucide:lock-keyhole'}
												</FuseSvgIcon>
												{doorType === 'main' ? 'Main Door Code' : 'Cabinet Code'}
											</Typography>
											<div
												className="p-5 rounded-xl text-center relative overflow-hidden"
												style={{
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												}}
											>
												{/* Decorative background pattern */}
												<div
													className="absolute inset-0 opacity-10"
													style={{
														backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
														backgroundSize: '20px 20px',
													}}
												/>
												
												<Typography
													className="text-white font-bold tracking-wider relative z-10 break-all"
													sx={{
														fontSize: randomNumber.length > 10 ? '1.5rem' : '2.25rem',
														textShadow: '0 2px 10px rgba(0,0,0,0.2)',
														letterSpacing: '0.08em',
													}}
												>
													{randomNumber}
												</Typography>
											</div>

											{/* Copy Button */}
											<div className="flex justify-center mt-3">
												<Button
													variant="outlined"
													size="small"
													onClick={handleCopy}
													startIcon={<FuseSvgIcon size={16}>lucide:copy</FuseSvgIcon>}
													sx={{
														borderRadius: '8px',
														textTransform: 'none',
														borderColor: 'rgba(99, 102, 241, 0.3)',
														color: 'primary.main',
														'&:hover': {
															borderColor: 'primary.main',
															backgroundColor: 'rgba(99, 102, 241, 0.05)',
														},
													}}
												>
													Copy to Clipboard
												</Button>
											</div>
										</div>
									</motion.div>
								)}

								{/* Info Box */}
								{!randomNumber && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.5 }}
										className="mt-5 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
									>
										<div className="flex gap-2">
											<FuseSvgIcon className="text-blue-600 dark:text-blue-400" size={18}>
												lucide:info
											</FuseSvgIcon>
											<div>
												<Typography variant="caption" className="text-blue-900 dark:text-blue-100 font-medium block">
													How to use:
												</Typography>
												<Typography variant="caption" className="text- blue-800 dark:text-blue-200 mt-1 block">
													1. Click "Main Door" for 5-digit code with !
													<br />
													2. Click "Cabinet" for 4-digit code
													<br />
													3. Copy the generated code if needed
												</Typography>
											</div>
										</div>
									</motion.div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export default RandomNumberGeneratorView;
