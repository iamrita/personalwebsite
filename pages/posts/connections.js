import Layout from "../../components/layout";
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { useState } from 'react';

const words = [
    'apple', 'banana', 'orange', 'grape',
    'cat', 'dog', 'rabbit', 'hamster',
    'sun', 'moon', 'star', 'cloud',
    'car', 'bicycle', 'train', 'plane'
];

export default function Connections() {
    const [clickedSquares, setClickedSquares] = useState(Array(16).fill(false));

    const handleClick = (index) => {
        const newClickedSquares = [...clickedSquares];
        newClickedSquares[index] = !newClickedSquares[index]; // Toggle the clicked state
        setClickedSquares(newClickedSquares);
    };

    const handleShuffle = () => {
        console.log("shuffled!");
    };

    const handleSubmit = () => {
        console.log('Submitted!');
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
