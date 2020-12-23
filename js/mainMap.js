const token = ''
const tiles = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, \
<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
const maxZm = 18
const tilesID = 'mapbox/satellite-v9'


// initiating map 
const mymap = L.map('mymap').setView([36.77794,-116.54708], 12);
    L.tileLayer(tiles, {
    attribution: attribution,
    maxZoom: maxZm,
    id: tilesID,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token
    }).addTo(mymap);

L.control.scale().addTo(mymap);

// adding markers to show different areas
//SW LC
SW_content = 'South-West Little Cone <br/> <strong>Age:</strong>0.77Ma - 0.94Ma, [1]'
L.marker([36.7710067, -116.6072977]).addTo(mymap)
    .bindPopup(SW_content);
//NE LC
NE_content = 'North-East Little Cone <br/> <strong>Age:</strong>0.77Ma, [1]'
L.marker([36.7728664, -116.6025024],{
    riseonHover:true
    }).addTo(mymap)
    .bindPopup(NE_content);
// Black cone 
BC_content = 'Black Cone <br/> <strong>Age:</strong>0.71Ma - 1.0Ma, [1]'
L.marker([36.7924627, -116.5824556]).addTo(mymap)
    .bindPopup(BC_content);
//Red cone
RC_content = 'Red Cone <br/> <strong>Age:</strong>1.0Ma, [1]'
L.marker([36.811555, -116.5656222]).addTo(mymap)
    .bindPopup(RC_content);
//Lathrop Wells 
LW_content = 'Lathrop Wells <br/> <strong>Age:</strong>0.1Ma, [1]'
L.marker([36.6917102, -116.5078331]).addTo(mymap)
    .bindPopup(LW_content);
//Makani Cone or northern cone
MC_content = 'Makani or Northern Cone <br/> <strong>Age:</strong>1.09Ma, [1]'
L.marker([36.858787, -116.5501673]).addTo(mymap)
    .bindPopup(MC_content);
//Bare Mountain
BM_content = 'Bare Mountain, sedimentary and metasedimentary  <br/> <strong>Age:</strong>Paleozoic/Precambrian, [2]'
L.marker([36.81, -116.645]).addTo(mymap)
    .bindPopup(BM_content);
//Yucca Mountain
YM_content = 'Yucca Mountain, volcanics/ignimbrite  <br/> <strong>Age:</strong>Miocene, [1]'
L.marker([36.801466, -116.4892496]).addTo(mymap)
    .bindPopup(YM_content);;

// adding polygon shapes
//South-east Crater Flat basalts
var plypoints = [

    [36.794, -116.55],
    [36.77, -116.521],
    [36.735, -116.519],
    [36.723, -116.55],
    [36.723, -116.555],
    [36.728, -116.557],
    [36.76, -116.56],
    [36.769, -116.56],
    [36.78, -116.56],
  

];

CFB_content = 'South East Crater Flat Basalts <br/> <strong>Age:</strong>3.7Ma, [1]'
var SE_CF_basalts = L.polygon(plypoints,
    {
        fill:true,
        color: 'white',
        fillOpacity:0.1
    
    }).addTo(mymap)
    .bindPopup(CFB_content);



function resetMap(){
    mymap.setView([36.77794,-116.54708], 12)
}
