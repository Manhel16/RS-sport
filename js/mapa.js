document.addEventListener('DOMContentLoaded', function () {
    // Coordenadas del concesionario (Madrid centro)
    const concesionarioCoords = ol.proj.fromLonLat([-3.70275, 40.41831]);

    // Crear el mapa
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: concesionarioCoords,
            zoom: 14
        }),
        controls: [] // Elimina todos los controles del mapa
    });

    // Crear el marcador del concesionario
    const concesionarioMarker = new ol.Feature({
        geometry: new ol.geom.Point(concesionarioCoords)
    });

    // Establecer el estilo del marcador
    concesionarioMarker.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
    }));

    // Capa vectorial para el marcador
    const vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [concesionarioMarker]
        })
    });

    // Agregar la capa vectorial al mapa
    map.addLayer(vectorLayer);
});