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
		id: 'rooms',
		title: 'Phòng',
		subtitle: 'Quản lý phòng của bạn',
		type: 'group',
		icon: 'lucide:layout-dashboard',
		translate: 'ROOMS',
		children: [
			{
				id: 'rooms.list',
				title: 'Phòng',
				type: 'item',
				icon: 'heroicons-outline:home-modern',
				url: '/apps/rooms'
			},
			{
				id: 'rooms.random-generator',
				title: 'Tạo mật khẩu',
				type: 'item',
				icon: 'lucide:shuffle',
				url: '/apps/random-generator'
			}
		]
	},
	{
		id: 'amenities',
		title: 'Tiện nghi',
		subtitle: 'Quản lý tiện nghi của bạn',
		type: 'group',
		icon: 'lucide:package',
		translate: 'AMENITIES',
		children: [
			{
				id: 'amenities.list',
				title: 'Tiện nghi',
				type: 'item',
				icon: 'lucide:package',
				url: '/apps/amenities/list'
			}
		]
	},
	// {
	// 	id: 'bookings',
	// 	title: 'Bookings',
	// 	subtitle: 'Manage your bookings',
	// 	type: 'group',
	// 	icon: 'lucide:calendar',
	// 	translate: 'BOOKINGS',
	// 	children: [
	// 		{
	// 			id: 'bookings.list',
	// 			title: 'Bookings',
	// 			type: 'item',
	// 			icon: 'lucide:calendar-days',
	// 			url: '/apps/bookings'
	// 		}
	// 	]
	// }
];

export default navigationConfig;
