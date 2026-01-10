'use client';

import AttractionsHeader from '../ui/AttractionsHeader';
import AttractionsTable from '../ui/AttractionsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import { AttractionsAppContextProvider } from '../../context/attractions-context/AttractionsAppContextProvider';
import { useAttractionsAppContext } from '../../context/attractions-context/useAttractionsAppContext';
import { useAttractions } from '../../api/hooks/useAttractions';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function AttractionsAppView() {
	const { pagination, filters } = useAttractionsAppContext();
	
	const { data, isLoading } = useAttractions({
		...pagination,
		...filters
	});
	
	const totalResults = data?.data?.totalElements;

	return (
		<Root
			header={<AttractionsHeader totalResults={totalResults} isLoading={isLoading} />}
			content={<AttractionsTable />}
		/>
	);
}

const AttractionsWrapper = () => {
	return (
		<AttractionsAppContextProvider>
			<AttractionsAppView />
		</AttractionsAppContextProvider>
	);
};

export default AttractionsWrapper;
