const body = {
  model: "ai/smollm2",
  messages: [
    { role: "system", content: "You are a helpful assistant" },
    {
      role: "user",
      content: "What are the noble gases on the periodic table of elements?",
    },
  ],
};

const req = await fetch(
  "http://localhost:12434/engines/llama.cpp/v1/chat/completions",
  { headers: { "Content-Type": "application/json" }, method: "POST", body: body },
);

const data = await req.json();

console.log(data);
