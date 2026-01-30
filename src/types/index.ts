// Type definitions for the AI Scholar Writer application

export interface SearchResult {
	title: string;
	url: string;
	snippet: string;
	publishedDate?: string;
	author?: string;
}

export interface Citation {
	id: string;
	authors: string[];
	year: number;
	title: string;
	source: string;
	doi?: string;
	url?: string;
}

export interface PaperSection {
	id: string;
	title: string;
	content: string;
	citations: Citation[];
	status: "pending" | "in_progress" | "complete";
}

export interface Manuscript {
	id: string;
	title: string;
	abstract?: string;
	sections: PaperSection[];
	keywords: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface UserInput {
	theory: string;
	researchQuestion: string;
	methodology: string;
	dataDescription?: string;
	expectedFindings?: string;
}

export interface WritingSuggestion {
	id: string;
	sectionId: string;
	type: "citation" | "improvement" | "structure" | "clarity";
	suggestion: string;
	replacement?: string;
	confidence: number;
}

export interface BraveSearchConfig {
	apiKey: string;
	endpoint: string;
	timeout: number;
}

export interface AppState {
	currentSection: number;
	manuscript: Manuscript;
	userInput: UserInput;
	isGenerating: boolean;
	searchResults: SearchResult[];
}
