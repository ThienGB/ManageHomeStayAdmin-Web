import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';

const AmenitiesAppView = lazy(() => import('./components/views/AmenitiesAppView'));
const AmenityView = lazy(() => import('./components/views/amenity/AmenityView'));

/**
 * The Amenities App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/amenities',
	element: <Outlet />,
	auth: authRoles.admin,
	children: [
		{
			path: '',
			element: <Navigate to="list" />
		},
		{
			path: 'list',
			element: <AmenitiesAppView />
		},
		{
			path: ':amenityId',
			element: <AmenityView />
		}
	]
};

export default route;
