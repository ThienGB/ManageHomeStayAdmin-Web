import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const attractionApi = [
	/**
	 * GET api/mock/attractions
	 */
	http.get('/api/mock/attractions', async ({ request }) => {
		const api = mockApi('attractions');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/attractions
	 */
	http.post('/api/mock/attractions', async ({ request }) => {
		const api = mockApi('attractions');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/attractions/:id
	 */
	http.get('/api/mock/attractions/:id', async ({ params }) => {
		const api = mockApi('attractions');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Attraction not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/attractions/:id
	 */
	http.put('/api/mock/attractions/:id', async ({ params, request }) => {
		const api = mockApi('attractions');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Attraction not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/attractions/:id
	 */
	http.delete('/api/mock/attractions/:id', async ({ params }) => {
		const api = mockApi('attractions');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Attraction not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * DELETE api/mock/attractions (batch delete)
	 */
	http.delete('/api/mock/attractions', async ({ request }) => {
		const api = mockApi('attractions');
		const ids = (await request.json()) as string[];
		const result = await api.delete(ids);
		return HttpResponse.json({ success: result.success });
	}),

	/**
	 * GET api/mock/attraction-categories
	 */
	http.get('/api/mock/attraction-categories', async ({ request }) => {
		const api = mockApi('attraction_categories');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default attractionApi;
