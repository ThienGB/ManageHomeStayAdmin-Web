import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import i18n from '@i18n';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'Unique dashboard designs',
		type: 'group',
		icon: 'lucide:layout-dashboard',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'dashboards.project',
				title: 'Project',
				type: 'item',
				icon: 'lucide:clipboard-check',
				url: '/dashboards/project'
			},
			{
				id: 'dashboards.analytics',
				title: 'Analytics',
				type: 'item',
				icon: 'lucide:chart-pie',
				url: '/dashboards/analytics'
			}
		]
	},
	{
		id: 'attractions',
		title: 'Attractions',
		subtitle: 'Manage your attractions',
		type: 'group',
		icon: 'lucide:layout-dashboard',
		translate: 'ATTRACTION',
		children: [
			{
				id: 'attractions.attraction',
				title: 'Attractions',
				type: 'item',
				icon: 'heroicons-outline:home-modern',
				url: '/apps/attractions'
			}
		]
	},
	{
		id: 'amenities',
		title: 'Amenities',
		subtitle: 'Manage amenities and categories',
		type: 'group',
		icon: 'lucide:package',
		translate: 'AMENITIES',
		children: [
			{
				id: 'amenities.list',
				title: 'Amenities',
				type: 'item',
				icon: 'lucide:package',
				url: '/apps/amenities/list'
			},
			{
				id: 'amenities.categories',
				title: 'Categories',
				type: 'item',
				icon: 'lucide:tags',
				url: '/apps/amenities/categories'
			}
		]
	},
	{
		id: 'schedules',
		title: 'Schedules',
		subtitle: 'Manage your schedules',
		type: 'group',
		icon: 'lucide:calendar',
		translate: 'SCHEDULES',
		children: [
			{
				id: 'schedules.types',
				title: 'Schedule Types',
				type: 'item',
				icon: 'lucide:calendar-days',
				url: '/apps/schedules/types'
			}
		]
	}
];

export default navigationConfig;
