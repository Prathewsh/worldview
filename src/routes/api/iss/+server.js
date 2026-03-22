export async function GET() {
	try {
		const res = await fetch('http://api.open-notify.org/iss-now.json');
		
		if (!res.ok) throw new Error(`ISS_API_FAILURE: ${res.status}`);
		
		const data = await res.json();
		
		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=1'
			}
		});
	} catch (e) {
		console.error('ISS_PROXY_FAILURE:', e);
		return new Response(JSON.stringify({ error: e.message }), { status: 500 });
	}
}
