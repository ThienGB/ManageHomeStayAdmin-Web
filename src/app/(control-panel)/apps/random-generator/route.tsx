import authRoles from '@auth/authRoles';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const RandomNumberGeneratorView = lazy(() => import('./RandomNumberGeneratorView'));

/**
 * The Random Generator App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/random-generator',
	element: <RandomNumberGeneratorView />,
	auth: authRoles.admin
};

export default route;
