export async function GET() {
	try {
		// Using the robust radio-browser.info API with server-side fetch to bypass CORS
		const res = await fetch('https://de1.api.radio-browser.info/json/stations/topclick', {
			headers: {
				'User-Agent': 'WorldviewDashboard/1.0'
			}
		});
		
		if (!res.ok) throw new Error(`RADIO_API_FAILURE: ${res.status}`);
		
		const rawData = await res.json();
		const data = rawData.filter(s => (s.url_resolved || s.url || '').startsWith('https://'));
		
		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (e) {
		console.error('RADIO_PROXY_FAILURE:', e);
		return new Response(JSON.stringify({ error: e.message }), { status: 500 });
	}
}
