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
    const [clickCount, setClickCount] = useState(0);
    const [mistakes, setMistakes] = useState(3);
    const [submissionAnimation, setSubmissionAnimation] = useState(false);
    const [showBackgroundRectangle, setShowBackgroundRectangle] = useState(false);

    const handleClick = (index) => {
        if (clickCount < 4 || clickedSquares[index]) {
            const newClickedSquares = [...clickedSquares];
            if (!newClickedSquares[index]) {
                // If the square is not already selected, increment click count
                setClickCount(clickCount + 1);
            } else {
                // If the square is already selected and clicked again, decrement click count
                setClickCount(clickCount - 1);
            }
            newClickedSquares[index] = !newClickedSquares[index]; // Toggle the clicked state
            setClickedSquares(newClickedSquares);
        }
    };

    const handleShuffle = () => {
        console.log("shuffled!");
    };

    const handleSubmit = () => {
        const submission = mapSubmission(clickedSquares)
        console.log(submission)
        if (containSameElements(submission, easy) ||
        containSameElements(submission, difficult) ||
        containSameElements(submission, hard) ||
        containSameElements(submission, medium)) {
            console.log("You got one!")
            setSubmissionAnimation(true);
            setTimeout(() => {
                setSubmissionAnimation(false);
                setShowBackgroundRectangle(true);
            }, 2000);
        } else {
            setMistakes(mistakes - 1)
            console.log(`You've got ${mistakes} chances left.`)
        }

    };

    const squares = words.map((word, index) => (
        <div
            key={index}
            className={`${utilStyles.square} ${clickedSquares[index] ? utilStyles.clicked : ''} ${submissionAnimation && clickedSquares[index] ? utilStyles.submissionAnimation : ''}`}
            onClick={() => handleClick(index)}
        >
            {word}
        </div>
    ));

    const backgroundRectangle = (
        <div className={`${utilStyles.square} ${utilStyles.backgroundRectangle}`}>
            types of fish
        </div>
    );

    return (
        <Layout>
            <Head>
                <title>Connections</title>
            </Head>
            <article>
                {showBackgroundRectangle && backgroundRectangle}
                <div className={utilStyles.grid}>{squares}</div>
                <div className={utilStyles.buttons}>
                    <button className={utilStyles.square} onClick={handleSubmit}>Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
            </article>
        </Layout>
    );
}
