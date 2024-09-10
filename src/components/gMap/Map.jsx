// import  { useState,  useCallback } from 'react';
// import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';
// import DriverImage from '../../assets/DriverIcon.png'

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const center = {
//   lat: 30.762812162720632,
//   lng: 76.6309169972107
// };

// // Example: Decoding the encoded polyline string
// const encodedPolyline = "ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE"; // Your polyline string

// const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// // Get the first and last coordinates
// const firstPoint = path[0];
// const lastPoint = path[path.length - 1];

// const Map = () => {
//   const [progress, setProgress] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const velocity = 27; // 100km per hour, for simulation purposes.
//   let initialDate;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: '' // Replace with your actual API key
//   });

//   const icon1 = {
//     url: DriverImage,
//     scaledSize: new window.google.maps.Size(50, 40),
//     anchor: new window.google.maps.Point(20, 20),
//   };

//   // Distance calculator
//   const getDistance = useCallback(() => {
//     const differentInTime = (new Date() - initialDate) / 1000; // seconds
//     return differentInTime * velocity;
//   }, [initialDate, velocity]);

//   // Function to move the marker along the path
//   const moveObject = useCallback(() => {
//     const distance = getDistance();
//     if (!distance) return;

//     let progress = path.filter(coordinates => coordinates.distance < distance);
//     const nextLine = path.find(coordinates => coordinates.distance > distance);

//     if (!nextLine) {
//       setProgress(progress);
//       window.clearInterval(intervalId);
//       console.log("Trip Completed!! Thank You!!");
//       return;
//     }

//     const lastLine = progress[progress.length - 1];
//     const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
//     const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

//     const totalDistance = nextLine.distance - lastLine.distance;
//     const percentage = (distance - lastLine.distance) / totalDistance;

//     const angle = window.google.maps.geometry.spherical.computeHeading(
//       lastLineLatLng,
//       nextLineLatLng
//     );
//     const actualAngle = angle - 90;
//     const marker = document.querySelector(`[src="${icon1.url}"]`);

//     if (marker) {
//       marker.style.transform = `rotate(${actualAngle}deg)`;
//     }
        
//     const position = window.google.maps.geometry.spherical.interpolate(
//       lastLineLatLng,
//       nextLineLatLng,
//       percentage
//     );

//     setProgress(progress.concat(position));
//   }, [intervalId, path, getDistance]);

//   // Function to calculate the path distance
//   const calculatePath = useCallback(() => {
//     path.forEach((coordinates, i, array) => {
//       if (i === 0) {
//         coordinates.distance = 0;
//       } else {
//         const { lat: lat1, lng: lng1 } = coordinates;
//         const latLong1 = new window.google.maps.LatLng(lat1, lng1);
//         const { lat: lat2, lng: lng2 } = array[i - 1];
//         const latLong2 = new window.google.maps.LatLng(lat2, lng2);

//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);
//         coordinates.distance = distance + array[i - 1].distance;
//       }
//     });
//   }, [path]);

//   // Start the simulation when the button is clicked
//   const startSimulation = useCallback(() => {
//     if (intervalId) window.clearInterval(intervalId);
//     setProgress(null);
//     initialDate = new Date();
//     calculatePath();
//     const newIntervalId = window.setInterval(moveObject, 1000);
//     setIntervalId(newIntervalId);
//   }, [intervalId, calculatePath, moveObject]);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={startSimulation}
//         >
//           Start Simulation
//         </button>
//       </div>

//       <div className="w-full h-[500px]">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={center}
//           options={{
//             streetViewControl: false, // Disable street view
//             mapTypeControl: false,    // Disable map type control (e.g., satellite view)
//             fullscreenControl: false, // Optionally disable fullscreen control
//             zoomControl: true,        // You can enable or disable zoom controls as needed
//             mapTypeId: 'roadmap'      // You can explicitly set the map type (roadmap, satellite, hybrid, terrain)
//           }}

//         >
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#0088FF",
//               strokeWeight: 6,
//               strokeOpacity: 0.6,

//             }}
//           />

//           {/* Marker for the start point */}
//           <Marker position={firstPoint} />

//           {/* Marker for the destination point */}
//           <Marker position={lastPoint} />

//           {/* Progress Polyline and Moving Marker */}
//           {progress && (
//             <>
//               <Polyline path={progress} options={{ strokeColor: "orange" }} />
//               <Marker icon={icon1} position={progress[progress.length - 1]} />
//             </>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default Map;





// import { useState, useCallback } from 'react';
// import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';
// import DriverImage from '../../assets/DriverIcon.png';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// // Starting center of the map
// const initialCenter = {
//   lat: 30.762812162720632,
//   lng: 76.6309169972107
// };

// // Example: Decoding the encoded polyline string
// const encodedPolyline = "ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE"; // Your polyline string

// const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// // Get the first and last coordinates
// const firstPoint = path[0];
// const lastPoint = path[path.length - 1];

// const Map = () => {
//   const [progress, setProgress] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const [mapCenter, setMapCenter] = useState(initialCenter); // To dynamically update the center
//   const velocity = 27; // 100km per hour, for simulation purposes.
//   let initialDate;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: '' // Replace with your actual API key
//   });

//   const icon1 = {
//     url: DriverImage,
//     scaledSize: new window.google.maps.Size(40, 40),
//     anchor: new window.google.maps.Point(20, 20),
//   };



  

//   // Distance calculator
//   const getDistance = useCallback(() => {
//     const differentInTime = (new Date() - initialDate) / 1000; // seconds
//     return differentInTime * velocity;
//   }, [initialDate, velocity]);

//   // Function to move the marker along the path
//   const moveObject = useCallback(() => {
//     const distance = getDistance();
//     if (!distance) return;

//     let progress = path.filter(coordinates => coordinates.distance < distance);
//     const nextLine = path.find(coordinates => coordinates.distance > distance);

//     if (!nextLine) {
//       setProgress(progress);
//       window.clearInterval(intervalId);
//       console.log("Trip Completed!! Thank You!!");
//       return;
//     }

//     const lastLine = progress[progress.length - 1];
//     const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
//     const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

//     const totalDistance = nextLine.distance - lastLine.distance;
//     const percentage = (distance - lastLine.distance) / totalDistance;

//     const position = window.google.maps.geometry.spherical.interpolate(
//       lastLineLatLng,
//       nextLineLatLng,
//       percentage
//     );

    
//     // Update the progress and re-center the map
//     setProgress(progress.concat(position));
//     setMapCenter({ lat: position.lat(), lng: position.lng() });

//     const angle = window.google.maps.geometry.spherical.computeHeading(
//       lastLineLatLng,
//       nextLineLatLng
//     );
//     const actualAngle = angle - 90;
//     const marker = document.querySelector(`[src="${icon1.url}"]`);

//     if (marker) {
//       marker.style.transform = `rotate(${actualAngle}deg)`;
//     }
//   }, [intervalId, path, getDistance, icon1.url]);

//   // Function to calculate the path distance
//   const calculatePath = useCallback(() => {
//     path.forEach((coordinates, i, array) => {
//       if (i === 0) {
//         coordinates.distance = 0;
//       } else {
//         const { lat: lat1, lng: lng1 } = coordinates;
      
//         const latLong1 = new window.google.maps.LatLng(lat1, lng1);
//         const { lat: lat2, lng: lng2 } = array[i - 1];
//         const latLong2 = new window.google.maps.LatLng(lat2, lng2);

//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);
//         coordinates.distance = distance + array[i - 1].distance;
//       }
//     });
//   }, [path]);

//   // Start the simulation when the button is clicked
//   const startSimulation = useCallback(() => {
//     if (intervalId) window.clearInterval(intervalId);
//     setProgress(null);
//     initialDate = new Date();
//     calculatePath();
//     const newIntervalId = window.setInterval(moveObject, 1000);
//     setIntervalId(newIntervalId);
//   }, [intervalId, calculatePath, moveObject]);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={startSimulation}
//         >
//           Start Simulation
//         </button>
//       </div>

//       <div className="w-full h-[500px]">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={mapCenter} // Update center dynamically to follow the marker
//           options={{
//             streetViewControl: false,  // Disable street view control
//             mapTypeControl: false,     // Disable map type control
//             fullscreenControl: false,  // Disable fullscreen control
//             zoomControl: true,         // Enable zoom control
//           }}
//         >
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#0088FF",
//               strokeWeight: 6,
//               strokeOpacity: 0.6,
//             }}
//           />

//           {/* Marker for the start point */}
//           <Marker position={firstPoint} />

//           {/* Marker for the destination point */}
//           <Marker position={lastPoint} />

//           {/* Progress Polyline and Moving Marker */}
//           {progress && (
//             <>
//               <Polyline path={progress} options={{ strokeColor: "orange" }} />
//               <Marker icon={icon1} position={progress[progress.length - 1]} />
//             </>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default Map;


// import { useState, useCallback } from 'react';
// import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';
// import DriverImage from '../../assets/DriverIcon.png';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// // Starting center of the map
// const initialCenter = {
//   lat: 30.762812162720632,
//   lng: 76.6309169972107
// };

// // Example: Decoding the encoded polyline string
// const encodedPolyline = "ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE"; // Your polyline string

// const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// // Get the first and last coordinates
// const firstPoint = path[0];
// const lastPoint = path[path.length - 1];

// const Map = () => {
//   const [progress, setProgress] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const [mapCenter, setMapCenter] = useState(initialCenter); // To dynamically update the center
//   const velocity = 27; // 100km per hour, for simulation purposes.
//   let initialDate;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: '' // Replace with your actual API key
//   });

//   const icon1 = {
//     url: DriverImage,
//     scaledSize: new window.google.maps.Size(40, 40),
//     anchor: new window.google.maps.Point(20, 20),
//   };

//   // Function to make API request to Roads API and snap to nearest road
//   const snapToRoads = async (path) => {
//     const pathStr = path.map(coord => `${coord.lat},${coord.lng}`).join('|');
//     const response = await fetch(
//       `https://roads.googleapis.com/v1/snapToRoads?path=${pathStr}&interpolate=true&key=`
//     );
//     const data = await response.json();

//     if (data.snappedPoints) {
//       return data.snappedPoints.map(point => ({
//         lat: point.location.latitude,
//         lng: point.location.longitude
//       }));
//     }
//     return path;
//   };

//   // Distance calculator
//   const getDistance = useCallback(() => {
//     const differentInTime = (new Date() - initialDate) / 1000; // seconds
//     return differentInTime * velocity;
//   }, [initialDate, velocity]);

//   // Function to move the marker along the path
//   const moveObject = useCallback(() => {
//     const distance = getDistance();
//     if (!distance) return;

//     let progress = path.filter(coordinates => coordinates.distance < distance);
//     const nextLine = path.find(coordinates => coordinates.distance > distance);

//     if (!nextLine) {
//       setProgress(progress);
//       window.clearInterval(intervalId);
//       console.log("Trip Completed!! Thank You!!");
//       return;
//     }

//     const lastLine = progress[progress.length - 1];
//     const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
//     const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

//     const totalDistance = nextLine.distance - lastLine.distance;
//     const percentage = (distance - lastLine.distance) / totalDistance;

//     const position = window.google.maps.geometry.spherical.interpolate(
//       lastLineLatLng,
//       nextLineLatLng,
//       percentage
//     );

//     // Update the progress and re-center the map
//     setProgress(progress.concat(position));
//     setMapCenter({ lat: position.lat(), lng: position.lng() });

//     const angle = window.google.maps.geometry.spherical.computeHeading(
//       lastLineLatLng,
//       nextLineLatLng
//     );
//     const actualAngle = angle - 90;
//     const marker = document.querySelector(`[src="${icon1.url}"]`);

//     if (marker) {
//       marker.style.transform = `rotate(${actualAngle}deg)`;
//     }
//   }, [intervalId, path, getDistance, icon1.url]);

//   // Function to calculate the path distance and snap to roads
//   const calculatePath = useCallback(async () => {
//     const snappedPath = await snapToRoads(path); // Snap the path to roads
//     snappedPath.forEach((coordinates, i, array) => {
//       if (i === 0) {
//         coordinates.distance = 0;
//       } else {
//         const { lat: lat1, lng: lng1 } = coordinates;
//         const latLong1 = new window.google.maps.LatLng(lat1, lng1);
//         const { lat: lat2, lng: lng2 } = array[i - 1];
//         const latLong2 = new window.google.maps.LatLng(lat2, lng2);

//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);
//         coordinates.distance = distance + array[i - 1].distance;
//       }
//     });
//   }, [path]);

//   // Start the simulation when the button is clicked
//   const startSimulation = useCallback(() => {
//     if (intervalId) window.clearInterval(intervalId);
//     setProgress(null);
//     initialDate = new Date();
//     calculatePath();
//     const newIntervalId = window.setInterval(moveObject, 1000);
//     setIntervalId(newIntervalId);
//   }, [intervalId, calculatePath, moveObject]);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={startSimulation}
//         >
//           Start Simulation
//         </button>
//       </div>

//       <div className="w-full h-[500px]">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={mapCenter} // Update center dynamically to follow the marker
//           options={{
//             streetViewControl: false,  // Disable street view control
//             mapTypeControl: false,     // Disable map type control
//             fullscreenControl: false,  // Disable fullscreen control
//             zoomControl: true,         // Enable zoom control
//           }}
//         >
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#0088FF",
//               strokeWeight: 6,
//               strokeOpacity: 0.6,
//             }}
//           />

//           {/* Marker for the start point */}
//           <Marker position={firstPoint} />

//           {/* Marker for the destination point */}
//           <Marker position={lastPoint} />

//           {/* Progress Polyline and Moving Marker */}
//           {progress && (
//             <>
//               <Polyline path={progress} options={{ strokeColor: "orange" }} />
//               <Marker icon={icon1} position={progress[progress.length - 1]} />
//             </>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default Map;
















// import { useState, useCallback } from 'react';
// import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';
// import DriverImage from '../../assets/DriverIcon.png';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const initialCenter = {
//   lat: 30.762812162720632,
//   lng: 76.6309169972107
// };

// // Example: Decoding the encoded polyline string
// const encodedPolyline = "ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE"; // Your polyline string

// const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// // Get the first and last coordinates
// const firstPoint = path[0];
// const lastPoint = path[path.length - 1];

// const Map = () => {
//   const [progress, setProgress] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const [mapCenter, setMapCenter] = useState(initialCenter); // To dynamically update the center
//   const velocity = 27; // 100km per hour, for simulation purposes.
//   let initialDate;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: '' // Replace with your actual API key
//   });

//   const icon1 = {
//     url: DriverImage,
//     scaledSize: new window.google.maps.Size(40, 40),
//     anchor: new window.google.maps.Point(20, 20),
//   };

//   // Utility function to chunk an array into smaller arrays of a specified size
//   const chunkArray = (arr, chunkSize) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += chunkSize) {
//       result.push(arr.slice(i, i + chunkSize));
//     }
//     return result;
//   };

//   // Function to make API request to Roads API and snap to nearest road
//   const snapToRoads = async (path) => {
//     const chunkedPaths = chunkArray(path, 100); // Split path into chunks of 100 points
//     let snappedPoints = [];

//     for (let i = 0; i < chunkedPaths.length; i++) {
//       const pathStr = chunkedPaths[i].map(coord => `${coord.lat},${coord.lng}`).join('|');
//       const response = await fetch(
//         `https://roads.googleapis.com/v1/snapToRoads?path=${pathStr}&interpolate=true&key=`
//       );
//       const data = await response.json();

//       if (data.snappedPoints) {
//         const snappedChunk = data.snappedPoints.map(point => ({
//           lat: point.location.latitude,
//           lng: point.location.longitude
//         }));
//         snappedPoints = snappedPoints.concat(snappedChunk);
//       }
//     }
//     return snappedPoints;
//   };

//   // Distance calculator
//   const getDistance = useCallback(() => {
//     const differentInTime = (new Date() - initialDate) / 1000; // seconds
//     return differentInTime * velocity;
//   }, [initialDate, velocity]);

//   // Function to move the marker along the path
//   const moveObject = useCallback(() => {
//     const distance = getDistance();
//     if (!distance) return;

//     let progress = path.filter(coordinates => coordinates.distance < distance);
//     const nextLine = path.find(coordinates => coordinates.distance > distance);

//     if (!nextLine) {
//       setProgress(progress);
//       window.clearInterval(intervalId);
//       console.log("Trip Completed!! Thank You!!");
//       return;
//     }

//     const lastLine = progress[progress.length - 1];
//     const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
//     const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

//     const totalDistance = nextLine.distance - lastLine.distance;
//     const percentage = (distance - lastLine.distance) / totalDistance;

//     const position = window.google.maps.geometry.spherical.interpolate(
//       lastLineLatLng,
//       nextLineLatLng,
//       percentage
//     );

//     // Update the progress and re-center the map
//     setProgress(progress.concat(position));
//     setMapCenter({ lat: position.lat(), lng: position.lng() });

//     const angle = window.google.maps.geometry.spherical.computeHeading(
//       lastLineLatLng,
//       nextLineLatLng
//     );
//     const actualAngle = angle - 90;
//     const marker = document.querySelector(`[src="${icon1.url}"]`);

//     if (marker) {
//       marker.style.transform = `rotate(${actualAngle}deg)`;
//     }
//   }, [intervalId, path, getDistance, icon1.url]);

//   // Function to calculate the path distance and snap to roads
//   const calculatePath = useCallback(async () => {
//     const snappedPath = await snapToRoads(path); // Snap the path to roads
//     snappedPath.forEach((coordinates, i, array) => {
//       if (i === 0) {
//         coordinates.distance = 0;
//       } else {
//         const { lat: lat1, lng: lng1 } = coordinates;
//         const latLong1 = new window.google.maps.LatLng(lat1, lng1);
//         const { lat: lat2, lng: lng2 } = array[i - 1];
//         const latLong2 = new window.google.maps.LatLng(lat2, lng2);

//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);
//         coordinates.distance = distance + array[i - 1].distance;
//       }
//     });
//   }, [path]);

//   // Start the simulation when the button is clicked
//   const startSimulation = useCallback(() => {
//     if (intervalId) window.clearInterval(intervalId);
//     setProgress(null);
//     initialDate = new Date();
//     calculatePath();
//     const newIntervalId = window.setInterval(moveObject, 1000);
//     setIntervalId(newIntervalId);
//   }, [intervalId, calculatePath, moveObject]);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={startSimulation}
//         >
//           Start Simulation
//         </button>
//       </div>

//       <div className="w-full h-[500px]">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={mapCenter} // Update center dynamically to follow the marker
//           options={{
//             streetViewControl: false,  // Disable street view control
//             mapTypeControl: false,     // Disable map type control
//             fullscreenControl: false,  // Disable fullscreen control
//             zoomControl: true,         // Enable zoom control
//           }}
//         >
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#0088FF",
//               strokeWeight: 6,
//               strokeOpacity: 0.6,
//             }}
//           />

//           {/* Marker for the start point */}
//           <Marker position={firstPoint} />

//           {/* Marker for the destination point */}
//           <Marker position={lastPoint} />

//           {/* Progress Polyline and Moving Marker */}
//           {progress && (
//             <>
//               <Polyline path={progress} options={{ strokeColor: "orange" }} />
//               <Marker icon={icon1} position={progress[progress.length - 1]} />
//             </>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default Map;


// import { useState, useCallback } from 'react';
// import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';
// import DriverImage from '../../assets/DriverIcon.png';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// // Starting center of the map
// const initialCenter = {
//   lat: 30.762812162720632,
//   lng: 76.6309169972107
// };

// // Example: Decoding the encoded polyline string
// const encodedPolyline = "ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE"; // Your polyline string

// const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// // Get the first and last coordinates
// const firstPoint = path[0];
// const lastPoint = path[path.length - 1];

// const Map = () => {
//   const [progress, setProgress] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const [mapCenter, setMapCenter] = useState(initialCenter); // To dynamically update the center
//   const velocity = 27; // 100km per hour, for simulation purposes.
//   let initialDate;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: '' // Replace with your actual API key
//   });

//   const icon1 = {
//     url: DriverImage,
//     scaledSize: new window.google.maps.Size(40, 40),
//     anchor: new window.google.maps.Point(20, 20),
//   };


//   const chunkArray = (arr, chunkSize) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += chunkSize) {
//       result.push(arr.slice(i, i + chunkSize));
//     }
//     return result;
//   };

//   // Function to make API request to Roads API and snap to nearest road
//   const snapToRoads = async (path) => {
//     const chunkedPaths = chunkArray(path, 100); // Split path into chunks of 100 points
//     let snappedPoints = [];

//     for (let i = 0; i < chunkedPaths.length; i++) {
//       const pathStr = chunkedPaths[i].map(coord => `${coord.lat},${coord.lng}`).join('|');
//       const response = await fetch(
//         `https://roads.googleapis.com/v1/snapToRoads?path=${pathStr}&interpolate=true&key=`
//       );
//       const data = await response.json();

//       if (data.snappedPoints) {
//         const snappedChunk = data.snappedPoints.map(point => ({
//           lat: point.location.latitude,
//           lng: point.location.longitude
//         }));
//         snappedPoints = snappedPoints.concat(snappedChunk);
//       } else {
//         console.error("Error snapping points:", data);
//       }
//     }
//     return snappedPoints;
//   };

  

//   // Distance calculator
//   const getDistance = useCallback(() => {
//     const differentInTime = (new Date() - initialDate) / 1000; // seconds
//     return differentInTime * velocity;
//   }, [initialDate, velocity]);

//   // Function to move the marker along the path
//   const moveObject = useCallback(() => {
//     const distance = getDistance();
//     if (!distance) return;

//     let progress = path.filter(coordinates => coordinates.distance < distance);
//     const nextLine = path.find(coordinates => coordinates.distance > distance);

//     if (!nextLine) {
//       setProgress(progress);
//       window.clearInterval(intervalId);
//       console.log("Trip Completed!! Thank You!!");
//       return;
//     }

//     const lastLine = progress[progress.length - 1];
//     const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
//     const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

//     const totalDistance = nextLine.distance - lastLine.distance;
//     const percentage = (distance - lastLine.distance) / totalDistance;

//     const position = window.google.maps.geometry.spherical.interpolate(
//       lastLineLatLng,
//       nextLineLatLng,
//       percentage
//     );

    
//     // Update the progress and re-center the map
//     setProgress(progress.concat(position));
//     setMapCenter({ lat: position.lat(), lng: position.lng() });

//     const angle = window.google.maps.geometry.spherical.computeHeading(
//       lastLineLatLng,
//       nextLineLatLng
//     );
//     const actualAngle = angle - 90;
//     const marker = document.querySelector(`[src="${icon1.url}"]`);

//     if (marker) {
//       marker.style.transform = `rotate(${actualAngle}deg)`;
//     }
//   }, [intervalId, path, getDistance, icon1.url]);

//   // Function to calculate the path distance
//   const calculatePath = useCallback(async () => {
//     const snappedPath = await snapToRoads(path); // Snap the path to roads
//     snappedPath.forEach((coordinates, i, array) => {
//       if (i === 0) {
//         coordinates.distance = 0;
//       } else {
//         const { lat: lat1, lng: lng1 } = coordinates;
//         const latLong1 = new window.google.maps.LatLng(lat1, lng1);
//         const { lat: lat2, lng: lng2 } = array[i - 1];
//         const latLong2 = new window.google.maps.LatLng(lat2, lng2);

//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);
//         coordinates.distance = distance + array[i - 1].distance;
//       }
//     });
//   }, [path]);

//   // Start the simulation when the button is clicked
//   const startSimulation = useCallback(() => {
//     if (intervalId) window.clearInterval(intervalId);
//     setProgress(null);
//     initialDate = new Date();
//     calculatePath();
//     const newIntervalId = window.setInterval(moveObject, 1000);
//     setIntervalId(newIntervalId);
//   }, [intervalId, calculatePath, moveObject]);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={startSimulation}
//         >
//           Start Simulation
//         </button>
//       </div>

//       <div className="w-full h-[500px]">
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={mapCenter} // Update center dynamically to follow the marker
//           options={{
//             streetViewControl: false,  // Disable street view control
//             mapTypeControl: false,     // Disable map type control
//             fullscreenControl: false,  // Disable fullscreen control
//             zoomControl: true,         // Enable zoom control
//           }}
//         >
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: "#0088FF",
//               strokeWeight: 6,
//               strokeOpacity: 0.6,
//             }}
//           />

//           {/* Marker for the start point */}
//           <Marker position={firstPoint} />

//           {/* Marker for the destination point */}
//           <Marker position={lastPoint} />

//           {/* Progress Polyline and Moving Marker */}
//           {progress && (
//             <>
//               <Polyline path={progress} options={{ strokeColor: "orange" }} />
//               <Marker icon={icon1} position={progress[progress.length - 1]} />
//             </>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default Map;

// import { useState, useCallback, useEffect } from 'react';
// import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
// import polyline from '@mapbox/polyline';
// import DriverImage from '../../assets/DriverIcon.png';

// const containerStyle = {
//   width: '100%',
//   height: '400px',
// };

// // Starting center of the map
// const initialCenter = {
//   lat: 30.762812162720632,
//   lng: 76.6309169972107,
// };

// // Example: Decoding the encoded polyline string
// const encodedPolyline =
//   'ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE'; // Your polyline string

// const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// // Get the first and last coordinates
// const firstPoint = path[0];
// const lastPoint = path[path.length - 1];

// const Map = () => {
//   const [progress, setProgress] = useState(null);
//   const [intervalId, setIntervalId] = useState(null);
//   const [mapCenter, setMapCenter] = useState(initialCenter); // To dynamically update the center
//   const velocity = 27; // 100km per hour, for simulation purposes.
//   let initialDate;

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: '', // Replace with your actual API key
//   });

//   const icon1 = {
//     url: DriverImage,
//     scaledSize: new window.google.maps.Size(40, 40),
//     anchor: new window.google.maps.Point(20, 20),
//   };

//   const chunkArray = (arr, chunkSize) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += chunkSize) {
//       result.push(arr.slice(i, i + chunkSize));
//     }
//     return result;
//   };

//   // Function to make API request to Roads API and snap to nearest road
//   const snapToRoads = async (path) => {
//     const chunkedPaths = chunkArray(path, 100); // Split path into chunks of 100 points
//     let snappedPoints = [];

//     for (let i = 0; i < chunkedPaths.length; i++) {
//       const pathStr = chunkedPaths[i].map((coord) => `${coord.lat},${coord.lng}`).join('|');
//       const response = await fetch(
//         `https://roads.googleapis.com/v1/snapToRoads?path=${pathStr}&interpolate=true&key=`
//       );
//       const data = await response.json();

//       if (data.snappedPoints) {
//         const snappedChunk = data.snappedPoints.map((point) => ({
//           lat: point.location.latitude,
//           lng: point.location.longitude,
//         }));
//         snappedPoints = snappedPoints.concat(snappedChunk);
//       } else {
//         console.error('Error snapping points:', data);
//       }
//     }
//     return snappedPoints;
//   };

//   // Distance calculator
//   useEffect(() => {
//     if (progress) {
//       console.log("Progress Updated: ", progress);
//     }
//   }, [progress]);
  
//   const getDistance = useCallback(() => {
//     if (!initialDate) {
//       console.error("Initial date is not set");
//       return 0;
//     }
//     const differentInTime = (new Date() - initialDate) / 1000; // seconds
//     const distance = differentInTime * velocity;
//     console.log("Calculated distance: ", distance);
//     return distance;
//   }, [initialDate, velocity]);

//   // Function to move the marker along the path
//   const moveObject = useCallback(
//     (currentPath) => {  // Accept path as an argument
//       const distance = getDistance();
//       if (!distance) return;
  
//       let progress = currentPath.filter((coordinates) => coordinates.distance < distance);
//       const nextLine = currentPath.find((coordinates) => coordinates.distance > distance);
  
//       if (!nextLine) {
//         setProgress(progress);
//         window.clearInterval(intervalId);
//         console.log('Trip Completed!! Thank You!!');
//         return;
//       }
  
//       const lastLine = progress[progress.length - 1];
//       const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
//       const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);
  
//       const totalDistance = nextLine.distance - lastLine.distance;
//       const percentage = (distance - lastLine.distance) / totalDistance;
  
//       const position = window.google.maps.geometry.spherical.interpolate(
//         lastLineLatLng,
//         nextLineLatLng,
//         percentage
//       );
  
//       // Update the progress and re-center the map together
//       setProgress((prevProgress) => {
//         const updatedProgress = prevProgress ? prevProgress.concat(position) : [position];
//         setMapCenter({ lat: position.lat(), lng: position.lng() });
//         return updatedProgress;
//       });
  
//       // Rotate the marker based on heading
//       const angle = window.google.maps.geometry.spherical.computeHeading(
//         lastLineLatLng,
//         nextLineLatLng
//       );
//       const actualAngle = angle - 90;
//       const marker = document.querySelector(`[src="${icon1.url}"]`);
  
//       if (marker) {
//         marker.style.transform = `rotate(${actualAngle}deg)`;
//       }
//     },
//     [intervalId, getDistance, icon1.url]
//   );
  
 
//   const calculatePath = useCallback(async () => {
//     const snappedPath = await snapToRoads(path); // Snap the path to roads
//     snappedPath.forEach((coordinates, i, array) => {
//       console.log('coordinates, i, array',coordinates, i, array);
//       if (i === 0) {
//         coordinates.distance = 0;
//       } else {
//         const { lat: lat1, lng: lng1 } = coordinates;
//         const latLong1 = new window.google.maps.LatLng(lat1, lng1);
//         const { lat: lat2, lng: lng2 } = array[i - 1];
//         const latLong2 = new window.google.maps.LatLng(lat2, lng2);
  
//         // Calculate distance between the current point and the previous one
//         const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
//           latLong1,
//           latLong2
//         );
//         coordinates.distance = distance + array[i - 1].distance;
//       }
//     });
//     // Log snapped path for debugging
//     console.log("Snapped Path with Distances: ", snappedPath);
//     return snappedPath;
//   }, [path]);
  

//   // Start the simulation when the button is clicked
//   const startSimulation = useCallback(async () => {
//     if (intervalId) window.clearInterval(intervalId);
//     setProgress(null);
  
//     // Set the initial start time
//     initialDate = new Date();
  
//     // Ensure the path is fully calculated before starting the simulation
//     const snappedPath = await calculatePath();
  
//     const newIntervalId = window.setInterval(() => {
//       moveObject(snappedPath);  // Pass the snappedPath into moveObject
//     }, 1000);
  
//     setIntervalId(newIntervalId);
//   }, [intervalId, calculatePath, moveObject]);
  
//   // Cleanup interval when the component unmounts
//   useEffect(() => {
//     return () => {
//       if (intervalId) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [intervalId]);

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
//       <div className="mb-4">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//           onClick={startSimulation}
//         >
//           Start Simulation
//         </button>
//       </div>

//       <div className="w-full h-[500px]">
//         {/* <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={mapCenter} // Update center dynamically to follow the marker
//           options={{
//             streetViewControl: false, // Disable street view control
//             mapTypeControl: false, // Disable map type control
//             fullscreenControl: false, // Disable fullscreen control
//             zoomControl: true, // Enable zoom control
//           }}
//         >
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: '#0088FF',
//               strokeWeight: 6,
//               strokeOpacity: 0.6,
//             }}
//           />

//           <Marker position={firstPoint} />

//           <Marker position={lastPoint} />

//           {progress && (
//             <>
//               <Polyline path={progress} options={{ strokeColor: 'orange' }} />
//               <Marker icon={icon1} position={progress[progress.length - 1]} />
//             </>
//           )}
//         </GoogleMap> */}
//           <GoogleMap
//           mapContainerStyle={containerStyle}
//           zoom={17}
//           center={mapCenter} 
//           options={{
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//             zoomControl: true,
//           }}
//         >
//           {/* Render traveled path in grey */}
//           <Polyline
//             path={progress} 
//             options={{
//               strokeColor: '#ff0000', // Grey color for traveled path
//               strokeWeight: 6,
//               strokeOpacity: 6,
//             }}
//           />

//           {/* Render remaining path */}
//           <Polyline
//             path={path}
//             options={{
//               strokeColor: '#0088FF', // Blue color for remaining path
//               strokeWeight: 6,
//               strokeOpacity: 0.6,
//             }}
//           />

//           {/* Marker for the start point */}
//           <Marker position={firstPoint} />

//           {/* Marker for the destination point */}
//           <Marker position={lastPoint} />

//           {/* Moving Marker */}
//           {progress?.length > 0 && (
//             <Marker icon={icon1} position={progress[progress.length - 1]} />
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default Map;



// ! Correct code

import { useState, useCallback } from 'react';
import { GoogleMap, Polyline, Marker, useJsApiLoader } from '@react-google-maps/api';
import polyline from '@mapbox/polyline';
import DriverImage from '../../assets/DriverIcon.png';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Starting center of the map
const initialCenter = {
  lat: 30.762812162720632,
  lng: 76.6309169972107
};

// Example: Decoding the encoded polyline string
const encodedPolyline = "ajwzDq}urMRQj@j@jIyFRKTK~C{Bf@e@t@c@jDuBdEsCbEyDLTx@o@z@m@jCkBzCiCvHiHvGmGzEsEp@aA`@w@La@d@_Bh@oCdAmFv@{DfAsFl@eCd@sA`@aAp@qAxAmCt@uApEiIfBaDl@{A`@sA\\yARcAhAmJ`BkMxBwOTkDAuJHiDPgCh@yFPaB~@qJr@iGD_@AOGSDU\\uB^gCpBmL\\{ANs@hAgFz@Pv@FlDDhMPlEGtE]zDg@fDo@bBa@dAa@z@g@lB{AtWsWlHaHzD}DxB{B|CcD`CaCbJgJx@q@hByApA}@pLgIjDgCdDoCdBqAlAaAtC_CtN_LlFiEjGwEdArBn@nAfHpMxDlHj@dA^f@dBdDxAzCwC|BuBfB_FxD_JwPmA~@kAyByAoCmFnE"; // Your polyline string

const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));

// Get the first and last coordinates
const firstPoint = path[0];
const lastPoint = path[path.length - 1];

const Map = () => {
  const [progress, setProgress] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [mapCenter, setMapCenter] = useState(initialCenter); // To dynamically update the center
  const velocity = 27; // 100km per hour, for simulation purposes.
  let initialDate;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: '' // Replace with your actual API key
  });

  const icon1 = {
    url: DriverImage,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
  };

  // Distance calculator
  const getDistance = useCallback(() => {
    const differentInTime = (new Date() - initialDate) / 1000; // seconds
    return differentInTime * velocity;
  }, [initialDate, velocity]);

  // Function to move the marker along the path
  const moveObject = useCallback(() => {
    const distance = getDistance();
    if (!distance) return;

    let progress = path.filter(coordinates => coordinates.distance < distance);
    const nextLine = path.find(coordinates => coordinates.distance > distance);

    if (!nextLine) {
      setProgress(progress);
      window.clearInterval(intervalId);
      console.log("Trip Completed!! Thank You!!");
      return;
    }

    const lastLine = progress[progress.length - 1];
    const lastLineLatLng = new window.google.maps.LatLng(lastLine.lat, lastLine.lng);
    const nextLineLatLng = new window.google.maps.LatLng(nextLine.lat, nextLine.lng);

    const totalDistance = nextLine.distance - lastLine.distance;
    const percentage = (distance - lastLine.distance) / totalDistance;

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    );

    
    // Update the progress and re-center the map
    setProgress(progress.concat(position));
    setMapCenter({ lat: position.lat(), lng: position.lng() });

    const angle = window.google.maps.geometry.spherical.computeHeading(
      lastLineLatLng,
      nextLineLatLng
    );
    const actualAngle = angle - 90;
    const marker = document.querySelector(`[src="${icon1.url}"]`);

    if (marker) {
      marker.style.transform = `rotate(${actualAngle}deg)`;
    }
  }, [intervalId, path, getDistance, icon1.url]);

  // Function to calculate the path distance
  const calculatePath = useCallback(() => {
    path.forEach((coordinates, i, array) => {
      if (i === 0) {
        coordinates.distance = 0;
      } else {
        const { lat: lat1, lng: lng1 } = coordinates;
        const latLong1 = new window.google.maps.LatLng(lat1, lng1);
        const { lat: lat2, lng: lng2 } = array[i - 1];
        const latLong2 = new window.google.maps.LatLng(lat2, lng2);
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(latLong1, latLong2);
        coordinates.distance = distance + array[i - 1].distance;
      }
    });
  }, [path]);

  // Start the simulation when the button is clicked
  const startSimulation = useCallback(() => {
    if (intervalId) window.clearInterval(intervalId);
    setProgress(null);
    initialDate = new Date();
    calculatePath();
    const newIntervalId = window.setInterval(moveObject, 1000);
    setIntervalId(newIntervalId);
  }, [intervalId, calculatePath, moveObject]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={startSimulation}
        >
          Start Simulation
        </button>
      </div>

      <div className="w-full h-[500px]">
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={17}
          center={mapCenter} // Update center dynamically to follow the marker
          options={{
            streetViewControl: false,  // Disable street view control
            mapTypeControl: false,     // Disable map type control
            fullscreenControl: false,  // Disable fullscreen control
            zoomControl: true,         // Enable zoom control
          }}
        >
          <Polyline
            path={path}
            options={{
              strokeColor: "#0088FF",
              strokeWeight: 6,
              strokeOpacity: 0.6,
            }}
          />
    

          {/* Marker for the start point */}
          <Marker position={firstPoint} />

          {/* Marker for the destination point */}
          <Marker position={lastPoint} />

          {/* Progress Polyline and Moving Marker */}
          {progress && (
            <>
              <Polyline path={progress} 
               options={{ strokeColor: "#808080", strokeWeight: 6, strokeOpacity: 0 }} // Invisible polyline
               />
              <Marker icon={icon1} position={progress[progress.length - 1]} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;