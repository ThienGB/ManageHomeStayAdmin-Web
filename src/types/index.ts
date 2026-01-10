// ==== Core envelopes ====

/** Khung response chuẩn từ backend */
export type ApiResponse<T> = {
	success: boolean;
	data: T;
	message: string;
	errors?: string;
};

/** Cấu trúc dữ liệu phân trang */
export type Page<T> = {
	content: T[];
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
	pageable?: {
		pageNumber: number;
		pageSize: number;
		offset: number;
		paged: boolean;
		unpaged: boolean;
		sort?: {
			empty: boolean;
			sorted: boolean;
			unsorted: boolean;
		};
	};
};

/** Một response có thể là bản ghi đơn hoặc trang dữ liệu */
export type MaybePaged<T> = ApiResponse<T | Page<T>>;

/** Nếu muốn “khoá” theo compile-time: chọn paged hay không paged */
export type StrictApiResponse<T, Paged extends boolean = false> = ApiResponse<Paged extends true ? Page<T> : T>;

/** type Pagination **/
export type Pagination = {
	page: number;
	limit: number;
	sortDir?: 'asc' | 'desc';
};

// ==== Type guards ====

/** Kiểm tra data có phải Page<T> hay không */
export function isPageData<T>(data: unknown): data is Page<T> {
	if (!data || typeof data !== 'object') return false;

	const d = data as Record<string, unknown>;
	return Array.isArray(d.content) && typeof d.totalElements === 'number';
}

/** Kiểm tra response có phải dạng phân trang */
export function isPagedResponse<T>(res: MaybePaged<T>): res is ApiResponse<Page<T>> {
	return isPageData<T>(res.data);
}

// ==== Helper normalize để UI dùng 1 kiểu duy nhất ====

export function normalizeData<T>(res: MaybePaged<T>) {
	if (isPagedResponse<T>(res)) {
		const { content, ...meta } = res.data;
		return { items: content, page: meta, success: res.success, message: res.message };
	}

	// Không phân trang -> items là mảng 1 phần tử
	return {
		items: res.data ? [res.data as T] : [],
		page: undefined,
		success: res.success,
		message: res.message
	};
}

// ==== Ví dụ domain type ====

export type Amenity = {
	_id: string;
	name: string;
	icon: string;
	description: string;
	categoryId: {
		_id: string;
		name: string;
		description: string;
	};
	createdAt: string;
	updatedAt: string;
	isDeleted: boolean;
};

// Dùng khi gọi list (phân trang):
export type AmenityListResponse = StrictApiResponse<Amenity, true>;
// Dùng khi gọi detail (không phân trang):
export type AmenityDetailResponse = StrictApiResponse<Amenity, false>;

// Hoặc chấp nhận cả hai trong 1 hàm:
export type AmenityMaybePagedResponse = MaybePaged<Amenity>;
