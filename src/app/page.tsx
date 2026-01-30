"use client";

import {
	BookOpen,
	ChevronRight,
	Expand,
	FileText,
	Link,
	Loader2,
	RefreshCw,
	Search,
	Sparkles,
	Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

interface SectionContent {
	content: string;
	citations: string[];
	isGenerating?: boolean;
}

export default function Home() {
	const [currentSection, setCurrentSection] = useState(0);
	const [theoryInput, setTheoryInput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [paperData, setPaperData] = useState<{
		title: string;
		abstract: string;
		sections: Record<string, SectionContent>;
	}>({
		title: "",
		abstract: "",
		sections: {},
	});
	const [generatedContent, setGeneratedContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const [selectedModel, setSelectedModel] = useState(
		"anthropic/claude-3-haiku",
	);
	const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

	const streamRef = useRef<ReadableStreamDefaultReader | null>(null);

	const handleStartWriting = () => {
		if (!theoryInput.trim()) return;
		setIsGenerating(true);

		// Simulate AI processing
		setTimeout(() => {
			setPaperData((prev) => ({
				...prev,
				title: theoryInput.substring(0, 100),
				sections: {
					title: { content: "", citations: [] },
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

	const generateSectionContent = async (sectionId: string) => {
		const section = PAPER_SECTIONS[currentSection];
		setIsStreaming(true);
		setGeneratedContent("");
		setActiveSuggestion("generate");

		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: `Write the ${section.title} section for a research paper about: ${theoryInput}`,
					section: section.title,
					context: paperData.title,
					model: selectedModel,
				}),
			});

			if (!response.ok) throw new Error("Generation failed");

			// Handle streaming response
			const reader = response.body?.getReader();
			if (!reader) throw new Error("No response body");

			streamRef.current = reader;
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				setGeneratedContent((prev) => prev + chunk);
			}
		} catch (error) {
			console.error("Generation error:", error);
			setGeneratedContent("Error generating content. Please try again.");
		} finally {
			setIsStreaming(false);
			setActiveSuggestion(null);
		}
	};

	const applyGeneratedContent = () => {
		const sectionId = PAPER_SECTIONS[currentSection].id;
		setPaperData((prev) => ({
			...prev,
			sections: {
				...prev.sections,
				[sectionId]: {
					...prev.sections[sectionId],
					content: generatedContent,
				},
			},
		}));
		setGeneratedContent("");
	};

	const handleSuggestion = async (type: "improve" | "expand" | "citation") => {
		const sectionId = PAPER_SECTIONS[currentSection].id;
		const currentContent = paperData.sections[sectionId]?.content;

		if (!currentContent && type !== "citation") return;

		setIsStreaming(true);
		setGeneratedContent("");
		setActiveSuggestion(type);

		try {
			const response = await fetch("/api/suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content: currentContent,
					section: PAPER_SECTIONS[currentSection].title,
					type,
				}),
			});

			if (!response.ok) throw new Error("Suggestion failed");

			const reader = response.body?.getReader();
			if (!reader) throw new Error("No response body");

			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				setGeneratedContent((prev) => prev + chunk);
			}
		} catch (error) {
			console.error("Suggestion error:", error);
			setGeneratedContent("Error generating suggestion. Please try again.");
		} finally {
			setIsStreaming(false);
			setActiveSuggestion(null);
		}
	};

	const currentSectionData = PAPER_SECTIONS[currentSection];
	const sectionId = currentSectionData.id;
	const currentContent = paperData.sections[sectionId]?.content || "";

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
						<select
							value={selectedModel}
							onChange={(e) => setSelectedModel(e.target.value)}
							className="text-sm border border-gray-300 rounded px-2 py-1"
						>
							<option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
							<option value="anthropic/claude-3-sonnet">Claude 3 Sonnet</option>
							<option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
							<option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
						</select>
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
						APA formatting, citation management, and AI-powered content
						generation via OpenRouter.
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
									<Loader2 className="w-5 h-5 animate-spin" />
									<span>Generating Structure...</span>
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

				{/* Paper Structure & Editor */}
				{paperData.sections && Object.keys(paperData.sections).length > 0 && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Section Navigation */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
								<h3 className="text-lg font-semibold text-academic-navy mb-4 flex items-center">
									<FileText className="w-5 h-5 mr-2" />
									Paper Sections
								</h3>
								<div className="space-y-2">
									{PAPER_SECTIONS.map((section, index) => (
										<div
											key={section.id}
											className={`p-3 rounded-lg cursor-pointer transition-all ${
												currentSection === index
													? "bg-primary-100 border border-primary-300"
													: "hover:bg-gray-50 border border-transparent"
											}`}
											onClick={() => setCurrentSection(index)}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<span className="w-6 h-6 bg-primary-200 text-primary-800 rounded-full flex items-center justify-center text-xs font-semibold">
														{index + 1}
													</span>
													<span className="font-medium text-academic-navy">
														{section.title}
													</span>
												</div>
												{paperData.sections[section.id]?.content && (
													<span className="w-2 h-2 bg-green-500 rounded-full" />
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Section Editor */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-xl font-semibold text-academic-navy">
										{currentSectionData.title}
									</h3>
									<div className="flex items-center space-x-2">
										<span className="text-sm text-academic-slate">
											{currentContent.length} chars
										</span>
									</div>
								</div>

								<p className="text-sm text-academic-slate mb-4">
									{currentSectionData.description}
								</p>

								{/* AI Generation Controls */}
								<div className="flex flex-wrap gap-2 mb-4">
									<button
										onClick={() => generateSectionContent(sectionId)}
										disabled={isStreaming || !theoryInput}
										className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
									>
										<Wand2 className="w-4 h-4" />
										<span>Generate</span>
									</button>
									<button
										onClick={() => handleSuggestion("improve")}
										disabled={isStreaming || !currentContent}
										className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
									>
										<RefreshCw className="w-4 h-4" />
										<span>Improve</span>
									</button>
									<button
										onClick={() => handleSuggestion("expand")}
										disabled={isStreaming || !currentContent}
										className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
									>
										<Expand className="w-4 h-4" />
										<span>Expand</span>
									</button>
									<button
										onClick={() => handleSuggestion("citation")}
										disabled={isStreaming}
										className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
									>
										<BookOpen className="w-4 h-4" />
										<span>Add Citations</span>
									</button>
								</div>

								{/* Generated Content Preview */}
								{generatedContent && (
									<div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium text-purple-800">
												{activeSuggestion === "generate" && "Generated Content"}
												{activeSuggestion === "improve" && "Improved Version"}
												{activeSuggestion === "expand" && "Expanded Content"}
												{activeSuggestion === "citation" &&
													"Suggested Citations"}
											</span>
											<button
												onClick={applyGeneratedContent}
												className="text-sm text-purple-700 hover:text-purple-900 font-medium"
											>
												Apply Changes
											</button>
										</div>
										<div className="academic-text text-sm max-h-60 overflow-y-auto">
											{generatedContent}
										</div>
									</div>
								)}

								{/* Streaming Indicator */}
								{isStreaming && (
									<div className="flex items-center space-x-2 text-sm text-purple-600 mb-4">
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>AI is generating content...</span>
									</div>
								)}

								{/* Content Editor */}
								<textarea
									value={currentContent}
									onChange={(e) =>
										setPaperData((prev) => ({
											...prev,
											sections: {
												...prev.sections,
												[sectionId]: {
													...prev.sections[sectionId],
													content: e.target.value,
												},
											},
										}))
									}
									placeholder={`Write your ${currentSectionData.title.toLowerCase()} here...`}
									className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none academic-text"
								/>

								{/* Writing Tips */}
								<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<h4 className="font-medium text-blue-800 mb-2">
										Writing Tips
									</h4>
									<ul className="text-sm text-blue-700 space-y-1">
										{currentSection === 0 && (
											<>
												<li>• Keep title concise (15-20 words)</li>
												<li>• Include key variables or concepts</li>
												<li>• Avoid unnecessary words like "A Study of"</li>
											</>
										)}
										{currentSection === 1 && (
											<>
												<li>• Start broad, narrow to specific problem</li>
												<li>• Present research gap or significance</li>
												<li>• State research questions or objectives</li>
											</>
										)}
										{currentSection === 2 && (
											<>
												<li>• Organize by themes, not chronologically</li>
												<li>• Synthesize, don't just summarize</li>
												<li>• Identify gaps your study addresses</li>
											</>
										)}
										{currentSection === 3 && (
											<>
												<li>• Be detailed enough for replication</li>
												<li>• Describe sampling procedure</li>
												<li>• Explain data analysis approach</li>
											</>
										)}
										{currentSection === 4 && (
											<>
												<li>• Report findings objectively</li>
												<li>• Use appropriate statistical notation</li>
												<li>• Include effect sizes and confidence intervals</li>
											</>
										)}
										{currentSection === 5 && (
											<>
												<li>• Interpret results in context of literature</li>
												<li>• Acknowledge limitations honestly</li>
												<li>
													• Discuss theoretical and practical implications
												</li>
											</>
										)}
									</ul>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
