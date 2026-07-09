async function main() {
  console.log("Testing DeepSeek API...");
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer sk-f615461ea4c54d37ba9f0bbbcac6ac1b",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Reply with just the word: OK" },
          { role: "user", content: "Say OK" },
        ],
        temperature: 0,
        max_tokens: 10,
      }),
    });

    const status = res.status;
    const data = await res.json();
    console.log("Status:", status);
    if (res.ok) {
      console.log("SUCCESS:", data.choices[0].message.content);
    } else {
      console.log("ERROR:", JSON.stringify(data, null, 2));
    }
  } catch (e: any) {
    console.log("FETCH ERROR:", e.message);
  }
}

main();
