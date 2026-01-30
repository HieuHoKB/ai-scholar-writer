// Paper section types and structures for academic writing
export interface PaperSection {
	id: SectionType;
	title: string;
	description: string;
	placeholder: string;
	required: boolean;
}

export type SectionType =
	| "title"
	| "introduction"
	| "literature_review"
	| "methods"
	| "results"
	| "discussion"
	| "references";

export const ACADEMIC_SECTIONS: PaperSection[] = [
	{
		id: "title",
		title: "Title",
		description: "Research paper title",
		placeholder: "Enter your research paper title...",
		required: true,
	},
	{
		id: "introduction",
		title: "Introduction",
		description: "Introduce the research problem and significance",
		placeholder:
			"Describe the research context, problem statement, and objectives...",
		required: true,
	},
	{
		id: "literature_review",
		title: "Literature Review",
		description: "Synthesize prior research",
		placeholder: "Review relevant literature and identify gaps...",
		required: true,
	},
	{
		id: "methods",
		title: "Methods",
		description: "Describe research methodology",
		placeholder:
			"Explain your research design, data collection, and analysis methods...",
		required: true,
	},
	{
		id: "results",
		title: "Results",
		description: "Present research findings",
		placeholder:
			"Report your findings with appropriate statistical reporting...",
		required: true,
	},
	{
		id: "discussion",
		title: "Discussion",
		description: "Interpret findings and implications",
		placeholder:
			"Discuss implications, limitations, and future research directions...",
		required: true,
	},
	{
		id: "references",
		title: "References",
		description: "APA formatted references",
		placeholder: "Add your citations here...",
		required: true,
	},
];

export interface ManuscriptData {
	title: string;
	abstract?: string;
	sections: Record<SectionType, SectionContent>;
	keywords?: string[];
	authors?: AuthorInfo[];
}

export interface SectionContent {
	content: string;
	citations: Citation[];
	suggestions?: WritingSuggestion[];
}

export interface Citation {
	id: string;
	text: string;
	sourceUrl: string;
	formattedCitation: string;
}

export interface WritingSuggestion {
	id: string;
	type: "improvement" | "citation" | "structure" | "clarity";
	text: string;
	replacement?: string;
	explanation: string;
}

export interface AuthorInfo {
	name: string;
	affiliation?: string;
	orcid?: string;
	email?: string;
}

// Section-specific writing guidance
export const SECTION_GUIDANCE: Record<SectionType, string[]> = {
	title: [
		"Be concise but descriptive (15-20 words)",
		"Include key variables or concepts",
		'Avoid unnecessary words like "A Study of..."',
	],
	introduction: [
		"Start with broad context, narrow to specific problem",
		"Present research gap or problem significance",
		"State research questions or objectives",
		"Briefly mention methodology approach",
	],
	literature_review: [
		"Organize by themes, not just chronologically",
		"Synthesize, don't just summarize",
		"Identify",
		"Show gaps in existing research how your study addresses these gaps",
	],
	methods: [
		"Be detailed enough for replication",
		"Describe sampling procedure",
		"Explain data analysis approach",
		"Address ethical considerations",
	],
	results: [
		"Report findings objectively",
		"Use appropriate statistical notation",
		"Include effect sizes and confidence intervals",
		"Use tables/figures when helpful",
	],
	discussion: [
		"Interpret results in context of literature",
		"Acknowledge limitations honestly",
		"Discuss theoretical and practical implications",
		"Suggest future research directions",
	],
	references: [
		"Use APA 7th edition format",
		"Include DOIs when available",
		"Ensure all in-text citations appear in references",
		"Use primary sources when possible",
	],
};

// Helper to check section completion
export function isSectionComplete(section: SectionContent): boolean {
	return section.content.length > 50 && section.citations.length > 0;
}

// Calculate overall manuscript progress
export function calculateProgress(data: ManuscriptData): number {
	const sections = Object.values(data.sections);
	const completedSections = sections.filter(isSectionComplete).length;
	return Math.round((completedSections / sections.length) * 100);
}
