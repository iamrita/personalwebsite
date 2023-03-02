import Layout from '../../components/layout'
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css'


export default function Thoughts() {
    return <Layout>
        <Head>
            <title>Using Next.js</title>
        </Head>
        <article>
            <h1 className={utilStyles.headingXl}>Building this site using Next.js</h1>
            <div className={utilStyles.lightText}>
                <p>After working on a mobile team for almost three years, I wanted to get back into writing web applications, something I did more often in college as a part of my Human-Computer Interaction emphasis.
                    I had been wanting to build a personal website for myself for a while, and decided to start with a blog, which would allow me to delete
                    the one I currently pay for using Wordpress.</p>
                   <p> I knew I wanted to use React, but while getting started I came across Next.js which is made by Vercel. It's a new framework built on top of React
                    and comes with a list of benefits.  </p>
            </div>
        </article>

    </Layout>;
}