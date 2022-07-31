import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import { UseMapbox } from '../hooks/useMapbox';

const startLocation = {
  lat: 37.801,
  lng: -122.4725,
  zoom: 14,
};

const MapPage = () => {
  // // TODO: SET CURRENT LOCATION

  const {
    setRef,
    coords,
    newMark$,
    markMovement$,
    marckerCreator,
    updateMarker,
  } = UseMapbox(startLocation);

  const { socket } = useContext(SocketContext);

  {
    /*me suscribo al observable para poder utilizar la info que brinda. Esta suscripción se hará cada vez que haya un nuevo mark,
  // ya que el next creará un nuevo marcador al sujeto, y podra ser visto por todos los subscribers */
  }
  //MUESTRO TODOS LOS MARKS
  useEffect(() => {
    socket.on('allMarks', (data) => {
      for (const key in data) {
        marckerCreator(data[key], key);
      }
    });
  }, [socket]);

  // CREO MARCADOR
  useEffect(() => {
    newMark$.subscribe((mark) => {
      socket.emit('newMark', mark);
    });
  }, [newMark$, socket]);

  // MOVE MARKER
  useEffect(() => {
    markMovement$.subscribe((drag) => {
      socket.emit('moveMark', drag);
    });
  }, [markMovement$, socket]);

  //VEO MARCADOR LUEGO DE CREAR UNO NUEVO. ES PARA LOS OTROS USUARIOS, YO YA LO TENDRE EN PANTALLA
  useEffect(() => {
    socket.on('newMark', (mark) => {
      marckerCreator(mark, mark.id);
    });
  }, [socket, marckerCreator]);

  //MOSTRARLE AL RESTO QUE EL MARCADOR SE MOVIO
  useEffect(() => {
    socket.on(
      'moveMark',
      (mark) => {
        updateMarker(mark);
      },
      [socket]
    );
  }, [socket]);

  return (
    <>
      <div className="mapInfo">
        Lng:{coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
      </div>
      <div className="mapContainer" ref={setRef} />;
    </>
  );
};

export default MapPage;
