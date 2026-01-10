import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const amenitiesApi = [
	/**
	 * GET api/mock/amenities
	 */
	http.get('/api/mock/amenities', async ({ request }) => {
		const api = mockApi('amenities');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/amenities
	 */
	http.post('/api/mock/amenities', async ({ request }) => {
		const api = mockApi('amenities');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/amenities/:id
	 */
	http.get('/api/mock/amenities/:id', async ({ params }) => {
		const api = mockApi('amenities');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Amenity not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/amenities/:id
	 */
	http.put('/api/mock/amenities/:id', async ({ params, request }) => {
		const api = mockApi('amenities');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Amenity not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/amenities/:id
	 */
	http.delete('/api/mock/amenities/:id', async ({ params }) => {
		const api = mockApi('amenities');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Amenity not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * DELETE api/mock/amenities (batch delete)
	 */
	http.delete('/api/mock/amenities', async ({ request }) => {
		const api = mockApi('amenities');
		const ids = (await request.json()) as string[];
		const result = await api.delete(ids);
		return HttpResponse.json({ success: result.success });
	}),

	/**
	 * GET api/mock/amenity-categories
	 */
	http.get('/api/mock/amenity-categories', async ({ request }) => {
		const api = mockApi('amenity_categories');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/amenity-categories
	 */
	http.post('/api/mock/amenity-categories', async ({ request }) => {
		const api = mockApi('amenity_categories');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/amenity-categories/:id
	 */
	http.get('/api/mock/amenity-categories/:id', async ({ params }) => {
		const api = mockApi('amenity_categories');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Category not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/amenity-categories/:id
	 */
	http.put('/api/mock/amenity-categories/:id', async ({ params, request }) => {
		const api = mockApi('amenity_categories');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Category not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/amenity-categories/:id
	 */
	http.delete('/api/mock/amenity-categories/:id', async ({ params }) => {
		const api = mockApi('amenity_categories');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Category not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * DELETE api/mock/amenity-categories (batch delete)
	 */
	http.delete('/api/mock/amenity-categories', async ({ request }) => {
		const api = mockApi('amenity_categories');
		const ids = (await request.json()) as string[];
		const result = await api.delete(ids);
		return HttpResponse.json({ success: result.success });
	})
];

export default amenitiesApi;
