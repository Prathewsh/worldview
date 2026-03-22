/**
 * Local AI Service - Connects to Ollama for local synthesis
 * Default endpoint: http://localhost:11434
 */

export class AIService {
    constructor(endpoint = 'http://localhost:11434') {
        this.endpoint = endpoint;
        this.model = 'llama3'; // Default model
    }

    async synthesizeBrief(newsItems) {
        const prompt = `Synthesize the following 10 news headlines into a 3-sentence intelligence brief. Focus on strategic implications and escalation risk. Use a tactical tone.
        
Headlines:
${newsItems.map(i => `- ${i.title}`).join('\n')}

Brief:`;

        try {
            const response = await fetch(`${this.endpoint}/api/generate`, {
                method: 'POST',
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false
                })
            });

            const data = await response.json();
            return data.response;
        } catch (e) {
            console.warn('Ollama not reached. Falling back to rule-based synthesis.');
            return this.fallbackSynthesis(newsItems);
        }
    }

    fallbackSynthesis(newsItems) {
        // Simple logic to mock strategic brief if AI is offline
        const criticalCount = newsItems.filter(i => i.title.toLowerCase().includes('strike') || i.title.toLowerCase().includes('attack')).length;
        return `SIGNALS CONVERGENCE: Detected ${newsItems.length} new signals in current sector. ${criticalCount} events flagged for high escalation risk. Monitor SIGINT output for tactical shifts in UKR/MIDEAST theaters.`;
    }

    async getCountryRisk(countryData) {
        // Logic for Country Intelligence Index risk scoring
        // Simplified for this version
        const score = (countryData.inflation * 0.2) + (countryData.conflictIndex * 0.5) + (countryData.stability * 0.3);
        return Math.min(100, Math.max(0, score));
    }
}

export const aiService = new AIService();
