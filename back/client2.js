const io = require('socket.io-client');

const clientId = 'clxyni8yz000239eshu5zeq40'; // Unique ID for the client
const clientToken =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHluaTh5ejAwMDIzOWVzaHU1emVxNDAiLCJlbWFpbCI6ImFydGh1cnNpbHZhLnJzMEBnbWFpbC5jb20iLCJyb2xlIjoxLCJuYW1lIjoiQXJ0aHVyMCIsImlhdCI6MTcxOTU3NjYxMSwiZXhwIjoxNzIwMTgxNDExLCJhdWQiOiJwcm9maWxlIiwiaXNzIjoid29ya291dHMtYXV0aC1zeXN0ZW0iLCJzdWIiOiJjbHh5bmk4eXowMDAyMzllc2h1NXplcTQwIn0.chLb_isRArvVBP-HRvsb2pFFOK-lTapL_FC4WlsNDDI"

const socket = io('http://localhost:3001', {
  query: { clientId, clientToken },
});

socket.on('message', (message) => {
  console.log('Received message:', message);
});

socket.emit('message', { to: 'clxyngu5b000039esievzz84b', message: 'Sending this one', sensible: true});
