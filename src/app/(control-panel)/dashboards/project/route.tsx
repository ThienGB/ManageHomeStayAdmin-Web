import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ProjectDashboardAppView = lazy(() => import('./components/views/ProjectDashboardAppView'));

/**
 * Project Dashboard App  Route
 */
const route: FuseRouteItemType = {
	path: 'apps/rooms',
	element: <ProjectDashboardAppView />
};

export default route;
