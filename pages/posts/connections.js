import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isEqual from 'lodash/isEqual';


/**
 * Issues to Fix:
 * 1. When the user is finished, the rectangles auto order in easiest to hardest. Should
 *   keep the order that the user solved it in. 
 * 2. Getting words from text file. 
 * 3. 1 away, and letting you know if you guessed already. 
 * 4. make it look better on mobile brwoser 
 * 5. if you solve it out of order, the rectangles still show up in the order you solved it 
 * 6. shuffling works 
 * 
 * 
 * Future improvements
 * 1. Tracking what peopple guess 
 * 2. Having an archive on the page of previous days 
 * 3. be able to share data 
 * 4. being able to go to previous days by url routing 
 * 5. if you sign up with a phone number, you'll get a text to the day's connections 
 */

const words = [
    'biden', 'trump', 'face', 'defeat',
    'montana', 'idaho', 'beat', 'credit',
    'rogan', 'washington', 'jonas', 'best',
    'tarot', 'north dakota', 'conquer', 'minnesota'
];

const easy = ['best', 'beat', 'conquer', 'defeat']
const medium = ['montana', 'rogan', 'biden', 'jonas']
const hard = ['idaho', 'washington', 'north dakota', 'minnesota']
const difficult = ['tarot', 'trump', 'credit', 'face']




function containSameElements(arr1, arr2) {
    const sortedFirstAray = [...arr1].sort()
    const sortedSecondArray = [...arr2].sort()
    return isEqual(sortedFirstAray, sortedSecondArray)
}

function formatTextFile(dataString) {
    // Split the string into lines
    const lines = dataString.split('\n');
    // Extract words from the first line
    const wordsLine = lines[0].trim();
    // Split the words line by colon and get the words part
    const wordsArray = wordsLine.split(': ')[1].split(',');
    // Trim each word and remove any empty strings
    const words = wordsArray.map(word => word.trim()).filter(word => word !== '');
    return words;
}

export default function Connections() {

    const GrayToast = ({ message }) => {
        return (
            <ToastContainer />
        );
    };

    function toDisplay(arr) {
        let x = ""
        for (let i = 0; i < arr.length; i++) {
            x += arr[i] + ", "

        }
        const strippedStr = x.slice(0, -2);
        return strippedStr
    }

    const [data, setData] = useState([])
    const [guesses, setGuesses] = useState([[]])
    const [clickedSquares, setClickedSquares] = useState(Array(16).fill(false));

    const [unSubmittedSquares, setUnsubmittedSquares] = useState(words)

    const [mistakes, setMistakes] = useState(4);
    const [showEasyRectangle, setShowEasyRectangle] = useState(false);
    const [showMediumRectangle, setShowMediumRectangle] = useState(false);
    const [showHardRectangle, setShowHardRectangle] = useState(false);

    const [showDifficultRectangle, setShowDifficultRectangle] = useState(false);

    const [submissionAnimation, setSubmissionAnimation] = useState(false);
    const [mistakeAnimation, setMistakeAnimation] = useState(false);

    const [selectedWords, setSelectedWords] = useState([])
    const [isGameOver, setIsGameOver] = useState(false)

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await fetch('/api/data');
    //         const { data } = await response.json();
    //         console.log(data)
    //         setData(formatTextFile(data));
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     };

    //     fetchData();
    //   }, []);



    function clearBoard(showRectangle) {
        setSubmissionAnimation(false);
        showRectangle(true);
        const remainingWords = unSubmittedSquares.filter(word => !selectedWords.includes(word))
        setUnsubmittedSquares(remainingWords)
        setClickedSquares(Array(16).fill(false))
        setSelectedWords([])
    }
    // TIL logging and state change don't always happen in the sequence you think 
    const handleClick = (index, word) => {
        if (selectedWords.length <= 3 || clickedSquares[index]) {
            const newClickedSquares = [...clickedSquares];
            let newSelectedWords = [...selectedWords]
            newClickedSquares[index] = !newClickedSquares[index];
            if (newClickedSquares[index]) {
                newSelectedWords = [...selectedWords, word]; // Add the clicked word to the selected words array and remove duplicates

            } else {
                newSelectedWords = newSelectedWords.filter(w => w !== word)
            }
            setClickedSquares(newClickedSquares)
            setSelectedWords(newSelectedWords);
        }
    };

    const handleShuffle = (index) => {
        console.log("shuffle");
    };

    const checkForGameOver = (mistakes) => {
        if (mistakes == 1 || unSubmittedSquares.length == 4) { // end of the game (buggy logic)
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowEasyRectangle(true);
                setShowMediumRectangle(true);
                setShowDifficultRectangle(true);
                setShowHardRectangle(true);
                setUnsubmittedSquares([])
            }, 2000);
            setIsGameOver(true)
        }
    }
    const handleSubmit = () => {
        setGuesses(prevGuesses => [...prevGuesses, selectedWords]);
        console.log(selectedWords)
        if (containSameElements(selectedWords, easy)) {
            console.log("You got easy!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                clearBoard(setShowEasyRectangle)
            }, 2000);

        } else if (containSameElements(selectedWords, medium)) {
            console.log("You got medium!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                clearBoard(setShowMediumRectangle)
            }, 2000);

        } else if (containSameElements(selectedWords, hard)) {
            console.log("You got hard!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                clearBoard(setShowHardRectangle)
            }, 2000);

        } else if (containSameElements(selectedWords, difficult)) {
            console.log("You got difficult!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                clearBoard(setShowDifficultRectangle)
            }, 2000);

        } else {
            setMistakes(prevMistakes => prevMistakes - 1);
            setMistakeAnimation(true)
            setTimeout(() => {
                setMistakeAnimation(false);
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 1000);
        }

    };

    const squares = unSubmittedSquares.map((word, index) => {
        const isAtTop = index < 4; // Assuming each row has 4 squares

        return (
            <div
                key={index}
                className={`
                ${utilStyles.square} ${clickedSquares[index] ? utilStyles.clicked : ''} 
                ${clickedSquares[index] && submissionAnimation && !isAtTop ? utilStyles.submissionAnimation : ''} 
                ${clickedSquares[index] && mistakeAnimation ? utilStyles.mistakeAnimation : ''}`}
                onClick={() => {
                    handleClick(index, word)
                }
                }
            >
                {word}
            </div>
        );
    });

    function category(word) {
        if (easy.includes(word)) {
            return "easy"
        } else if (medium.includes(word)) {
            return "medium"
        } else if (hard.includes(word)) {
            return "hard"
        } else {
            return "difficult"
        }
    }
    function renderSquare(value) {
        let color = ''
        if (category(value) === "easy") {
            color = '🟨'
        } else if (category(value) === "medium") {
            color = '🟩'
        } else if (category(value) === "hard") {
            color = '🟦'
        } else {
            color = '🟪'
        }
        return (
            <span key={Math.random()} role="img" aria-label={category(value)}>
                {color}
            </span>
        );
    }

    function renderGrid(grid) {
        return (
            <div>
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex}>
                        {row.map((cell, cellIndex) => renderSquare(cell))}
                    </div>
                ))}
            </div>
        );
    }



    /**
     * Below is the same as :
     * function generateCircles(mistakes) {
            const circles = [];
            for (let index = 0; index < mistakes; index++) {
                 circles.push(<div key={index} className={utilStyles.circle}></div>);
            }
            return circles;
        }

        // Usage:
        const circles = generateCircles(mistakes);

     */

    const circles = Array.from({ length: mistakes }, (_, index) => (
        <div key={index} className={utilStyles.circle}></div>
    ));

    function showRectangle(rectangleStyle) {
        return <div className={`${utilStyles.square} ${rectangleStyle}`}></div>
    }

    return (
        <Layout>
            <Head>
                <title>Connections</title>
            </Head>
            <article>
                {/* {showEasyRectangle ? showRectangle(utilStyles.backgroundEasy) : showMediumRectangle ? showRectangle(utilStyles.backgroundMedium)
                    : showHardRectangle ? showRectangle(utilStyles.backgroundHard) : showDifficultRectangle ? showRectangle(utilStyles.backgroundDifficult)
                        : <div></div>} */}

                {showEasyRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundEasy}`}>
                        <div style={{}}>Synonyms for win</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(easy)}</div>
                    </div>
                )}
                {showMediumRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundMedium}`}>
                        <div style={{}}>Famous Joes</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(medium)}</div>
                    </div>
                )}
                {showHardRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundHard}`}>
                        <div style={{}}>States bordering Canada</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(hard)}</div>
                    </div>
                )}
                {showDifficultRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundDifficult}`}>
                        <div style={{}}>____     card</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(difficult)}</div>
                    </div>
                )}
                <div className={utilStyles.grid}>
                    {squares}
                </div>
                <div className={utilStyles.circleContainer}>
                    {circles}
                </div>
                <div className={utilStyles.buttons}>
                    <button className={utilStyles.square} onClick={() => {
                        handleSubmit()
                        checkForGameOver(mistakes)
                    }
                    }
                    >Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
                {isGameOver && <div>{renderGrid(guesses)}</div>}
            </article>
        </Layout>
    );
}
