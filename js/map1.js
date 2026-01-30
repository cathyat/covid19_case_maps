mapboxgl.accessToken = 'pk.eyJ1IjoiY2F0aHlhdCIsImEiOiJjbWwwMHh3bzQwODZyM2tva2JxbGttMGthIn0.J5ASwcXeg5WhWf7BtE7jHQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-100, 40],
    zoom: 4
});

async function geojsonFetch() {
    const response = await fetch('assets/us-covid-2020-rates.json');
    const usData = await response.json();

    map.on('load', () => {

        map.addSource('usData', {
            type: 'geojson',
            data: usData
        });

        map.addLayer({
            id: 'usCovid-layer',
            type: 'fill',
            source: 'usData',
            paint: {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#FFEDA0',
                    20, '#FED976',
                    40, '#FEB24C',
                    60, '#FD8D3C',
                    80, '#FC4E2A',
                    100, '#E31A1C',
                    150, '#BD0026',
                    200, '#99000D'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });

        const layers = [
            '0–19',
            '20–39',
            '40–59',
            '60–79',
            '80–99',
            '100–149',
            '150–199',
            '200+'
        ];

        const colors = [
            '#FFEDA070',
            '#FED97670',
            '#FEB24C70',
            '#FD8D3C70',
            '#FC4E2A70',
            '#E31A1C70',
            '#BD002670',
            '#99000D70'
        ];

        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Covid-19 Rate<br>(per 1000)</b><br><br>";

        layers.forEach((layer, i) => {
            const item = document.createElement('div');

            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = colors[i];

            const value = document.createElement('span');
            value.innerHTML = layer;

            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
        legend.innerHTML +='<p style="text-align: right; font-size:10pt">Source: CDC 2020</p>';
    });

map.on('mousemove', (e) => {
    const county = map.queryRenderedFeatures(e.point, {
        layers: ['usCovid-layer']
    });

    document.getElementById('text-description').innerHTML = `
        <h3>County: ${county[0].properties.county}</h3>
        <h3>Total COVID-19 Cases: ${county[0].properties.cases}</h3>
    `;
});

}
geojsonFetch();

