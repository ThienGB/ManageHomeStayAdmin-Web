'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { AmenitiesAppContextProvider } from '../../context/amenities-context/AmenitiesAppContextProvider';
import AmenitiesHeader from '../ui/AmenitiesHeader';
import AmenitiesTable from '../ui/AmenitiesTable';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function AmenitiesAppView() {
	const [searchTerm, setSearchTerm] = useState('');

	return (
		<Root
			header={<AmenitiesHeader onSearchChange={setSearchTerm} />}
			content={<AmenitiesTable searchTerm={searchTerm} />}
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
