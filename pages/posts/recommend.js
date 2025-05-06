import { useState, useMemo } from "react";
import Layout from "../../components/layout";
import Bookshelf from "../../components/Bookshelf";
import * as dotenv from "dotenv";
import { motion } from "motion/react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";
import styles from "../../styles/bookshelf.module.css";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

const BookRecommendation = z.object({
  title: z.string(),
  author: z.string(),
  link: z.string(),
});

const recommendations = z.object({
  books: z.array(BookRecommendation),
});

// Generate random pastel colors for each book
const generateBookColors = (books) => {
  return books.reduce((acc, book) => {
    if (!acc[book]) {
      const r = Math.floor(Math.random() * 95 + 170); // Lighter pastel range
      const g = Math.floor(Math.random() * 95 + 170); // Lighter pastel range
      const b = Math.floor(Math.random() * 95 + 170); // Lighter pastel range
      acc[book] = `rgb(${r}, ${g}, ${b})`;
    }
    return acc;
  }, {});
};

async function fetchResponse(input) {
  const response = await client.responses.parse({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content:
          "You are a helfpul assistant tasked with giving 3 book recommendations based on the books the user gives. Make sure the book recommendations include the title, author, and the link to the Goodreads page. ",
      },
      { role: "user", content: input },
    ],
    text: {
      format: zodTextFormat(recommendations, "book_recommendations"),
    },
  });

  if (response.error != null) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response;
}

export default function Recommendation() {
  const [aiResponse, setAiResponse] = useState("");
  const [books, setBooks] = useState([
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
  ]);

  const [selectedBooks, setSelectedBooks] = useState([]);
  const bookColors = useMemo(() => generateBookColors(books), [books]);
  const [open, toggle] = useState(false);
  const [ref, { width }] = useMeasure();
  const props = useSpring({ width: open ? width : 0 });

  async function getAIResponse() {
    try {
      const response = await fetchResponse(
        `Recommend me a book similar to the following books: ${selectedBooks.join(
          ", "
        )}. `
      );
      console.log(response.output_parsed);
      //setAiResponse(response.output[0].content[0].text);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiResponse("Failed to load AI response.");
    }
  }

  function removeBook(bookToRemove) {
    setBooks(books.filter((book) => book !== bookToRemove));
    setSelectedBooks(selectedBooks.filter((book) => book !== bookToRemove));
  }

  const handleBookClick = (book) => {
    if (selectedBooks.includes(book)) {
      setSelectedBooks(
        selectedBooks.filter((selectedBook) => selectedBook !== book)
      );
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

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
        {books.map((book) => {
          const pastelColor = bookColors[book];
          const isSelected = selectedBooks.includes(book);

          return (
            <motion.div
              key={book}
              whileHover={{ scale: 1.15 }}
              onClick={() => handleBookClick(book)}
              style={{
                position: "relative", // For positioning the badge
                border: `2px solid black`,
                backgroundColor: isSelected ? "black" : pastelColor,
                color: isSelected ? "white" : "#333",
                margin: "2px",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {book}
              <motion.span
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent click
                  removeBook(book);
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "#eb0000",
                  color: "white",
                  borderRadius: "8px",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                X
              </motion.span>
            </motion.div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
        }}
      >
        <button
          ref={ref}
          onClick={() => {
            getAIResponse();
            toggle(!open);
          }}
          style={{
            border: "2px solid black", // Pastel pink border
            backgroundColor: "white",
            color: "#333",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            position: "relative",
            overflow: "hidden",
            width: "200px",
            height: "50px",
          }}
        >
          <animated.div className={styles.fill} style={props} />
          <animated.div className={styles.content}>
            Recommend me a book!
          </animated.div>
        </button>
      </div>
      <p>{aiResponse}</p>
    </Layout>
  );
}
