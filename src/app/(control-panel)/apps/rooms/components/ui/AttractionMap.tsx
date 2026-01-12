import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import FuseLoading from '@fuse/core/FuseLoading';
import { memo } from 'react';

type AttractionMapProps = {
	coordinates?: [number, number]; // [longitude, latitude]
	name?: string;
	className?: string;
};

function AttractionMap(props: AttractionMapProps) {
	const { coordinates, name, className } = props;

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: import.meta.env.VITE_MAP_KEY
	});

	if (!coordinates || coordinates.length !== 2) {
		return (
			<div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
				<p className="text-gray-500">No location coordinates available</p>
			</div>
		);
	}

	const [lng, lat] = coordinates;
	const center = { lat, lng };

	const containerStyle = {
		width: '100%',
		height: '400px'
	};

	return isLoaded ? (
		<GoogleMap
			mapContainerStyle={containerStyle}
			mapContainerClassName={className}
			center={center}
			zoom={15}
			options={{
				streetViewControl: false,
				mapTypeControl: false,
				fullscreenControl: true,
				zoomControl: true,
			}}
		>
			<Marker 
				position={center}
				title={name}
			/>
		</GoogleMap>
	) : (
		<FuseLoading />
	);
}

export default memo(AttractionMap);
