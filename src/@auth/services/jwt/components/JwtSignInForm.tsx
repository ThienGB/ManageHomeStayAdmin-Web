import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import useJwtAuth from '../useJwtAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	username: z.string().nonempty('You must enter an user name'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.'),
	remember: z.boolean().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	username: '',
	password: '',
	remember: true
};

function JwtSignInForm() {
	const { signIn } = useJwtAuth();
	const navigate = useNavigate();

	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		setValue('username', 'admin', { shouldDirty: true, shouldValidate: true });
		setValue('password', '12345678x@X', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	function onSubmit(formData: FormType) {
		const { username, password } = formData;

		signIn({
			username,
			password,
			role: 'ADMIN',
		})
			.then((result) => {
				const redirectUrl = result?.user?.loginRedirectUrl || '/';
				window.location.href = redirectUrl;
			})
			.catch((error) => {
				const errorData = error?.data as {
					type: 'password' | 'remember' | `root.${string}` | 'root';
					message: string;
				}[];

				errorData?.forEach?.((err) => {
					setError(err.type, {
						type: 'manual',
						message: err.message
					});
				});
			});
	}

	return (
		<form
			name="loginForm"
			noValidate
			className="flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="username"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Tên đăng nhập"
						autoFocus
						error={!!errors.username}
						helperText={errors?.username?.message}
						variant="outlined"
						required
						fullWidth
						sx={{
							'& .MuiInputLabel-root, & .MuiInputBase-input': {
								fontFamily: "'Be Vietnam Pro', Roboto, Arial, sans-serif"
							}
						}}
					/>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-6"
						label="Mật khẩu"
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
						sx={{
							'& .MuiInputLabel-root, & .MuiInputBase-input': {
								fontFamily: "'Be Vietnam Pro', Roboto, Arial, sans-serif"
							}
						}}
					/>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className="mt-4 w-full"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
				sx={{
					fontFamily: "'Be Vietnam Pro', Roboto, Arial, sans-serif"
				}}
			>
				Đăng nhập
			</Button>
		</form>
	);
}

export default JwtSignInForm;
