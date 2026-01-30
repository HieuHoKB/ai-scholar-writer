import OpenAI from "openai";

// Initialize OpenRouter client
const openrouter = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY || "",
	baseURL: "https://openrouter.ai/api/v1",
});

export const runtime = "edge";

export async function POST(req: Request) {
	try {
		const { prompt, section, context, model } = await req.json();

		// Build system message for academic writing
		const systemMessage = `You are an academic writing assistant helping users write research papers.
    You write in formal academic English following APA 7th edition style.
    ${context ? `Context from previous sections: ${context}` : ""}
    
    Write high-quality academic content for the ${section} section.
    Focus on clarity, precision, and scholarly tone.
    Use appropriate academic vocabulary and sentence structures.`;

		// Call OpenRouter API directly with streaming
		const completion = await openrouter.chat.completions.create({
			model: model || "anthropic/claude-3-haiku",
			messages: [
				{ role: "system", content: systemMessage },
				{ role: "user", content: prompt },
			],
			temperature: 0.7,
			max_tokens: 2000,
			stream: true,
		});

		// Create a ReadableStream from the OpenRouter response
		const readableStream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				try {
					for await (const chunk of completion) {
						const content = chunk.choices[0]?.delta?.content || "";
						if (content) {
							controller.enqueue(encoder.encode(content));
						}
					}
					controller.close();
				} catch (error) {
					console.error("Stream processing error:", error);
					controller.error(error);
				}
			},
		});

		return new Response(readableStream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Transfer-Encoding": "chunked",
			},
		});
	} catch (error) {
		console.error("AI Generation error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate content" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
