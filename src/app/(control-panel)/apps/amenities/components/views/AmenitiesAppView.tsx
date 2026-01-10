'use client';

import { AmenitiesAppContextProvider } from '../../context/amenities-context/AmenitiesAppContextProvider';
import AmenitiesHeader from '../ui/AmenitiesHeader';
import AmenitiesTable from '../ui/AmenitiesTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function AmenitiesAppView() {
	return (
		<Root
			header={<AmenitiesHeader />}
			content={<AmenitiesTable />}
		/>
	);
}

const AmenitiesWrapper = () => {
	return (
		<AmenitiesAppContextProvider>
			<AmenitiesAppView />
		</AmenitiesAppContextProvider>
	);
}

export default AmenitiesWrapper;
