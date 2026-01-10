import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import api, { mainApi } from '@/utils/api';

type AuthResponse = {
	user: User;
	tokens: {
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	}
};

/**
 * Refreshes the access token
 */
export async function authRefreshToken(): Promise<Response> {
	return api.post('accounts/refresh-token', {
		retry: 0 // Don't retry refresh token requests
	});
}

/**
 * Sign in with token
 */
export async function authSignInWithToken(accessToken: string): Promise<AuthResponse> {
	const res = await mainApi.get('auth/login/access-token', {
		headers: { Authorization: `Bearer ${accessToken}` }
	}).json<{ success: boolean; message: string; data: any }>();
	
	const user = res.data.user;
	const transformedUser: User = {
		...user,
		role: ['admin'],
		displayName: user.name || user.displayName,
		shortcuts: user.shortcuts || [],
		settings: user.settings || {},
		loginRedirectUrl: user.loginRedirectUrl || '/'
	};
	
	return  {
		user: transformedUser,
		tokens: res.data.tokens
	};
}

/**
 * Sign in
 */
export async function authSignIn(
  credentials: { username: string; password: string }
): Promise<AuthResponse> {
  const res = await mainApi
    .post('accounts/login', { json: credentials })
    .json<{ success: boolean; message: string; data: AuthResponse }>();

  const user = res.data.user as any;
  const transformedUser: User = {
    ...user,
    role: ['admin'],
    displayName: user.name || user.displayName,
    shortcuts: user.shortcuts || [],
    settings: user.settings || {},
    loginRedirectUrl: user.loginRedirectUrl || '/'
  };

  return {
    user: transformedUser,
    tokens: res.data.tokens
  }; 
}


/**
 * Sign up
 */
export async function authSignUp(data: {
	displayName: string;
	email: string;
	password: string;
}): Promise<AuthResponse> {
	return api
		.post('mock/auth/sign-up', {
			json: data
		})
		.json();
}

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<User> {
	return api.get(`mock/auth/user/${userId}`).json();
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<User> {
	return api.get(`mock/auth/user-by-email/${email}`).json();
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>): Promise<Response> {
	return api.put(`mock/auth/user/${user.id}`, {
		json: UserModel(user)
	});
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>): Promise<User> {
	return api
		.post('mock/users', {
			json: UserModel(user)
		})
		.json();
}
