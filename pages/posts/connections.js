import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState } from 'react';

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

    const [clickedSquares, setClickedSquares] = useState(Array(16).fill(false));
    const [unSubmittedSquares, setUnsubmittedSquares] = useState(words)
    const [mistakes, setMistakes] = useState(3);
    const [showEasyRectangle, setShowEasyRectangle] = useState(false);
    const [showMediumRectangle, setShowMediumRectangle] = useState(false);
    const [showHardRectangle, setShowHardRectangle] = useState(false);

    const [showDifficultRectangle, setShowDifficultRectangle] = useState(false);

    const [submissionAnimation, setSubmissionAnimation] = useState(false);
    const [selectedWords, setSelectedWords] = useState([])


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
        if (mistakes == 0) {
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
            className={`${utilStyles.square} ${clickedSquares[index] ? utilStyles.clicked : ''} ${submissionAnimation ? utilStyles.submissionAnimation : ''}`}
            onClick={() => handleClick(index, word)}
        >
            {word}
        </div>
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
                <div className={utilStyles.buttons}>
                    <button className={utilStyles.square} onClick={handleSubmit}>Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
            </article>
        </Layout>
    );
}
