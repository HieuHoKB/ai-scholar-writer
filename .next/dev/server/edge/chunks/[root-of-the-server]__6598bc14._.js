(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__6598bc14._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Documents/hhkb/ai-scholar-writer/src/app/api/suggestions/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
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
const openrouter = new __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$hhkb$2f$ai$2d$scholar$2d$writer$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseURL: "https://openrouter.ai/api/v1"
});
const runtime = "edge";
async function POST(req) {
    try {
        const { content, section, type } = await req.json();
        let systemMessage = "";
        let userPrompt = "";
        switch(type){
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
            model: "anthropic/claude-3-haiku",
            messages: [
                {
                    role: "system",
                    content: systemMessage
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: 0.5,
            max_tokens: 1500,
            stream: true
        });
        // Create a ReadableStream from the OpenRouter response
        const readableStream = new ReadableStream({
            async start (controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion){
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
            }
        });
        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked"
            }
        });
    } catch (error) {
        console.error("Suggestion error:", error);
        return new Response(JSON.stringify({
            error: "Failed to generate suggestions"
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

//# sourceMappingURL=%5Broot-of-the-server%5D__6598bc14._.js.map