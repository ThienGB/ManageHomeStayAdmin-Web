import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';

const ScheduleTypesWrapper = lazy(() => import('./components/view/ScheduleTypesAppView'));

/**
 * The Schedules App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/schedules',
	element: <Outlet />,
	auth: authRoles.admin,
	children: [
		{
			path: '',
			element: <Navigate to="types" />
		},
		{
			path: 'types',
			element: <ScheduleTypesWrapper />
		}
	]
};

export default route;
