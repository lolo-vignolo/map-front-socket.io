import React from 'react';
import SocketContextProvider from './context/SocketContext';
import MapPage from './pages/MapPage';

const MapsApp = () => {
  return (
    <>
      <SocketContextProvider>
        <MapPage />
      </SocketContextProvider>
    </>
  );
};

export default MapsApp;
