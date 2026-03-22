export async function GET({ url }) {
    const query = url.searchParams.get('query') || 'conflict';
    const max = url.searchParams.get('max') || '10';
    
    try {
        const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=${max}&format=json`;
        const res = await fetch(gdeltUrl);
        const text = await res.text();
        
        // GDELT sometimes returns non-JSON, handle gracefully
        try {
            const data = JSON.parse(text);
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch {
            // If GDELT returns HTML or error, return empty
            return new Response(JSON.stringify({ articles: [] }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (e) {
        console.error('GDELT proxy error:', e.message);
        return new Response(JSON.stringify({ articles: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
