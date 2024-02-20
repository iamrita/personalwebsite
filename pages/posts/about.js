import Layout from '../../components/layout'
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


// Golden Gate Bridge coordinates
const goldenGateBridgeCoords = {
    lat: 37.8199,
    lng: -122.4783
};


export default function About() {
    return <Layout>
        <Head>
            <title>About me</title>
        </Head>
        {/* Google Map */}

        <article>
            <h1 className={utilStyles.headingXl}>About Me</h1>
            <div className={utilStyles.aboutText}>
                <p>Generally, I am a creator. When I was a kid, I loved writing stories and building worlds: something that has
                    stayed with me as an adult but manifests itself now in different ways. In the same vein that I love to design and sew my own clothes,
                    I also enjoy brainstorming and developing web and mobile applications. My goal is to use my experience and knowledge
                    in Human-Computer Interaction to create engaging experiences for my audience.
                </p>
                <p>In my free time, I like to volunteer in my community. Currently, I am a counselor in training for the
                    <a href="https://sftu.org/"> San Francisco Tenants Union </a> and I am on the board of <a href="https://afutureforeverychild.org/">AFEC</a>, an international non-profit.
                    I also am an avid reader, and love watching TV shows and movies, especially with friends. I've listed some of my favorites below.
                </p>
                <LoadScript
                    googleMapsApiKey="AIzaSyBmhvvC_jgOxYKGFRLOwfdPEwQhbAMJz8E"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={goldenGateBridgeCoords}
                        zoom={13}
                    >
                        <Marker position={goldenGateBridgeCoords} />
                    </GoogleMap>
                </LoadScript>
                <h1 className={utilStyles.headingMd}>Books</h1>
                <ul>
                    <li>The Storied Life of A.J. Fikry by Gabrielle Zevin</li>
                    <li>Different by Franz de Waal</li>
                    <li>Maximum City by Suketu Mehta</li>
                    <li>Unaccustomed Earth by Jhumpa Lahiri</li>
                    <li>You're the Only One I've Told by Dr. Meera Shah</li>
                    <li>Homegoing by Yaa Gyasi</li>
                    <li>The Vanishing Half by Brit Bennett</li>
                    <li>Pachinko by Min Jin Lee</li>


                </ul>
                <h1 className={utilStyles.headingMd}>TV Shows</h1>
                <ul><li>Severance (Apple TV)</li>
                    <li>Bojack Horseman (Netflix)</li>
                    <li>Atlanta (Hulu)</li>
                    <li>Insecure (HBO Max)</li>



                </ul>
                <h1 className={utilStyles.headingMd}>Movies</h1>
                <ul><li>The Farewell</li>
                    <li>Interstellar</li>
                    <li>Marcel the Shell With Shoes On</li>
                    <li>The Sound of Metal</li>
                    <li>Pride and Prejudice</li>
                    <li>Zindagi Na Milegi Dobara</li>
                    <li>A Real Pain</li>


                </ul>
            </div>
        </article>

    </Layout>;
}