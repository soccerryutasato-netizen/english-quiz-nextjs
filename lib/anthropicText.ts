type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function generateText({
  system,
  messages,
  maxTokens,
}: {
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Anthropic text generation failed", response.status, detail);
    throw new Error(`Anthropic request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.filter((part: { type?: string }) => part.type === "text")
    .map((part: { text?: string }) => part.text || "").join("\n").trim();
  if (!text) throw new Error("Anthropic returned an empty response");
  return text;
}
