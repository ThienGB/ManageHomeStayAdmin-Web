'use client';

import { CategoriesAppContextProvider } from '../../context/categories-context/CategoriesAppContextProvider';
import CategoriesHeader from '../ui/CategoriesHeader';
import CategoriesTable from '../ui/CategoriesTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

function CategoriesAppView() {
	return (
		<Root
			header={<CategoriesHeader />}
			content={<CategoriesTable />}
		/>
	);
}

const CategoriesWapper = () => {
	return (
		<CategoriesAppContextProvider>
			<CategoriesAppView />
		</CategoriesAppContextProvider>
	);
}
export default CategoriesWapper;
