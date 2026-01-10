import api, { mainApi } from '@/utils/api';
import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';

type AuthResponse = {
	user: User;
	tokens: {
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
	};
};

/**
 * Mock user data for when API doesn't return user
 */
export const MOCK_USER: User = {
	id: '18035',
	role: ['admin'],
	displayName: 'Admin User',
	name: 'Admin User',
	email: 'admin@homestay.com',
	gender: 'male',
	photoURL: '/assets/images/avatars/brian-hughes.jpg',
	shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts'],
	settings: {
		layout: {},
		theme: {}
	},
	loginRedirectUrl: '/'
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
//TODO: implement authSignInWithToken
export async function authSignInWithToken(accessToken: string): Promise<AuthResponse> {
	// const res = await mainApi
	// 	.post('accounts/refresh-token', {
	// 		json: { refreshToken: accessToken }
	// 	})
	// 	.json<{ success: boolean; message: string; data: any }>();

	// Use mock user if API doesn't return user data
	// const user = res.data.user || MOCK_USER;
	const user = MOCK_USER;
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
		// tokens: res.data.tokens
		tokens: {
			accessToken,
			refreshToken: accessToken,
			expiresIn: 3600
		}
	};
}

/**
 * Sign in
 */
export async function authSignIn(credentials: { username: string; password: string }): Promise<AuthResponse> {
	const res = await mainApi
		.post('accounts/login', { json: credentials })
		.json<{ success: boolean; message: string; data: AuthResponse }>();

	// Use mock user if API doesn't return user data
	const user = res.data.user || MOCK_USER;
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
