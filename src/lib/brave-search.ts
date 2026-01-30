// Brave Search API integration for literature search
// API Documentation: https://api-docs.brave.com/

const BRAVE_API_BASE = "https://api.search.brave.com/res/v1";

interface BraveSearchResponse {
	web?: {
		results: Array<{
			title: string;
			url: string;
			description: string;
			published_at?: string;
			author?: string;
		}>;
	};
}

interface SearchResult {
	title: string;
	url: string;
	snippet: string;
	publishedDate?: string;
	author?: string;
}

export class BraveSearchAPI {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async searchAcademicLiterature(
		query: string,
		count: number = 10,
	): Promise<SearchResult[]> {
		try {
			// Build URL with query parameters
			const searchParams = new URLSearchParams({
				q: `${query} academic research journal`,
				count: count.toString(),
				engines: "google,bing",
			});
			const url = `${BRAVE_API_BASE}/search?${searchParams.toString()}`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"X-Subscription-Token": this.apiKey,
				},
			});

			if (!response.ok) {
				throw new Error(`Brave Search API error: ${response.status}`);
			}

			const data: BraveSearchResponse = await response.json();

			return (data.web?.results || []).map((result) => ({
				title: result.title,
				url: result.url,
				snippet: result.description,
				publishedDate: result.published_at,
				author: result.author,
			}));
		} catch (error) {
			console.error("Brave Search API error:", error);
			return [];
		}
	}

	async searchByTopic(
		topic: string,
		field: string = "social sciences",
	): Promise<SearchResult[]> {
		const query = `${topic} ${field} research study`;
		return this.searchAcademicLiterature(query, 15);
	}
}

// Helper function to create citation in APA format
export function createAPACitation(result: SearchResult): string {
	const author = result.author ? `${result.author}.` : "";
	const year = result.publishedDate
		? new Date(result.publishedDate).getFullYear()
		: "n.d.";
	const title = result.title;
	const source = result.url;

	return `${author} (${year}). ${title}. ${source}`;
}

// Citation manager for managing references
export class CitationManager {
	private citations: Map<string, SearchResult>;

	constructor() {
		this.citations = new Map();
	}

	addCitation(result: SearchResult): string {
		const id = this.generateCitationId(result);
		this.citations.set(id, result);
		return id;
	}

	generateCitationId(result: SearchResult): string {
		const firstAuthor = result.author?.split(" ")[0] || "Unknown";
		const year = result.publishedDate
			? new Date(result.publishedDate).getFullYear()
			: "nd";
		return `${firstAuthor}${year}`.toLowerCase().replace(/\s+/g, "");
	}

	getAPAFormattedCitation(id: string): string {
		const result = this.citations.get(id);
		if (!result) return "";
		return createAPACitation(result);
	}

	getAllCitations(): SearchResult[] {
		return Array.from(this.citations.values());
	}

	formatReferencesList(): string {
		const citations = this.getAllCitations();
		return citations
			.map((result) => {
				const author = result.author || "Unknown Author";
				const year = result.publishedDate
					? new Date(result.publishedDate).getFullYear()
					: "n.d.";
				const title = result.title;
				const url = result.url;

				return `${author}. (${year}). ${title}. ${url}`;
			})
			.sort((a, b) => a.localeCompare(b))
			.join("\n\n");
	}
}
