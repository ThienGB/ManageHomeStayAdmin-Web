import Typography from '@mui/material/Typography';

function SignInPageTitle() {
	return (
		<div className="w-full">
			<Typography 
				className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight"
				sx={{ fontFamily: "'Be Vietnam Pro', Roboto, Arial, sans-serif" }}
			>
				Đăng nhập
			</Typography>
		</div>
	);
}

export default SignInPageTitle;
