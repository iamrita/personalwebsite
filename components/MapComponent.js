import React, { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

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

function MapComponent() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBmhvvC_jgOxYKGFRLOwfdPEwQhbAMJz8E",
      version: "weekly",
    });

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



    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps");

      let map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        styles: mapStyles.retro
      })
      let marker = new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: map,
        title: 'Marker Title'
      });
    });

    // Cleanup function (optional)
    return () => {
      // Perform any cleanup here if necessary
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', }}>
        <label htmlFor="restaurantFilter"></label>
        <select id="restaurantFilter" value={selectedCategory} onChange={""}
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
        </select>
      </div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

export default MapComponent;
