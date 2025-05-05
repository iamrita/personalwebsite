import { useState } from "react";
import Layout from "../../components/layout";
import Bookshelf from "../../components/Bookshelf";
import * as dotenv from "dotenv";
dotenv.config();

async function fetchResponse(input) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // In the Next.js project: Variables accessed in client-side code must be prefixed with NEXT_PUBLIC_ to be exposed to the browser.
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: input,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response.json();
}

export default function Recommendation() {
  const [aiResponse, setAiResponse] = useState("");

  async function getAIResponse(book) {
    try {
      const response = await fetchResponse(
        `Recommend me a book similar to ${book}.`
      );
      setAiResponse(response.output[0].content[0].text);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiResponse("Failed to load AI response.");
    }
  }

  const books = [
    "Pachinko",
    "Homegoing",
    "Maximum City",
    "The Vanishing Half",
    "Martyr!",
    "The Interestings",
    "Good Material",
    "Unaccustomed Earth",
    "Different",
    "The Storied Life of A.J. Fikry",
    "Tomorrow, Tomorrow, and Tomorrow",
    "Between Two Kingdoms",
    "The Great Believers",
  ];

  return (
    <Layout>
      <p>
        I often times find it difficult to find what book to read next. Luckily,
        AI has been the greatest help in helping me choose my next read,
        depending on what books I've liked in the past. Play around by clicking
        on the books below to see what book you should read next!
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Allow wrapping to the next line
          gap: "10px",
          marginBottom: "20px",
          justifyContent: "center", // Center the pills
        }}
      >
        {books.map((book) => (
          <button
            key={book}
            style={{
              border: "2px solid black", // Pastel pink border
              backgroundColor: "white",
              color: "#333",
              padding: "10px 15px",
              borderRadius: "100px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {book}
          </button>
        ))}
      </div>
      <button
        style={{
          border: "2px solid black", // Pastel pink border
          backgroundColor: "white",
          color: "#333",
          padding: "10px 15px",
          borderRadius: "100px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Recommnd me a book!
      </button>
      <p>
        <strong>AI Response:</strong> {aiResponse}
      </p>
    </Layout>
  );
}
