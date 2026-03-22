# 🌐 WORLDVIEW
**Global Tactical Situational Awareness Dashboard**

WORLDVIEW is a high-performance, real-time command center interface built with **SvelteKit**. It aggregates critical terrestrial, orbital, financial, and signal intelligence into a unified, privacy-hardened tactical display.

## 📡 Live Telemetry & Systems

WORLDVIEW operates multiple independent data-streams simultaneously without compromising on rendering performance:

*   **🌍 Seismic Monitoring Grid (Leaflet + USGS)**
    *   Live mapping of global tectonic activity.
    *   Sub-5-second data synchronization with the USGS earthquake network.
    *   DOM-optimized isolated layer rendering to prevent browser thrashing.
*   **🛰️ Orbit Tracker (Three.js + Globe.gl)**
    *   True-3D interpolation of the International Space Station's orbital trajectory.
    *   Optimized garbage collection to ensure a fluid 60FPS tactical display without memory leaks.
*   **📻 Signals Intel Deck (Radio Browser API)**
    *   Server-side CORS-bypassing proxy for intercepting the top global radio frequencies.
    *   Real-time playback and signal bandwidth diagnostics.
*   **📺 Real-time News Matrix (HLS.js)**
    *   Live interception of IPTV global news feeds (BBC, ABC News, CNN, Al Jazeera, etc.).
    *   Automated Quality-of-Service (QoS) matching for high-definition English streams.
*   **📈 Terrestrial Biosignature & Markets**
    *   Live global population counter synchronized with terrestrial growth rates (~2.2 persons/sec).
    *   Constant Bitcoin (BTC/USD) market tracking via CoinGecko.
*   **🎥 Tactical Situation Monitors**
    *   Encrypted, privacy-enhanced video feeds of the Middle East and Earth Orbit.

## ⚙️ Architecture & Security

The system is designed to bypass standard browser restrictions that typically hinder intensive situational dashboards.

*   **Internal Proxies**: Uses SvelteKit API routes to create server-side relays for third-party endpoints, effectively bypassing client-side CORS blockers.
*   **Permissions Policy Hardening**: Defines a strict document-level permissions policy to allow `compute-pressure` while silencing external tracking violations.
*   **Memory Optimization**: Avoids Svelte reactive thrashing in heavy animation frames by manipulating WebGL internal state directly.

## 🚀 Deployment & Operations

To bring the tactical dashboard online locally:

1.  **Clone the Repository**
2.  **Install Dependencies**: Install the required engine modules (Svelte, Three.js, Leaflet, etc.)
    ```bash
    npm install
    ```
3.  **Engage Development Server**:
    ```bash
    npm run dev
    ```
4.  Navigate to `http://localhost:5173` in your browser to view the active feed.

## 🎨 Variants (Themes)

The dashboard supports dynamic hot-swapping between different tactical color palettes through the top-bar control array:
*   `W` - Default Tactical (Sky Blue)
*   `T` - Technosignatures (Neon Green)
*   `F` - Financial/Market (Amber/Gold)
*   `C` - Commodity/Earth (Crimson/Red)
*   `H` - High Contrast (Monochrome)

---
*End of Line.*
