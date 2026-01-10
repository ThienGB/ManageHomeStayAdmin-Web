import { lazy } from 'react';
import { Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';

const AttractionsAppView = lazy(() => import('./components/views/AttractionsAppView'));
const AttractionView = lazy(() => import('./components/views/attraction/AttractionView'));

/**
 * The Attractions App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/attractions',
	element: <Outlet />,
	auth: authRoles.admin,
	children: [
		{
			path: '',
			element: <AttractionsAppView />
		},
		{
			path: ':attractionId',
			element: <AttractionView />
		}
	]
};

export default route;
