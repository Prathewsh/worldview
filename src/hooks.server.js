/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const response = await resolve(event);
    
    // Explicitly allow compute-pressure in the dashboard document to quiet YouTube telemetry violations.
    // Also including common situational permissions for the tactical board.
    response.headers.set('Permissions-Policy', 'compute-pressure=(*), geolocation=(*), camera=(*), microphone=(*)');
    
    return response;
}
