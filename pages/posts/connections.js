import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState, useEffect } from 'react';

/**
 * Issues to Fix:
 * 1. When the user is finished, the rectangles auto order in easiest to hardest. Should
 *   keep the order that the user solved it in. 
 * 2. Getting words from text file. 
 * 3. 1 away, and letting you know if you guessed already. 
 * 
 * 
 * Future improvements
 * 1. Tracking what peopple guess 
 * 2. Having an archive on the page of previous days 
 * 3. being able to go to previous days by url routing 
 */

const words = [
    'cornea', 'flounder', 'salmon', 'iris',
    'catfish', 'tilapia', 'breakfast', 'thrash',
    'tuna', 'retina', 'haircut', 'struggle',
    'airplane', 'lens', 'flail', 'eyeball'
];

const easy = ['catfish', 'salmon', 'tilapia', 'tuna']
const medium = ['cornea', 'iris', 'lens', 'retina']
const hard = ['flail', 'flounder', 'thrash', 'struggle']
const difficult = ['airplane', 'breakfast', 'haircut', 'eyeball']


function containSameElements(arr1, arr2) {
    return arr1.sort().join(',') === arr2.sort().join(',')
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
    function toDisplay(arr) {
        let x = ""
        for (let i = 0; i < arr.length; i++) {
            x += arr[i] + ", "

        }
        const strippedStr = x.slice(0, -2);
        console.log(strippedStr)
        return strippedStr
    }

    const [data, setData] = useState([])
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
    // shouldn't be able to click more than four words
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

    const handleSubmit = () => {
        console.log(selectedWords);
        if (mistakes == 1) {
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowEasyRectangle(true);
                setShowMediumRectangle(true);
                setShowDifficultRectangle(true);
                setShowHardRectangle(true);
                setUnsubmittedSquares([])
            }, 2000);
        }

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
            setMistakes(mistakes - 1);
            setMistakeAnimation(true)
            setTimeout(() => {
                setMistakeAnimation(false);
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 1000);
            console.log(`You've got ${mistakes} chances left.`);
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
                onClick={() =>
                    handleClick(index, word)
                }
            >
                {word}
            </div>
        );
    });

    const circles = Array.from({ length: mistakes }, (_, index) => (
        <div key={index} className={utilStyles.circle}></div>
    ));

    return (
        <Layout>
            <Head>
                <title>Connections</title>
            </Head>
            <article>
                {showEasyRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundEasy}`}>
                        <div style={{}}>Types of Fish</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(easy)}</div>
                    </div>
                )}
                {showMediumRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundMedium}`}>
                        <div style={{}}>Parts of an Eye</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(medium)}</div>
                    </div>
                )}
                {showHardRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundHard}`}>
                        <div style={{}}>Having a hard time</div>
                        <div style={{ fontWeight: 'normal' }}>{toDisplay(hard)}</div>
                    </div>
                )}
                {showDifficultRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundDifficult}`}>
                        <div style={{}}>Closed compound words</div>
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
                    <button className={utilStyles.square} onClick={handleSubmit}>Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
            </article>
        </Layout>
    );
}
