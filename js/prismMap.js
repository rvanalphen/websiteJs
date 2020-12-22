const token = 'pk.eyJ1IjoicnZhbmFscGhlbiIsImEiOiJjazI2ODFnNnUwMnZkM2NsbG0yc3YxNnU1In0._LCd_x_e2LbjGGNfDK9wCg'
const tiles = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
const maxZm = 18
const tilesID = 'mapbox/satellite-v9'

let prism;
let lat  = [];
let long = [];
let thick = [];
let cirle = [];
let dataMarkers = [];
let c = 'black';
let f;
let co = 0.0;
let cr = 0.8;
let first 
let last
let imageUrl
let imge
// initiating map 
const mymap = L.map('sketch-map').setView([36.768, -116.606], 15);
    L.tileLayer(tiles, {
    attribution: attribution,
    maxZoom: maxZm,
    id: tilesID,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token
    }).addTo(mymap);

L.control.scale().addTo(mymap);
//mymap.remove()
prism = "./csvs/prisms_5_LongLat.csv"


function resetMap(){
    mymap.setView([36.768, -116.606], 15)
    reset()
}


function reset(){
    if (mymap.hasLayer(imge)){
        mymap.removeLayer(imge)
    }
    for (var i = 0; i < dataMarkers.length; i++) {       
        mymap.removeLayer(dataMarkers[i]);
    }
    dataMarkers.length = 0;
}

function setValue(){
    prism = String(document.getElementById("files").value)
    //console.log("file set to:"+prism)
    loadData()
}

function loadData(){
    // Loading Data file (csv)
    d3.dsv(",", prism, function(file) {
      return {
    Latitude: file.Lat,
    Longitude: file.Long,
    Thickness: file.Thickness 
      };
    }).then(function(data) {
        //console.table(data);
        //console.log('Data Length should match Data markers Console Log amount:'+ data.length)
        // Passing data to a variable 
        coords = data
        end = coords.length-1
        //console.log('Data Loaded')
        setData()
    })
}

function setData(){
    lat.length = end
    long.length  = end
    thick.length  = end
    // parseing data columns into seperate arrays 
    for (let i =0; i < coords.length; i++){
        lat[i] = coords[i].Latitude
        long[i] = coords[i].Longitude
        thick[i] = parseFloat(coords[i].Thickness)
    }
    //console.log("Data Parsed")
    makeMarkers()
}

function makeMarkers(){
    for (let i =0; i < lat.length; i++){
          // assigning color value to c variable based on thickness value
          if(thick[i] <= 3){
            c = '#dda15e' // light brown
            f = '#dda15e'
        } else if (thick[i] > 3 && thick[i] <= 6){
            c = '#bc6c25' // dark brown
            f = '#bc6c25'
        } else if (thick[i] > 6 && thick[i] <= 9) {
            c = '#fefae0' // white
            f = '#fefae0'
        }else if (thick[i] > 9 && thick[i] <= 12) {
            c = '#283618' // dark green
            f = '#283618'
        }else if (thick[i] > 12) {
            c = '#606c38' //light green 
            f = '#606c38'
        }
          // creating leaflet markers from data
        cirle[i] = L.circle([lat[i], long[i]], {
            radius: 18,
            stroke: false,
            fillOpacity: co,
        })
        mymap.addLayer(cirle[i]);
        
        dataMarkers[i] = new L.Rectangle(cirle[i].getBounds(),{
            stroke: false,
            color: c,
            fillColor: f,
            fillOpacity: cr,
            zIndex:-1
        })
        mymap.addLayer(dataMarkers[i]);
        //console.log('Data Markers set to Markers Layer')
        
        //binding pop up to each cell to show relavent data
        dataMarkers[i].bindPopup("Current Cell is at:<br>"
        +dataMarkers[i].getCenter().toString()+'<br>'
        +"Lava thickness is: "+thick[i].toString());
    }
    first = [dataMarkers[0].getBounds()._northEast,dataMarkers[0].getBounds()._southWest]
    last = [dataMarkers[end].getBounds()._northEast,dataMarkers[end].getBounds()._southWest]
    bounds = [first,last];
    mymap.fitBounds(bounds)
}

function overlay(){
    if (mymap.hasLayer(imge)){
        mymap.removeLayer(imge)
        for (let i =0; i < lat.length; i++){
            mymap.addLayer(dataMarkers[i])
        }
    }else{
        for (let i =0; i < lat.length; i++){
            mymap.removeLayer(dataMarkers[i])
        }
        imageBounds = mymap.getBounds()
        if (prism === "./csvs/prisms_5_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_5.png'
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_9_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_9.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_15_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_15.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_20_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_20.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_27_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_27.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_30_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_30.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_34_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_34.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_40_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_40.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_45_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_45.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_48_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_48.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_56A_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_56A.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }else if (prism === "./csvs/prisms_56B_LongLat.csv"){
            imageUrl = './images/projects/Project1/profiles/Profile_56B.png',
            imge = L.imageOverlay(imageUrl, imageBounds)
        }
        imge.addTo(mymap)
    }
}
