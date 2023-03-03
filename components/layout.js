import styles from './layout.module.css';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css'
import Image from 'next/image'
import Link from 'next/link';


const name = 'Amrita Venkatraman';
export const siteTitle = "Amrita's Blog";
export default function Layout({ children, home }) {
    return (<div className={styles.container}>
        <Head>
            <link rel="icon" href="/umbrella.ico" />
            <meta
                name="description"
                content="Amrita's musings"
            />
            <meta
                property="og:image"
                content={"/images/profile.jpg"}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large+image" />
        </Head>
        <header className={styles.header}>
            {home ? (
                <>
                    <Image
                        priority
                        unoptimized
                        src="/images/profile.jpg"
                        className={utilStyles.borderCircle}
                        height={175}
                        width={144}
                        alt=""
                    />
                    <h1 className={utilStyles.heading2Xl}>{name}</h1>
                </>
            ) : (
                <>
                    <Link href="/">
                        <Image
                            priority
                            unoptimized
                            src="/images/profile.jpg" g
                            className={utilStyles.borderCircle}
                            height={130}
                            width={108}
                            alt=""
                        />

                    </Link>
                    {/* <h2 className={utilStyles.headingLg}>
                        <Link href="/" className={utilStyles.colorInherit}>
                            {name}
                        </Link>
            </h2>*/}
                </>
            )}
        </header>
        <main>{children}</main>
        {!home && (
            <div className={styles.backToHome}>
                <Link href="/"> Back To Home </Link>
            </div>
        )}
        <div className={styles.row}>
            <a className={styles.column} href="https://github.com/iamrita">
                <Image
                    priority
                    unoptimized
                    src="/images/github.png"
                    height={20}
                    width={20}
                    alt=""
                />
            </a>
            <a className={styles.column} href="mailto: amritav.ca@gmail.com">
                <Image
                    priority
                    unoptimized
                    src="/images/email.png"
                    height={20}
                    width={20}
                    alt=""
                />
            </a>
            <a className = {styles.column} href="https://www.linkedin.com/in/amritavenkatraman/">
                <Image
                    priority
                    unoptimized
                    src="/images/linkedin.png"
                    height={20}
                    width={20}
                    alt=""
                />
            </a>
            <a className = {styles.column} href="https://twitter.com/iamrita98">
                <Image
                    priority
                    unoptimized
                    src="/images/twitter.png"
                    height={20}
                    width={20}
                    alt=""
                />
        </a>
        </div>
    </div>);
}