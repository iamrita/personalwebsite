import { useState, useMemo, useEffect } from "react";
import Layout from "../../components/layout";
import * as dotenv from "dotenv";
import { motion } from "motion/react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";
import styles from "../../styles/bookshelf.module.css";
import headerFont from "../../components/Font";

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
  try {
    const response = await fetch(
      "https://bookrecommend-77xzict4da-uc.a.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ books: input }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return { output_parsed: data };
  } catch (error) {
    console.error("Error:", error);
    if (error.name === "TypeError" && error.message.includes("CORS")) {
      throw new Error(
        "CORS error: Unable to access the API. Please check if the API is properly configured for CORS."
      );
    }
    throw error;
  }
}

export default function Recommendation() {
  const [generatedRecs, setGeneratedRecs] = useState([]);
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
  const [bookColors] = useState(() => generateBookColors(books)); // Generate once and persist
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [ref, { width }] = useMeasure();

  const getButtonBackgroundBlocks = () => {
    const colors = selectedBooks.map((book) => bookColors[book]); // Use consistent colors from `bookColors`
    const blockWidth = 100 / colors.length; // Divide button width equally
    return colors.map((color, index) => ({
      backgroundColor: color,
      width: `${blockWidth}%`,
      left: `${index * blockWidth}%`,
    }));
  };

  const getAnimatedGradient = () => {
    const colors = selectedBooks.map((book) => bookColors[book]);
    return `linear-gradient(270deg, ${colors.join(", ")})`;
  };

  async function getAIResponse() {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetchResponse(selectedBooks);

      // Ensure response contains the expected structure
      if (
        response.output_parsed &&
        Array.isArray(response.output_parsed.books)
      ) {
        console.log(response.output_parsed.books);
        setGeneratedRecs(response.output_parsed.books); // Set the books array
      } else {
        console.error("Unexpected response format:", response);
        setGeneratedRecs([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setGeneratedRecs([]); // Fallback to an empty array in case of error
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  const handleRecommendationClick = (link) => {
    window.open(link, "_blank");
  };

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
      <h1 className={headerFont.className}>Book Recommender</h1>
      <p>
        There's so many great books out there that finding out what to read next
        can be hard, and I've found that Goodreads isn't great in using my past
        books to inform what I would like. I created the interaction below to
        help me choose my next read, depending on what books I've liked in the
        past. Right now, I've prepopulated it with a list of books that I've
        enjoyed over the past couple years.
        <b>
          {" "}
          Play around by clicking on the books below to see what book you should
          read next!
        </b>
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
          const pastelColor = bookColors[book]; // Ensure consistent color mapping
          const isSelected = selectedBooks.includes(book);
          return (
            <motion.div
              key={book}
              whileHover={{ scale: 1.15 }}
              onClick={() => {
                handleBookClick(book);
              }}
              style={{
                border: `2px solid black`,
                backgroundColor: isSelected ? "black" : pastelColor,
                color: isSelected ? "white" : "black",
                margin: "2px",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {book}
            </motion.div>
          );
        })}
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ width: "200px" }}
          style={{
            border: `2px solid black`,
            backgroundColor: "white",
            color: "black",
            margin: "2px",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          +
        </motion.div>
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
          style={{
            border: "2px solid black", // Pastel pink border
            background: isLoading
              ? getAnimatedGradient() // Animated gradient while loading
              : "white", // Default background
            backgroundSize: isLoading ? "400% 400%" : "auto", // Animate gradient
            animation: isLoading
              ? "gradientAnimation 3s ease infinite" // Gradient animation
              : "none",
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
          onClick={() => getAIResponse()}
        >
          {!isLoading &&
            getButtonBackgroundBlocks().map((block, index) => (
              <animated.div
                key={index}
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  ...block, // Apply block-specific styles
                  zIndex: 1,
                }}
              />
            ))}
          <animated.div
            className={styles.content}
            style={{
              position: "relative",
              zIndex: 2,
              color: "#333",
              textAlign: "center",
            }}
          >
            <b>{isLoading ? "Finding..." : "Recommend me a book!"}</b>
          </animated.div>
        </button>
      </div>
      {generatedRecs.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            padding: "20px",
          }}
        >
          {generatedRecs.map((book) => (
            <motion.div
              key={book.title}
              whileHover={{ scale: 1.15 }}
              onClick={() => handleRecommendationClick(book.link)}
              style={{
                position: "relative",
                border: `2px solid black`,
                backgroundColor: "white",
                color: "black",
                padding: "10px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                width: "200px",
                textAlign: "center",
              }}
            >
              {book.title}
              {/*book.description*/}
            </motion.div>
          ))}
        </div>
      )}
      <style jsx>{`
        p {
          border: 1px solid black;
          border-radius: 8px;
          background-color: #fff2de;
          padding: 32px;
          margin-bottom: 50px;
        }
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Layout>
  );
}
