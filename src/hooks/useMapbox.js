import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

mapboxgl.accessToken =
  'pk.eyJ1IjoibG9sby12aWdub2xvIiwiYSI6ImNsNjc0ODFsNTBhZW0zZHRkMDc5Y2dvMHUifQ.ttqQlRJIX89iQHVi0ii8mg';

export const UseMapbox = (startLocation) => {
  //ref div mapa
  const mapRef = useRef();
  const setRef = useCallback(
    (node) => {
      mapRef.current = node;
    },
    [mapRef]
  );

  // TODO: SET CURRENT LOCATION

  //ESTO ES LA REFERENCIA EN EL DIV DEL MAPA
  //es un objeto, el mapa en si, con toda la info que este general al crearse con mapbox
  const screenMap = useRef(null);

  //ESTADO CON TODOS LOS MARCADORES CREADOS
  //ref a marcadores, es un estado que ira incluyendo nuevos marcadores a medida que los creo
  const refMarkers = useRef({});

  //OBSERVABLES
  //observables de RXJS => prodramavion reactiva, observavles emiten info la cual el ebserver puede recibirla al suscribirse
  const markMovement = useRef(new Subject());
  const newMark = useRef(new Subject()); //este es un tipo de observable , al cual se pueden suscribir muchos observers.

  //useState para guardar coordenadas
  const [coords, setCoords] = useState(startLocation);

  // FUNCION EXTRAIDA: para crear marcador- el event es solamente una lat y lng
  const marckerCreator = useCallback((event, id) => {
    //lngLat viene del evento de mapbox , event solo viene de la info que provee el back
    const { lng, lat } = event.lngLat || event;
    const marker = new mapboxgl.Marker();
    marker.id = id ?? uuidv4();
    marker.setLngLat([lng, lat]);
    marker.addTo(screenMap.current);
    marker.setDraggable(true);
    //creo objeto marcadores
    refMarkers.current[marker.id] = marker;

    //asi le asigno valor al marcador del subjet. El cual podra ser escuchado con suscriptores
    !id && // debo comprobar si el id no existe, que se ejecute, sino no por que se hace un ciclo infinito
      newMark.current.next({
        id: marker.id,
        lng: lng,
        lat: lat,
      });

    //coordenadas del MARCADOR al ser arrastrado
    marker.on('drag', (e) => {
      const { id } = e.target;
      const { lng, lat } = e.target.getLngLat();
      markMovement.current.next({
        id,
        lng,
        lat,
      });
    });
  });

  //funcion que para actualizas la localizacion del marcador

  const updateMarker = useCallback(
    (mark) => {
      const { id, lng, lat } = mark;
      refMarkers.current[id].setLngLat([lng, lat]);
    },
    [refMarkers]
  );

  //CREO MAPA CON LA REF AL DIV
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [startLocation.lng, startLocation.lat],
      zoom: startLocation.zoom,
    });
    screenMap.current = map;
  }, [startLocation]);

  //ACTUALIZO COORDENADAS del la ubicacion del mapa
  useEffect(() => {
    screenMap.current?.on('move', (e) => {
      const { lng, lat } = screenMap.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: screenMap.current.getZoom().toFixed(2),
      });

      return () => {
        screenMap.current?.off('move');
      };
    });
  }, []);

  //CREO MARCADORES

  useEffect(() => {
    screenMap.current?.on('click', (event) => {
      marckerCreator(event);
    });
  }, []);

  return {
    setRef,
    screenMap,
    coords,
    marckerCreator,
    newMark$: newMark.current,
    markMovement$: markMovement.current,
    updateMarker,
  };
};

//const [screenMap, setScreenMap] = useState(null); (lo cambio por useRef para hacerlo mas eficiente)

{
  /* 
  refMarkers.current[marker.id] = marker;
  refMarkers = {
        "id1" = Marker()
  }
*/
}
