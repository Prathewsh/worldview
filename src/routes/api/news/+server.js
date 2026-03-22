export async function GET() {
	try {
		const res = await fetch('https://www.gdacs.org/xml/rss.xml', {
			headers: {
				'Accept': 'application/xml, text/xml, */*'
			}
		});
		
		if (!res.ok) throw new Error(`GDACS_FETCH_ERROR: ${res.status}`);
		
		const xmlText = await res.text();
		
		return new Response(xmlText, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=300'
			}
		});
	} catch (e) {
		console.error('GDACS_PROXY_FAILURE:', e);
		return new Response(JSON.stringify({ error: e.message }), { status: 500 });
	}
}
