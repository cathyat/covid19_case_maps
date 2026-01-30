const grades = [1000, 10000, 50000],
      colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
      radii = [4, 10, 20];

mapboxgl.accessToken = 'pk.eyJ1IjoiY2F0aHlhdCIsImEiOiJjbWwwMHh3bzQwODZyM2tva2JxbGttMGthIn0.J5ASwcXeg5WhWf7BtE7jHQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-100, 40],
    zoom: 4
});

map.on('load', () => {
    map.addSource('covidCounts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        id: 'count-point',
        type: 'circle',
        source: 'covidCounts',
        paint: {
            'circle-radius': {
                property: 'cases',
                stops: [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]]
                ]
            },
            'circle-color': {
                property: 'cases',
                stops: [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    });

map.on('click', 'count-point', (event) => {
    const props = event.features[0].properties;
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>County:</strong> ${props.county}<br>
                <strong>Cases:</strong> ${props.cases}`)
        .addTo(map);
});

const legend = document.getElementById('legend');
var labels = [`<strong>COVID-19 Cases</strong>`], vbreak;

for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    var dot_radius = 2 * radii[i];

    labels.push(
        '<p class="break">' +
        '<i class="dot" style="background:' + colors[i] + 
        '; width:' + dot_radius + 'px; height:' + dot_radius + 'px;"></i> ' +
        '<span class="dot-label">' + vbreak + '</span>' +
        '</p>'
    );
}

const source =
    '<p style="text-align: right; font-size:10pt">Source: CDC 2020</p>';

legend.innerHTML = labels.join('') + source;

})
