import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState, useEffect } from 'react';


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



    // shouldn't be able to click more than four words
    const handleClick = (index, word) => {
        const newClickedSquares = [...clickedSquares];
        newClickedSquares[index] = !newClickedSquares[index];
        setClickedSquares(newClickedSquares);
        const newSelectedWords = [...new Set([...selectedWords, word])]; // Add the clicked word to the selected words array and remove duplicates
        setSelectedWords(newSelectedWords);
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
                setSubmissionAnimation(false);
                setShowEasyRectangle(true);
                const remainingWords = unSubmittedSquares.filter(word => !selectedWords.includes(word))
                setUnsubmittedSquares(remainingWords)
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 2000);

        } else if (containSameElements(selectedWords, medium)) {
            console.log("You got medium!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowMediumRectangle(true);
                const remainingWords = unSubmittedSquares.filter(word => !selectedWords.includes(word))
                setUnsubmittedSquares(remainingWords)
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 2000);

        } else if (containSameElements(selectedWords, hard)) {
            console.log("You got hard!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowHardRectangle(true);
                const remainingWords = unSubmittedSquares.filter(word => !selectedWords.includes(word))
                setUnsubmittedSquares(remainingWords)
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 2000);

        } else if (containSameElements(selectedWords, difficult)) {
            console.log("You got difficult!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowDifficultRectangle(true);
                const remainingWords = unSubmittedSquares.filter(word => !selectedWords.includes(word))
                setUnsubmittedSquares(remainingWords)
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 2000);

        } else {
            setMistakes(mistakes - 1);
            console.log(`You've got ${mistakes} chances left.`);
            setClickedSquares(Array(16).fill(false))
            setSelectedWords([])

        }



    };

    const squares = unSubmittedSquares.map((word, index) => (
        <div
            key={index}
            className={`${utilStyles.square} ${clickedSquares[index] ? utilStyles.clicked : ''} ${clickedSquares[index] && submissionAnimation ? utilStyles.submissionAnimation : ''}`}
            onClick={() => handleClick(index, word)}
        >
            {word}
        </div>
    ));

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
