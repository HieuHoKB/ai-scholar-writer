// Brave Search API integration for finding academic sources and citations

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

export interface SearchResult {
	title: string;
	url: string;
	snippet: string;
	publishedDate?: string;
	author?: string;
}

export class BraveSearchService {
	private apiKey: string;

	constructor(apiKey?: string) {
		this.apiKey = apiKey || process.env.BRAVE_SEARCH_API_KEY || "";
	}

	async searchAcademicLiterature(
		query: string,
		count: number = 5,
	): Promise<SearchResult[]> {
		if (!this.apiKey) {
			console.warn("Brave Search API key not configured");
			return [];
		}

		try {
			const response = await fetch(
				`${BRAVE_API_BASE}/search?q=${encodeURIComponent(
					query,
				)}&count=${count}&engines=google,bing`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"X-Subscription-Token": this.apiKey,
					},
				},
			);

			if (!response.ok) {
				console.error(`Brave Search API error: ${response.status}`);
				return [];
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
			console.error("Brave Search error:", error);
			return [];
		}
	}

	async searchForSection(
		section: string,
		topic: string,
	): Promise<SearchResult[]> {
		const queries = this.buildSearchQueries(section, topic);
		const results: SearchResult[] = [];

		for (const query of queries) {
			const searchResults = await this.searchAcademicLiterature(query, 3);
			results.push(...searchResults);
		}

		// Remove duplicates
		const uniqueResults = results.filter(
			(result, index, self) =>
				index === self.findIndex((r) => r.url === result.url),
		);

		return uniqueResults.slice(0, 10);
	}

	private buildSearchQueries(section: string, topic: string): string[] {
		const baseQueries: Record<string, string[]> = {
			introduction: [
				`${topic} research introduction background`,
				`${topic} research problem significance`,
				`${topic} research gap literature review`,
			],
			literature: [
				`${topic} theoretical framework`,
				`${topic} prior research studies`,
				`${topic} literature review academic`,
			],
			methods: [
				`${topic} research methodology`,
				`${topic} data collection analysis`,
				`${topic} research design sampling`,
			],
			results: [
				`${topic} research findings statistics`,
				`${topic} empirical results data`,
			],
			discussion: [
				`${topic} research implications`,
				`${topic} study limitations future research`,
				`${topic} theoretical practical implications`,
			],
			title: [`${topic} research paper title academic`],
			references: [`${topic} academic sources citations`],
		};

		return baseQueries[section.toLowerCase()] || [`${topic} academic research`];
	}
}

// Helper function to create APA citation from search result
export function createAPACitation(result: SearchResult): string {
	const author = result.author || "Unknown";
	const year = result.publishedDate
		? new Date(result.publishedDate).getFullYear()
		: "n.d.";
	const title = result.title;
	const url = result.url;

	return `${author}. (${year}). ${title}. ${url}`;
}

// Generate citation key for referencing
export function generateCitationKey(result: SearchResult): string {
	const firstAuthor = result.author?.split(" ")[0] || "Unknown";
	const year = result.publishedDate
		? new Date(result.publishedDate).getFullYear()
		: "nd";
	return `${firstAuthor}${year}`.toLowerCase().replace(/\s+/g, "");
}

// Export singleton instance
export const braveSearch = new BraveSearchService();
