'use client';

import FuseLoading from '@fuse/core/FuseLoading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to rooms page as default
		router.push('/apps/rooms');
	}, [router]);

	return <FuseLoading />;
}
