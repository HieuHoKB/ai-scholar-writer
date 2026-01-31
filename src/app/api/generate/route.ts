import OpenAI from "openai";
import {
	braveSearch,
	createAPACitation,
	generateCitationKey,
	type SearchResult,
} from "@/lib/brave-search";

// Initialize OpenRouter client
const openrouter = new OpenAI({
	apiKey: process.env.OPENROUTER_API_KEY || "",
	baseURL: "https://openrouter.ai/api/v1",
});

export const runtime = "edge";

interface Citation {
	key: string;
	formatted: string;
	url: string;
}

interface GenerationResponse {
	content: string;
	sources: SearchResult[];
	citations: Citation[];
}

async function searchForRelevantSources(
	section: string,
	topic: string,
): Promise<SearchResult[]> {
	try {
		const results = await braveSearch.searchForSection(section, topic);
		return results;
	} catch (error) {
		console.error("Search error:", error);
		return [];
	}
}

async function generateWithSources(
	prompt: string,
	systemMessage: string,
	sources: SearchResult[],
): Promise<string> {
	// Build enhanced system message with sources
	const sourcesContext =
		sources.length > 0
			? `\n\nRelevant sources to cite:\n${sources
					.map((source, index) => `[${index + 1}] ${createAPACitation(source)}`)
					.join("\n")}`
			: "";

	const enhancedSystemMessage = `${systemMessage}${sourcesContext}

IMPORTANT: When discussing concepts from these sources, include inline citations in APA format like (Author, Year) or (Author1 & Author2, Year).
Include the citation key in brackets like [1], [2] that references the sources list.
Provide a comprehensive response that synthesizes information from these sources.`;

	const completion = await openrouter.chat.completions.create({
		model: "openai/gpt-oss-120b:free",
		messages: [
			{ role: "system", content: enhancedSystemMessage },
			{ role: "user", content: prompt },
		],
		temperature: 0.7,
		max_tokens: 2000,
		stream: false,
	});

	return completion.choices[0]?.message?.content || "";
}

export async function POST(req: Request): Promise<Response> {
	try {
		const { prompt, section, context, model } = await req.json();

		console.log("Generation request:", { model, section });
		console.log(
			"OpenRouter API key present:",
			!!process.env.OPENROUTER_API_KEY,
		);
		console.log(
			"Brave Search API key present:",
			!!process.env.BRAVE_SEARCH_API_KEY,
		);

		// Build system message for academic writing
		const systemMessage = `You are an academic writing assistant helping users write research papers.
    You write in formal academic English following APA 7th edition style.
    ${context ? `Context from previous sections: ${context}` : ""}
    
    Write high-quality academic content for the ${section} section.
    Focus on clarity, precision, and scholarly tone.
    Use appropriate academic vocabulary and sentence structures.`;

		// Search for relevant sources
		console.log("Searching for sources...");
		const sources = await searchForRelevantSources(section, prompt);
		console.log("Found sources:", sources.length);

		// Generate content with citations
		console.log("Generating content with OpenRouter...");
		const content = await generateWithSources(prompt, systemMessage, sources);
		console.log("Generated content length:", content.length);

		// Format citations
		const citations: Citation[] = sources.map((source) => ({
			key: generateCitationKey(source),
			formatted: createAPACitation(source),
			url: source.url,
		}));

		// Create response
		const responseData: GenerationResponse = {
			content,
			sources,
			citations,
		};

		return new Response(JSON.stringify(responseData), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: unknown) {
		console.error("AI Generation error:", error);

		// Log more details about the error
		if (error instanceof Error) {
			console.error("Error name:", error.name);
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}

		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return new Response(
			JSON.stringify({
				error: "Failed to generate content",
				details: errorMessage,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
