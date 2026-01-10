import { useState, useMemo } from 'react';
import { TextField, Autocomplete, FormControl, FormLabel, Box, AutocompleteProps } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useIcons } from '@/app/(public)/documentation/api/hooks/useIcons';

type IconSet = 'heroicons' | 'lucide' | 'feather';

interface IconSearchFieldProps {
	label?: string;
	value?: string;
	onChange: (value: string) => void;
	error?: boolean;
	helperText?: string;
	placeholder?: string;
	iconSet?: IconSet;
	maxResults?: number;
	required?: boolean;
	disabled?: boolean;
	fullWidth?: boolean;
}

const iconSetConfig: Record<IconSet, { apiUrl: string; prefix: string }> = {
	heroicons: { apiUrl: 'mock/ui-icons/heroicons', prefix: 'heroicons-outline:' },
	lucide: { apiUrl: 'mock/ui-icons/lucide', prefix: 'lucide:' },
	feather: { apiUrl: 'mock/ui-icons/feather', prefix: 'feather:' }
};

function IconSearchField({
	label = 'Icon',
	value = '',
	onChange,
	error = false,
	helperText,
	placeholder = 'Search icons (e.g., home, wifi, user)',
	iconSet = 'heroicons',
	maxResults = 50,
	required = false,
	disabled = false,
	fullWidth = true
}: IconSearchFieldProps) {
	const config = iconSetConfig[iconSet];
	const { data: icons = [], isLoading } = useIcons(config.apiUrl);
	const [searchText, setSearchText] = useState('');

	const filteredIcons = useMemo(() => {
		if (!icons) return [];
		if (!searchText) return icons.slice(0, maxResults);
		return icons.filter((icon) => icon.toLowerCase().includes(searchText.toLowerCase())).slice(0, maxResults);
	}, [icons, searchText, maxResults]);

	const normalizeIconValue = (iconValue: string) => {
		if (!iconValue) return '';
		// Remove any existing prefix
		return iconValue
			.replace('heroicons-outline:', '')
			.replace('heroicons-solid:', '')
			.replace('lucide:', '')
			.replace('feather:', '');
	};

	const formatIconValue = (iconName: string) => {
		if (!iconName) return '';
		return `${config.prefix}${iconName}`;
	};

	const displayValue = normalizeIconValue(value);

	return (
		<FormControl 
			className={fullWidth ? 'w-full' : ''}
			error={error}
			disabled={disabled}
		>
			<FormLabel 
				htmlFor="icon-search" 
				className="flex gap-2 items-center"
				required={required}
			>
				{label}
				{value && (
					<FuseSvgIcon size={20} color="action">
						{value.includes(':') ? value : formatIconValue(value)}
					</FuseSvgIcon>
				)}
			</FormLabel>
			<Autocomplete
				freeSolo
				options={filteredIcons}
				value={displayValue}
				onChange={(event, newValue) => {
					onChange(newValue ? formatIconValue(newValue) : '');
				}}
				onInputChange={(event, newInputValue) => {
					setSearchText(newInputValue);
				}}
				loading={isLoading}
				disabled={disabled}
				renderOption={(props, option) => (
					<Box 
						component="li" 
						{...props} 
						className="flex items-center gap-2 p-2"
						key={option}
					>
						<FuseSvgIcon size={20} color="action">
							{formatIconValue(option)}
						</FuseSvgIcon>
						<span>{option}</span>
					</Box>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={placeholder}
						id="icon-search"
						error={error}
						helperText={helperText}
					/>
				)}
			/>
		</FormControl>
	);
}

export default IconSearchField;
