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

const easy =['catfish', 'salmon', 'tilapia', 'tuna']
const medium =['cornea', 'iris', 'lens', 'retina']
const hard =['flail', 'flounder', 'thrash', 'struggle']
const difficult=['airplane','breakfast', 'haircut', 'eyeball']

const mapSubmission = (submission) => {
    let arr = []
    for (let i = 0; i < 16; i++) {
        if (submission[i]) {
            arr.push(words[i])
        }
    }
    return arr
}

function containSameElements(arr1, arr2) {
    return arr1.sort().join(',')=== arr2.sort().join(',')
}

export default function Connections() {
    const [clickedSquares, setClickedSquares] = useState(Array(16).fill(false));
    const [unSubmittedSquares, setUnsubmittedSquares] = useState(words)
    const [mistakes, setMistakes] = useState(3);
    const [showBackgroundRectangle, setShowBackgroundRectangle] = useState(false);
    const [submissionAnimation, setSubmissionAnimation] = useState(false);
    const [selectedWords, setSelectedWords] = useState([])

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
        const submission = mapSubmission(clickedSquares);
        console.log(selectedWords);

        if (containSameElements(selectedWords, easy) ||
            containSameElements(selectedWords, difficult) ||
            containSameElements(selectedWords, hard) ||
            containSameElements(selectedWords, medium)) {
            console.log("You got one!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowBackgroundRectangle(true);
                const remainingWords = unSubmittedSquares.filter(word => !selectedWords.includes(word))
                setUnsubmittedSquares(remainingWords)
                setClickedSquares(Array(16).fill(false))
                setSelectedWords([])
            }, 2000);
        } else {
            setMistakes(mistakes - 1);
            console.log(`You've got ${mistakes} chances left.`);
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
                {showBackgroundRectangle && (
                    <div className={`${utilStyles.square} ${utilStyles.backgroundRectangle}`}>
                        types of fish
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
