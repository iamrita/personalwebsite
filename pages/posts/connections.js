import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isEqual, shuffle } from 'lodash';
import Dialog from '@mui/material/Dialog';
import ReactDOMServer from 'react-dom/server';
import "../../components/firebase"


/**
 * Issues to Fix:
 * 1. there's an issue where if have one mistake left, it bugs out if you also guess correctly 
 * 2. Getting words from text file. 
 * 4. make it look better on mobile brwoser 
 * 5. copying emojis to clipboard
 * 6. check if a guess has already been made 
 * 
 * 
 * Future improvements
 * 1. Tracking what peopple guess 
 * 2. Having an archive on the page of previous days 
 * 3. be able to share data 
 * 4. being able to go to previous days by url routing 
 */

const words = [
    'narnia', 'oz', 'strange', 'unusual',
    'what', 'odd', 'atlantis', 'phil',
    'neverland', 'who', 'bizarre', 'why',
    'where', 'peculiar', 'rivendell', 'which'
];

const easyArray = ['which', 'what', 'why', 'where']
const mediumArray = ['odd', 'peculiar', 'bizarre', 'unusual']
const hardArray = ['narnia', 'neverland', 'atlantis', 'rivendell']
const difficultArray = ['oz', 'strange', 'phil', 'who']


function containSameElements(arr1, arr2) {
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    return isEqual(set1, set2)
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

    const [submissionAnimation, setSubmissionAnimation] = useState(false);
    const [mistakeAnimation, setMistakeAnimation] = useState(false);

    const [selectedWords, setSelectedWords] = useState([])
    const [isGameOver, setIsGameOver] = useState(false)
    const [colors, setColors] = useState(
        []
    )
    const [oneAway, setOneAway] = useState(false)
    const [alreadyGuessed, setAlreadyGuessed] = useState(false)


    function isOneAway(selectedGuess, category) {
        let counter = 0
        for (let i = 0; i < 4; i++) {
            if (category.includes(selectedGuess[i])) {
                counter = counter + 1
            }
        }
        return counter

    }

    function clearBoard() {
        setSubmissionAnimation(false);
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
        setUnsubmittedSquares(shuffle(unSubmittedSquares))
    };

    const copyToClipboard = (content) => {
        const contentString = ReactDOMServer.renderToString(content);

        const textarea = document.createElement('textarea');

        // Set the value of the textarea to the content of the div
        textarea.value = contentString

        // Append the textarea to the document
        document.body.appendChild(textarea);

        // Select the content of the textarea
        textarea.select();

        // Execute the copy command
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(textarea);

        // Show a success message or perform any other action as needed
        alert('Copied to clipboard!');

    }


    const handleSubmit = () => {
        setGuesses(prevGuesses => [...prevGuesses, selectedWords]);
        console.log(selectedWords)
        let temp = []
        temp.push(isOneAway(selectedWords, easyArray))
        temp.push(isOneAway(selectedWords, mediumArray))
        temp.push(isOneAway(selectedWords, hardArray))
        temp.push(isOneAway(selectedWords, difficultArray))
        if (temp.includes(3)) {
            setOneAway(true)
        } else {
            setOneAway(false)
        }
        if (containSameElements(selectedWords, easyArray)) {
            console.log("You got easy!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                const easy = {
                    style: utilStyles.backgroundEasy,
                    categoryName: '"W" Questions',
                    categoryValues: easyArray
                }
                setColors(prevColors => [...prevColors, easy]);
                clearBoard()
            }, 2000);

        } else if (containSameElements(selectedWords, mediumArray)) {
            console.log("You got medium!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                const medium = {
                    style: utilStyles.backgroundMedium,
                    categoryName: 'Synonyms for atypical',
                    categoryValues: mediumArray
                }
                setColors(prevColors => [...prevColors, medium]);
                clearBoard()
            }, 2000);

        } else if (containSameElements(selectedWords, hardArray)) {
            console.log("You got hard!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                const hard = {
                    style: utilStyles.backgroundHard,
                    categoryName: 'Fictional Places',
                    categoryValues: hardArray
                }
                setColors(prevColors => [...prevColors, hard]);
                clearBoard()
            }, 2000);

        } else if (containSameElements(selectedWords, difficultArray)) {
            console.log("You got difficult!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                const difficult = {
                    style: utilStyles.backgroundDifficult,
                    categoryName: 'Dr. _____',
                    categoryValues: difficultArray
                }
                setColors(prevColors => [...prevColors, difficult]);
                clearBoard()
            }, 2000);

        } else {
            console.log("in here")
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
        if (easyArray.includes(word)) {
            return "easy"
        } else if (mediumArray.includes(word)) {
            return "medium"
        } else if (hardArray.includes(word)) {
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


    const circles = Array.from({ length: mistakes }, (_, index) => (
        <div key={index} className={utilStyles.circle}></div>
    ));

    const checkForGameOver = () => {
        if (mistakes === 1) { // not understanding how this works for mistakes 
            console.log('game is over cuz of mistakes')
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setUnsubmittedSquares([])
                setColors([
                    {
                        style: utilStyles.backgroundEasy,
                        categoryName: '"W" Questions',
                        categoryValues: easyArray
                    },
                    {
                        style: utilStyles.backgroundMedium,
                        categoryName: 'Synonyms for atypical',
                        categoryValues: mediumArray
                    },
                    {
                        style: utilStyles.backgroundHard,
                        categoryName: 'Fictional Places',
                        categoryValues: hardArray
                    },
                    {
                        style: utilStyles.backgroundDifficult,
                        categoryName: 'Dr. _____',
                        categoryValues: difficultArray
                    }
                ])
                setIsGameOver(true)
            }, 2000);
        } else {
            if (unSubmittedSquares.length == 4) {
                console.log('game is over cuz no more squares')
                setSubmissionAnimation(true);
                setTimeout(() => {
                    setSubmissionAnimation(false);
                    setUnsubmittedSquares([])
                    setIsGameOver(true)
                }, 2000)
            }
        }
    }


    return (
        <Layout>
            <Head>
                <title>Connections</title>
            </Head>
            <article>
                {oneAway && <div className={utilStyles.content}>You're one away!</div>}
                {alreadyGuessed && <div className={utilStyles.content}>You already guessed it!</div>}
                {colors.map((color, colorIndex) => (
                    <div className={`${utilStyles.square} ${color.style}`}>
                        <div style={{}}>{color.categoryName}</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(color.categoryValues)}</div>
                    </div>
                ))}
                <div className={utilStyles.grid}>
                    {squares}
                </div>
                <div className={utilStyles.circleContainer}>
                    {circles}
                </div>
                <div className={utilStyles.buttons}>
                    <button className={utilStyles.square} disabled={!(selectedWords.length === 4)}
                        onClick={() => {
                            handleSubmit()
                            checkForGameOver()
                        }
                        }
                    >Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
                {/* {(mistakes === 0) && 
                    <div className={utilStyles.content}>{renderGrid(guesses)}</div>
                }  -- this is counting mistakes properly */}
                {isGameOver &&
                    <div className={utilStyles.content}>{renderGrid(guesses)}</div>
                }
            </article>
        </Layout>
    );
}
