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
    const [clickedSquares, setClickedSquares] = useState(Array(16).fill(false)); // sets the clicked state for all the ssquares to false 
    const [clickCount, setClickCount] = useState(0);


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
        } else {
            console.log("You've made a mistake")
        }
        
    };

    const squares = words.map((word, index) => (
        <div
            key={index}
            className={`${utilStyles.square} ${clickedSquares[index] ? utilStyles.clicked : ''}`}
            onClick={() => handleClick(index)}
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
                <div className={utilStyles.grid}>{squares}</div>
                <div className={utilStyles.buttons}>
                    <button className={utilStyles.square} onClick={handleSubmit}>Submit</button>
                    <button className={utilStyles.square} onClick={handleShuffle}>Shuffle</button>
                </div>
            </article>
        </Layout>
    );
}
