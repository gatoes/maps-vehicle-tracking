# Google Maps Vehicle Simulation
This project demonstrates how to simulate vehicle movement on a Google Map using `@react-google-maps/api` and Google Maps geometry utilities. The vehicle moves along a predefined polyline path, and its marker dynamically updates its position and orientation as it moves.

### Features
- Polyline Path: Display a polyline route on the map.
- Start and End Markers: Mark the start and end of the route.
- Vehicle Simulation: The vehicle marker moves along the polyline at a specified speed.
- Dynamic Rotation: The vehicle's marker rotates to face the direction of movement.
- Custom Marker Icons: The vehicle marker is represented by a car icon.

### Technologies Used
- React
- `@react-google-maps/api`
- `@mapbox/polyline`
- Google Maps Geometry library

### Installation
1. Clone the repository

```javascript
git clone https://github.com/your-username/google-maps-vehicle-simulation.git
cd google-maps-vehicle-simulation
```
# 2. Install dependencies
Make sure you have Node.js installed. Run the following command to install the necessary dependencies:

```bash
npm install
```

# 3. Get a Google Maps API Key
You'll need to obtain a Google Maps API key to use the Google Maps services in this project.

Go to the Google Cloud Console.
Create a new project (if needed).
Go to the API & Services section.
Enable the Maps JavaScript API and Places API.
Generate an API key.
# 4. Set up the API Key
In the code, replace the placeholder with your actual Google Maps API key:

```javascript
const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
});
```
### 5. Run the Application
Once you've set up the API key, start the development server:

```bash
npm start
```

### Usage
- The map will load, displaying the polyline route.
- Click on the Start Simulation button to start moving the vehicle from the origin to the destination along the polyline path.
- The vehicle marker will rotate as it follows the path and will stop once it reaches the destination.
Code Explanation
### 1. Polyline Path
The polyline path is represented as an encoded string, which is decoded using the `@mapbox/polyline` package. The decoded coordinates are then used to plot the polyline on the map.

```javascript
const path = polyline.decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }));
```
### 2. Vehicle Movement
The vehicle's position is updated at a set interval, and its movement is calculated based on the time elapsed since the simulation started. The setInterval function moves the vehicle along the polyline, and the vehicle's orientation is adjusted to match the direction of movement.

```javascript
const moveObject = () => {
  const distance = getDistance();
  // Update position and progress
};
```
### 3. Marker Rotation
 
To rotate the vehicle marker, the computeHeading function from the Google Maps Geometry library is used to calculate the angle between the vehicle's current position and the next position. The marker is then rotated using a CSS transformation.

```javascript 
const angle = window.google.maps.geometry.spherical.computeHeading(lastLineLatLng, nextLineLatLng); marker.style.transform = rotate(${actualAngle}deg);
 ```
## Configuration

You can adjust the following parameters in the code:

- **Vehicle Speed**: Modify the `velocity` variable to set the speed of the vehicle.
- **Polyline Path**: Change the `encodedPolyline` string to simulate different routes.
- **Marker Icon**: Customize the marker by changing the `icon1` URL.


### Dependencies

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)**: A lightweight library for integrating Google Maps into React applications.
- **[@mapbox/polyline](https://www.npmjs.com/package/@mapbox/polyline)**: A utility to encode and decode Google Maps polylines.
- **[Google Maps Geometry Library](https://developers.google.com/maps/documentation/javascript/geometry)**: Provides utilities for spatial operations such as distance and heading calculation.


- [@mapbox/polyline]: A utility to encode and decode Google Maps polylines.
- Google Maps Geometry Library: Provides utilities for spatial operations such as distance and heading calculation.
