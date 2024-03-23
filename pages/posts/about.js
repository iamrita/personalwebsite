import Layout, { siteTitle } from '../../components/layout'
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import Link from "next/link";


const mapStyles = {
    retro: [
        {
            "featureType": "all",
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#878787"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f9f5ed"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#c9c9c9"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#aee0f4"
                }
            ]
        }
    ]
};

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

const diamondCoffee = {
    name: "Diamond Coffee N' Pastry",
    coords: {
        lat: 37.761387998102464,
        lng: -122.48975956889238
    }
}

const mill = {
    name: "The Mill",
    coords: {
        lat: 37.7768549571018,
        lng: -122.4379319535504
    }
}

const woodenCoffeeHouse = {
    name: 'Wooden Coffeehouse',
    coords: {
        lat: 37.766214567855044,
        lng: -122.44985401612037
    }
}

const atlas = {
    name: 'Atlas Cafe',
    coords: {
        lat: 37.75913227900749,
        lng: -122.41146190262695
    }
}

const tartine = {
    name: 'Tartine Manufactory',
    coords: {
        lat: 37.76201437173618,
        lng: -122.41192938913306
    }
}
const bars = [abvCoords, localEdition, snug]
const restaurants = [mangroveCoords, sliceHouseCoords, norcina, noodleHouse, kingThai]
const bakeries = [noeValleyBakery, khanfectionsCoords]
const bookstores = [booksmith, greenAppleBooks, folioBooks]
const parks = [tankHill, alamoSquarePark, buenaVistaPark]
const coffeeShops = [atlas, tartine, mill, woodenCoffeeHouse, diamondCoffee]


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
            case "Coffee Shops":
                setMarkers(coffeeShops.map(shop => (
                    <Marker key={shop.name} position={shop.coords} title={shop.name} />
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
        <Head>
            <title>About</title>
        </Head>
        <article>
            <h1 className={utilStyles.headingXl}>About Me</h1>
            <div className={utilStyles.aboutText}>
                <p>Below, I've compiled a list of my favorites - places, books, TV shows, music, and movies. I try to keep them updated when I can. Please
                    contact me if you'd like to geek out over anything listed together!
                </p>
                <p>I also love to play <Link href={`/posts/connections`}>Connections</Link>. This is a part of my website that I'm working on that is a work in progress.</p>
                <h1 className={utilStyles.headingAbout}>Places in San Francisco</h1>
                <p>Use the dropdown below to filter based on category, and hover over the pin to see the name and my comments!</p>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', }}>
                    <label htmlFor="restaurantFilter"></label>
                    <select id="restaurantFilter" value={selectedCategory} onChange={handleCategoryChange}
                        style={{
                            padding: '8px 30px 8px 12px', /* Adjusted padding on the right side */
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            appearance: 'none',
                            backgroundImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" fill="%23333" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z" /><path d="M0 0h24v24H0z" fill="none" /></svg>')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 10px center'
                        }}>
                        <option value="Restaurants">Restaurants</option>
                        <option value="Bars">Bars</option>
                        <option value="Parks">Parks</option>
                        <option value="Bookstores">Bookstores</option>
                        <option value="Bakeries">Bakeries</option>
                        <option value="Coffee Shops">Coffee Shops</option>
                    </select>
                </div>
                <LoadScript
                    googleMapsApiKey="AIzaSyBmhvvC_jgOxYKGFRLOwfdPEwQhbAMJz8E"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={sliceHouseCoords.coords}
                        zoom={13}
                        options={{ styles: mapStyles.retro }}
                    >
                        {markers}
                    </GoogleMap>
                </LoadScript>
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