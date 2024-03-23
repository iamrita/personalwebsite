import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import isEqual from 'lodash/isEqual';
import Dialog from '@mui/material/Dialog';



/**
 * Issues to Fix:
 * 1. there's an issue where if have one mistake left, it bugs out if you also guess correctly 
 * 2. Getting words from text file. 
 * 4. make it look better on mobile brwoser 
 * 6. shuffling works 
 * 
 * 
 * Future improvements
 * 1. Tracking what peopple guess 
 * 2. Having an archive on the page of previous days 
 * 3. be able to share data 
 * 4. being able to go to previous days by url routing 
 */

const words = [
    'biden', 'trump', 'face', 'defeat',
    'montana', 'idaho', 'beat', 'credit',
    'rogan', 'washington', 'jonas', 'best',
    'tarot', 'north dakota', 'conquer', 'minnesota'
];

const easyArray = ['best', 'beat', 'conquer', 'defeat']
const mediumArray = ['montana', 'rogan', 'biden', 'jonas']
const hardArray = ['idaho', 'washington', 'north dakota', 'minnesota']
const difficultArray = ['tarot', 'trump', 'credit', 'face']


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
    const [colors, setColors] = useState(
        []
    )
    const [oneAway, setOneAway] = useState(false)

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


    function isOneAway(selectedGuess, category) {
        let counter = 0
        for (let i = 0; i < 4; i++) {
            if (category.includes(selectedGuess[i])) {
                console.log("includes")
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
                setColors([
                    {
                        style: utilStyles.backgroundEasy,
                        categoryName: 'Synonyms for winning over',
                        categoryValues: easyArray
                    },
                    {
                        style: utilStyles.backgroundMedium,
                        categoryName: 'Famous Joes',
                        categoryValues: mediumArray
                    },
                    {
                        style: utilStyles.backgroundHard,
                        categoryName: 'States bordering Canada',
                        categoryValues: hardArray
                    },
                    {
                        style: utilStyles.backgroundDifficult,
                        categoryName: '______ card',
                        categoryValues: difficultArray
                    }
                ])
                setIsGameOver(true)
            }, 2000);
        }
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
                    categoryName: 'Synonyms for winning over',
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
                    categoryName: 'Famous Joes',
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
                    categoryName: 'States bordering Canada',
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
                    categoryName: '______ card',
                    categoryValues: difficultArray
                }
                setColors(prevColors => [...prevColors, difficult]);
                clearBoard()
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
                {oneAway && <div className={utilStyles.content}>You're one away!</div>}
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
                    <button className={utilStyles.square} onClick={() => {
                        handleSubmit()
                        checkForGameOver(mistakes)
                    }
                    }
                    >Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
                {isGameOver && <div>
                    <div className={utilStyles.content}>{renderGrid(guesses)}</div>
                </div>}
            </article>
        </Layout>
    );
}
