import Layout from '../../components/layout'
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { ca } from 'date-fns/locale';
import MapComponent from '../../components/MapComponent';


const khanfectionsCoords = {
    name: "Khanfections - best breakfast sandwich in the city",
    coords: {
        lat: 37.759030942158205,
        lng: -122.41532890548739
    }
};

const sliceHouseCoords = {
    name: "Slice House - try the grandma style pizza, and get their punch card!",
    coords: {
        lat: 37.770024841643355,
        lng: -122.4475607321787
    }
}

const abvCoords = {
    name: "ABV",
    coords: {
        lat: 37.76513838250822,
        lng: -122.42358938984957
    }
}

const mangroveCoords = {
    name: "Mangrove Kitchen",
    coords: {
        lat: 37.77271180605459,
        lng: -122.43696055916676
    }

}

const localEdition = {
    name: "Local Edition - lovely live music",
    coords: {
        lat: 37.78786315864519,
        lng: -122.40322230519006
    }
}

const noeValleyBakery = {
    name: "Noe Valley Bakery - ask for the Milky Way Bomb! (and go there on your birthday for free treats)",
    coords: {
        lat: 37.755188262266095,
        lng: -122.43301709046229
    }
}

const kingThai = {
    name: "King Thai #2",
    coords: {
        lat: 37.78350061284428,
        lng: -122.4630054573192
    }
}
const snug = {
    name: "The Snug",
    coords: {
        lat: 37.7910500340529,
        lng: -122.43440703217813
    }
}
const noodleHouse = {
    name: "Kevin and Chris's Noodle House",
    coords: {
        lat: 37.76357161286133,
        lng: -122.4778375186852
    }
}
const norcina = {
    name: "Norcina",
    coords: {
        lat: 37.80032105259278,
        lng: -122.43964357265975
    }
}

const booksmith = {
    name: "The Booksmith",
    coords: {
        lat: 37.7695546814879,
        lng: -122.4513557916966
    }
}

const tankHill = {
    name: "Tank Hill - go for sunset",
    coords: {
        lat: 37.76013428680032,
        lng: -122.4476748168379
    }
}

const buenaVistaPark = {
    name: "Buena Vista Park",
    coords: {
        lat: 37.77070626452147,
        lng: -122.44307111499039
    }
}

const alamoSquarePark = {
    name: "Alamo Square Park - best dogs in the city here",
    coords: {
        lat: 37.77650081427212,
        lng: -122.43507649539087
    }
}

const greenAppleBooks = {
    name: "Green Apple Books",
    coords: {
        lat: 37.76569595005676,
        lng: -122.46658494567305
    }
}

const folioBooks = {
    name: "Folio Books",
    coords: {
        lat: 37.75140903783516,
        lng: -122.43091182665557
    }
}
const bars = [abvCoords, localEdition, snug]
const restaurants = [mangroveCoords, sliceHouseCoords, norcina, noodleHouse, kingThai]
const bakeries = [noeValleyBakery, khanfectionsCoords]
const bookstores = [booksmith, greenAppleBooks, folioBooks]
const parks = [tankHill, alamoSquarePark, buenaVistaPark]


export default function About() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        setMarkers(restaurants.map(restaurant => (
            <Marker key={restaurant.name} position={restaurant.coords} title={restaurant.name} />
        )));
    }, []);

    const handleCategoryChange = (event) => {
        const category = event.target.value
        switch (category) {
            case "Restaurants":
                setMarkers(restaurants.map(restaurant => (
                    <Marker key={restaurant.name} position={restaurant.coords} title={restaurant.name} />
                )));
                break;
            case "Bars":
                setMarkers(bars.map(bar => (
                    <Marker key={bar.name} position={bar.coords} title={bar.name} />
                )
                ))
                break;
            case "Bookstores":
                setMarkers(bookstores.map(bookstore => (
                    <Marker key={bookstore.name} position={bookstore.coords} title={bookstore.name} />
                )
                ))
                break;

            case "Parks":
                setMarkers(parks.map(park => (
                    <Marker key={park.name} position={park.coords} title={park.name} />
                )
                ))
                break;
            case "Bakeries":
                setMarkers(bakeries.map(bakery =>
                    (<Marker key={bakery.name} position={bakery.coords} title={bakery.name} />)))
                break;
        }
        setSelectedCategory(category)
    };


    return <Layout>
        <article>
            <h1 className={utilStyles.headingXl}>About Me</h1>
            <div className={utilStyles.aboutText}>
                <p>Below, I've compiled a list of my favorites - places, books, TV shows, music, and movies. I try to keep them updated when I can. Please
                    contact me if you'd like to geek out over anything listed together!
                </p>
                <h1 className={utilStyles.headingAbout}>Places in San Francisco</h1>
                <p>Use the dropdown below to filter based on category, and hover over the pin to see the name and my comments!</p>
             
                <MapComponent/>

                <h1 className={utilStyles.headingAbout}>Books</h1>
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

                <h1 className={utilStyles.headingAbout}>TV Shows</h1>
                <ul><li>Severance (Apple TV)</li>
                    <li>Bojack Horseman (Netflix)</li>
                    <li>Atlanta (Hulu)</li>
                    <li>Insecure (HBO Max)</li>
                    <li>Chernobyl (HBO Max)</li>
                </ul>

                <h1 className={utilStyles.headingAbout}>Movies</h1>
                <ul><li>The Farewell</li>
                    <li>Marcel the Shell With Shoes On</li>
                    <li>Spotlight</li>
                    <li>Pride and Prejudice (Keira Knightley version)</li>
                    <li>Zindagi Na Milegi Dobara</li>
                    <li>A Real Pain</li>
                </ul>


                <h1 className={utilStyles.headingAbout}>Albums</h1>
                <ul><li>Ctrl by SZA</li>
                    <li>Nothing Like the Sun by Sting</li>
                    <li>The Miseducation of Lauryn Hill by Lauryn Hill</li>
                    <li>Swimming by Mac Miller</li>
                    <li>ANTI by Rihanna</li>
                    <li>Channel Orange by Frank Ocean</li>
                </ul>
            </div>
        </article>

    </Layout>;
}