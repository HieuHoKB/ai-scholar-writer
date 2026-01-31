import OpenAI from "openai";

const openrouter = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY || "",
	baseURL: "https://openrouter.ai/api/v1",
});

export const runtime = "edge";

export async function POST(req: Request) {
	try {
		const { content, section, type } = await req.json();

		let systemMessage = "";
		let userPrompt = "";

		switch (type) {
			case "improve":
				systemMessage = `You are an academic writing editor. Improve the following text for academic writing quality. 
        Focus on: clarity, academic vocabulary, sentence structure, flow, and APA style.`;
				userPrompt = `Improve this ${section} content:\n\n${content}`;
				break;

			case "citation":
				systemMessage = `You are an academic citation expert. Suggest relevant citations for the content provided.
        Focus on: peer-reviewed sources, recent publications (last 5 years), and seminal works in the field.`;
				userPrompt = `Suggest citations for this ${section} content:\n\n${content}`;
				break;

			case "expand":
				systemMessage = `You are an academic writing coach. Expand the content while maintaining academic rigor.
        Focus on: adding depth, supporting arguments with evidence, logical flow.`;
				userPrompt = `Expand this ${section} content with more detail:\n\n${content}`;
				break;

			default:
				systemMessage = "You are an academic writing assistant.";
				userPrompt = `Review this content: ${content}`;
		}

		const completion = await openrouter.chat.completions.create({
			model: "openai/gpt-oss-120b:free",
			messages: [
				{ role: "system", content: systemMessage },
				{ role: "user", content: userPrompt },
			],
			temperature: 0.5,
			max_tokens: 1500,
			stream: true,
		});

		// Create a ReadableStream from the OpenRouter response
		const readableStream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				try {
					for await (const chunk of completion) {
						const text = chunk.choices[0]?.delta?.content || "";
						if (text) {
							controller.enqueue(encoder.encode(text));
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
		console.error("Suggestion error:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate suggestions" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
