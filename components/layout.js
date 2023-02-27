import styles from './layout.module.css';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css'
// import Image from 'next/image'
import Link from 'next/link';


const name = 'Amrita Venkatraman';
export const siteTitle = "Amrita's Blog";
export default function Layout({ children, home }) {
    return (<div className={styles.container}>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
                name="description"
                content="Learn how to build a personal website using Next.js"
            />
            <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large+image" />
        </Head>
        <header className={styles.header}>
            {home ? (
                <>
                   {/* <Image
                        priority
                        src="/images/profile.jpg"
                        className={utilStyles.borderCircle}
                        height={175}
                        width={144}
                        alt=""
            />*/}
            <img src = "/images/profile.jpg" alt="amritapic"/>
                    <h1 className={utilStyles.heading2Xl}>{name}</h1>
                </>
            ) : (
                <>
                    <Link href="/">
                     {/*  <Image
                            priority
                            src="/images/profile.jpg"
                            className={utilStyles.borderCircle}
                            height={130}
                            width={108}
                            alt=""
            />*/}
                        <img src = "/images/profile.jpg" alt="amritapic"/>

                    </Link>
                    <h2 className={utilStyles.headingLg}>
                        <Link href="/" className={utilStyles.colorInherit}>
                            {name}
                        </Link>
                    </h2>
                </>
            )}
        </header>
        <main>{children}</main>

        {!home && (
            <div className={styles.backToHome}>
                <Link href="/"> Back To Home </Link>
            </div>
        )}
    </div>);
}