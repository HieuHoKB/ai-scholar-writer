(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f4891305._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Documents/hhkb/ai-scholar-writer/src/lib/brave-search.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BraveSearchService",
    ()=>BraveSearchService,
    "braveSearch",
    ()=>braveSearch,
    "createAPACitation",
    ()=>createAPACitation,
    "generateCitationKey",
    ()=>generateCitationKey
]);
// Brave Search API integration for finding academic sources and citations
const BRAVE_API_BASE = "https://api.search.brave.com/res/v1";
class BraveSearchService {
    apiKey;
    constructor(apiKey){
        this.apiKey = apiKey || process.env.BRAVE_SEARCH_API_KEY || "";
    }
    async searchAcademicLiterature(query, count = 5) {
        if (!this.apiKey) {
            console.warn("Brave Search API key not configured");
            return [];
        }
        try {
            const response = await fetch(`${BRAVE_API_BASE}/search?q=${encodeURIComponent(query)}&count=${count}&engines=google,bing`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Subscription-Token": this.apiKey
                }
            });
            if (!response.ok) {
                console.error(`Brave Search API error: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return (data.web?.results || []).map((result)=>({
                    title: result.title,
                    url: result.url,
                    snippet: result.description,
                    publishedDate: result.published_at,
                    author: result.author
                }));
        } catch (error) {
            console.error("Brave Search error:", error);
            return [];
        }
    }
    async searchForSection(section, topic) {
        const queries = this.buildSearchQueries(section, topic);
        const results = [];
        for (const query of queries){
            const searchResults = await this.searchAcademicLiterature(query, 3);
            results.push(...searchResults);
        }
        // Remove duplicates
        const uniqueResults = results.filter((result, index, self)=>index === self.findIndex((r)=>r.url === result.url));
        return uniqueResults.slice(0, 10);
    }
    buildSearchQueries(section, topic) {
        const baseQueries = {
            introduction: [
                `${topic} research introduction background`,
                `${topic} research problem significance`,
                `${topic} research gap literature review`
            ],
            literature: [
                `${topic} theoretical framework`,
                `${topic} prior research studies`,
                `${topic} literature review academic`
            ],
            methods: [
                `${topic} research methodology`,
                `${topic} data collection analysis`,
                `${topic} research design sampling`
            ],
            results: [
                `${topic} research findings statistics`,
                `${topic} empirical results data`
            ],
            discussion: [
                `${topic} research implications`,
                `${topic} study limitations future research`,
                `${topic} theoretical practical implications`
            ],
            title: [
                `${topic} research paper title academic`
            ],
            references: [
                `${topic} academic sources citations`
            ]
        };
        return baseQueries[section.toLowerCase()] || [
            `${topic} academic research`
        ];
    }
}
function createAPACitation(result) {
    const author = result.author || "Unknown";
    const year = result.publishedDate ? new Date(result.publishedDate).getFullYear() : "n.d.";
    const title = result.title;
    const url = result.url;
    return `${author}. (${year}). ${title}. ${url}`;
}
function generateCitationKey(result) {
    const firstAuthor = result.author?.split(" ")[0] || "Unknown";
    const year = result.publishedDate ? new Date(result.publishedDate).getFullYear() : "nd";
    return `${firstAuthor}${year}`.toLowerCase().replace(/\s+/g, "");
}
const braveSearch = new BraveSearchService();
}),
"[project]/Documents/hhkb/ai-scholar-writer/src/app/api/generate/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/hhkb/ai-scholar-writer/node_modules/openai/index.mjs [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/Documents/hhkb/ai-scholar-writer/node_modules/openai/client.mjs [app-edge-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$src$2f$lib$2f$brave$2d$search$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/hhkb/ai-scholar-writer/src/lib/brave-search.ts [app-edge-route] (ecmascript)");
;
;
// Initialize OpenRouter client
const openrouter = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseURL: "https://openrouter.ai/api/v1"
});
const runtime = "edge";
async function searchForRelevantSources(section, topic) {
    try {
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$src$2f$lib$2f$brave$2d$search$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["braveSearch"].searchForSection(section, topic);
        return results;
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
async function generateWithSources(prompt, systemMessage, sources) {
    // Build enhanced system message with sources
    const sourcesContext = sources.length > 0 ? `\n\nRelevant sources to cite:\n${sources.map((source, index)=>`[${index + 1}] ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$src$2f$lib$2f$brave$2d$search$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createAPACitation"])(source)}`).join("\n")}` : "";
    const enhancedSystemMessage = `${systemMessage}${sourcesContext}

IMPORTANT: When discussing concepts from these sources, include inline citations in APA format like (Author, Year) or (Author1 & Author2, Year).
Include the citation key in brackets like [1], [2] that references the sources list.
Provide a comprehensive response that synthesizes information from these sources.`;
    const completion = await openrouter.chat.completions.create({
        model: "openai/gpt-oss-120b:free",
        messages: [
            {
                role: "system",
                content: enhancedSystemMessage
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
    });
    return completion.choices[0]?.message?.content || "";
}
async function POST(req) {
    try {
        const { prompt, section, context, model } = await req.json();
        console.log("Generation request:", {
            model,
            section
        });
        console.log("OpenRouter API key present:", !!process.env.OPENROUTER_API_KEY);
        console.log("Brave Search API key present:", !!process.env.BRAVE_SEARCH_API_KEY);
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
        const citations = sources.map((source)=>({
                key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$src$2f$lib$2f$brave$2d$search$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["generateCitationKey"])(source),
                formatted: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$src$2f$lib$2f$brave$2d$search$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createAPACitation"])(source),
                url: source.url
            }));
        // Create response
        const responseData = {
            content,
            sources,
            citations
        };
        return new Response(JSON.stringify(responseData), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("AI Generation error:", error);
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(JSON.stringify({
            error: "Failed to generate content",
            details: errorMessage
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f4891305._.js.map