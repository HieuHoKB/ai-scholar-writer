(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__fd36789e._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
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
;
// Initialize OpenRouter client
const openrouter = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseURL: "https://openrouter.ai/api/v1"
});
const runtime = "edge";
async function POST(req) {
    try {
        const { prompt, section, context, model } = await req.json();
        // Debug log (remove in production)
        console.log("Generation request:", {
            model,
            section
        });
        // Build system message for academic writing
        const systemMessage = `You are an academic writing assistant helping users write research papers.
    You write in formal academic English following APA 7th edition style.
    ${context ? `Context from previous sections: ${context}` : ""}
    
    Write high-quality academic content for the ${section} section.
    Focus on clarity, precision, and scholarly tone.
    Use appropriate academic vocabulary and sentence structures.`;
        // Call OpenRouter API with streaming
        const completion = await openrouter.chat.completions.create({
            model: model || "openai/gpt-oss-120b:free",
            messages: [
                {
                    role: "system",
                    content: systemMessage
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            stream: true
        });
        // Create a ReadableStream from the OpenRouter response
        const readableStream = new ReadableStream({
            async start (controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion){
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
            }
        });
        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked"
            }
        });
    } catch (error) {
        console.error("AI Generation error:", error);
        // Return more detailed error information
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

//# sourceMappingURL=%5Broot-of-the-server%5D__fd36789e._.js.map