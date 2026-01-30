"use client";

import {
	BookOpen,
	ChevronRight,
	FileText,
	Link,
	Search,
	Sparkles,
} from "lucide-react";
import { useState } from "react";

// Define paper sections
const PAPER_SECTIONS = [
	{
		id: "title",
		title: "Title & Abstract",
		description: "Craft your research title and abstract",
	},
	{
		id: "introduction",
		title: "Introduction",
		description: "Introduce your research question and significance",
	},
	{
		id: "literature",
		title: "Literature Review",
		description: "Synthesize relevant prior research",
	},
	{
		id: "methods",
		title: "Methods",
		description: "Describe your research methodology",
	},
	{ id: "results", title: "Results", description: "Present your findings" },
	{
		id: "discussion",
		title: "Discussion",
		description: "Interpret your results and implications",
	},
	{
		id: "references",
		title: "References",
		description: "Manage your citations",
	},
];

export default function Home() {
	const [currentSection, setCurrentSection] = useState(0);
	const [theoryInput, setTheoryInput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [paperData, setPaperData] = useState({
		title: "",
		abstract: "",
		sections: {} as Record<string, { content: string; citations: string[] }>,
	});

	const handleStartWriting = () => {
		if (!theoryInput.trim()) return;
		setIsGenerating(true);

		// Simulate AI processing
		setTimeout(() => {
			setPaperData((prev) => ({
				...prev,
				sections: {
					title: {
						content: `Research Paper: ${theoryInput.substring(0, 50)}...`,
						citations: [],
					},
					introduction: { content: "", citations: [] },
					literature: { content: "", citations: [] },
					methods: { content: "", citations: [] },
					results: { content: "", citations: [] },
					discussion: { content: "", citations: [] },
				},
			}));
			setIsGenerating(false);
		}, 2000);
	};

	return (
		<main className="min-h-screen">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<BookOpen className="w-8 h-8 text-primary-600" />
						<div>
							<h1 className="text-xl font-bold text-academic-navy">
								AI Scholar Writer
							</h1>
							<p className="text-xs text-academic-slate">
								Research Paper Assistant
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<button className="flex items-center space-x-2 text-sm text-academic-slate hover:text-primary-600">
							<Search className="w-4 h-4" />
							<span>Search Literature</span>
						</button>
						<button className="flex items-center space-x-2 text-sm text-academic-slate hover:text-primary-600">
							<Link className="w-4 h-4" />
							<span>Manage Citations</span>
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Welcome Section */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-academic-navy mb-4">
						Write Your Research Paper with AI Assistance
					</h2>
					<p className="text-lg text-academic-slate max-w-2xl mx-auto">
						Get help crafting academically rigorous research papers with proper
						APA formatting, citation management, and literature search powered
						by Brave Search API.
					</p>
				</div>

				{/* Theory Input Section */}
				<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
					<label className="block text-lg font-semibold text-academic-navy mb-3">
						What is your research about?
					</label>
					<textarea
						value={theoryInput}
						onChange={(e) => setTheoryInput(e.target.value)}
						placeholder="Describe your research theory, hypothesis, and key research questions..."
						className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none academic-text"
					/>
					<div className="mt-4 flex items-center justify-between">
						<p className="text-sm text-academic-slate">
							<Sparkles className="w-4 h-4 inline mr-1" />
							AI will help structure your paper based on your theory
						</p>
						<button
							onClick={handleStartWriting}
							disabled={!theoryInput.trim() || isGenerating}
							className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
						>
							{isGenerating ? (
								<>
									<span>Generating...</span>
								</>
							) : (
								<>
									<span>Start Writing</span>
									<ChevronRight className="w-5 h-5" />
								</>
							)}
						</button>
					</div>
				</div>

				{/* Paper Sections Overview */}
				{paperData.sections && Object.keys(paperData.sections).length > 0 && (
					<div className="bg-white rounded-xl shadow-lg p-8">
						<h3 className="text-xl font-semibold text-academic-navy mb-6 flex items-center">
							<FileText className="w-6 h-6 mr-2" />
							Paper Structure
						</h3>
						<div className="grid gap-4">
							{PAPER_SECTIONS.map((section, index) => (
								<div
									key={section.id}
									className={`section-card cursor-pointer transition-all ${
										currentSection === index ? "active" : ""
									}`}
									onClick={() => setCurrentSection(index)}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
												{index + 1}
											</span>
											<div>
												<h4 className="font-semibold text-academic-navy">
													{section.title}
												</h4>
												<p className="text-sm text-academic-slate">
													{section.description}
												</p>
											</div>
										</div>
										<ChevronRight
											className={`w-5 h-5 text-gray-400 transition-transform ${
												currentSection === index ? "rotate-90" : ""
											}`}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
