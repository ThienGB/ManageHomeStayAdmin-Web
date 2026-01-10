import { useState } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ScheduleTypeDialog from './ScheduleTypeDialog';

export default function ScheduleTypesHeader() {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<>
			<div className="flex flex-auto flex-col py-4">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
					<div className="flex flex-auto items-center gap-2">
						<motion.span
							initial={{ x: -20 }}
							animate={{ x: 0, transition: { delay: 0.2 } }}
						>
							<Typography className="text-4xl leading-none font-extrabold tracking-tight">
								Schedule Types
							</Typography>
						</motion.span>

						<div className="flex flex-1 items-center justify-end gap-2">
							<motion.div
								className="flex grow-0"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
							>
								<Button
									variant="contained"
									color="secondary"
									startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
									onClick={() => setDialogOpen(true)}
								>
									Add Schedule Type
								</Button>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
			<ScheduleTypeDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
			/>
		</>
	);
}
