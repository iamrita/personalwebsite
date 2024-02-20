import Layout from '../../components/layout'
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';


const khanfectionsCoords = {
    lat: 37.759030942158205,
    lng: -122.41532890548739
};

const sliceHouseCoords = {
    lat: 37.770024841643355,
    lng: -122.4475607321787
}

const abvCoords = {
    lat: 37.76513838250822,
    lng: -122.42358938984957
}

const mangroveCoords = {
    lat: 37.77271180605459,
    lng: -122.43696055916676

}

const localEdition = {
    lat: 37.78786315864519, 
    lng: -122.40322230519006
}

const noeValleyBakery = {
    lat: 37.755188262266095,
    lng:  -122.43301709046229
}

const kingThai = {
    lat: 37.78350061284428, 
    lng: -122.4630054573192
}
const snug = {
    lat: 37.7910500340529, 
    lng: -122.43440703217813
}
const noodleHouse = {
    lat: 37.76357161286133, 
    lng: -122.4778375186852
}
const norcina = {
    lat: 37.80032105259278, 
    lng: -122.43964357265975
}
const bars = [abvCoords, localEdition]
const restaurants = [mangroveCoords, khanfectionsCoords, sliceHouseCoords]


export default function About() {
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);

    const handleMarkerClick = () => {
        setInfoWindowOpen(true);
    };

    const handleInfoWindowClose = () => {
        setInfoWindowOpen(false);
    };


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
                <h1 className={utilStyles.headingMd}>My favorite places in SF</h1>
                <LoadScript
                    googleMapsApiKey="AIzaSyBmhvvC_jgOxYKGFRLOwfdPEwQhbAMJz8E"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={sliceHouseCoords}
                        zoom={13}
                    >
                        <Marker
                            position={khanfectionsCoords}
                            title="Khanfections"/>
                        <Marker position={sliceHouseCoords} title="Slice House" />
                        <Marker position={abvCoords} title="ABV" />
                        <Marker position={mangroveCoords} title="Mangrove Kitchen" />
                        <Marker position={localEdition} title="Local Edition"/>
                        <Marker position={noeValleyBakery} title="Noe Valley Bakery"/>
                        <Marker position={kingThai} title="King Thai #2"/>
                        <Marker position={snug} title="The Snug"/>
                        <Marker position={noodleHouse} title="Kevin and Chris's Noodle House"/>
                        <Marker position={norcina} title="Norcina"/>

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