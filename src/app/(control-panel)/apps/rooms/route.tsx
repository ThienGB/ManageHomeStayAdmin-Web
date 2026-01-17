import authRoles from '@auth/authRoles';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';
import { Outlet } from 'react-router';

const RoomsAppView = lazy(() => import('./components/views/RoomsAppView'));
const RoomView = lazy(() => import('./components/views/RoomView'));

/**
 * The Rooms App Route (renamed from Attractions)
 */
const route: FuseRouteItemType = {
	path: 'apps/rooms',
	element: <Outlet />,
	auth: authRoles.admin,
	children: [
		{
			path: '',
			element: <RoomsAppView />
		},

		{
			path: 'edit/:roomId',
			element: <RoomView mode="edit" />
		},
		{
			path: 'add',
			element: <RoomView mode="create" />
		},
		{
			path: ':roomId',
			element: <RoomView mode="view" />
		}
	]
};

export default route;
