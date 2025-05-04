import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className="blog">
          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>

          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
      </article>
      <style jsx>
        {`
          .blog {
            border: 1px solid black;
            font-size: 18px;
            border-radius: 8px;
            background-color: #fff0f2;
            padding: 32px;
          }
        `}
      </style>
    </Layout>
  );
}
