import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import JwtLoginTab from '../tabs/sign-in/JwtSignInTab';
import SignInPageTitle from '../ui/SignInPageTitle';

/**
 * The sign in page.
 */
function SignInPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-auto md:items-center md:justify-end md:rounded-none md:p-16 md:shadow-none ltr:border-r-1 rtl:border-l-1">
				<div className="mx-auto flex w-full max-w-80 flex-col gap-8 sm:mx-0 sm:w-80">
					<SignInPageTitle />
					
					<JwtLoginTab />
				</div>
			</Paper>

			{/* Right side - Image */}
			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-16 md:flex lg:px-28"
				sx={{
					backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				{/* Optional overlay for better contrast */}
				<Box
					className="absolute inset-0"
					sx={{
						backgroundColor: 'rgba(0, 0, 0, 0.3)',
					}}
				/>
			</Box>
		</div>
	);
}

export default SignInPageView;
