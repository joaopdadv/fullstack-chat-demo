const io = require('socket.io-client');

const clientId = 'clxyngu5b000039esievzz84b'; // Unique ID for the client
const clientToken =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseHluZ3U1YjAwMDAzOWVzaWV2eno4NGIiLCJlbWFpbCI6ImFydGh1cnNpbHZhLnJzMkBnbWFpbC5jb20iLCJyb2xlIjoxLCJuYW1lIjoiQXJ0aHVyMiIsImlhdCI6MTcxOTU3NjU2NCwiZXhwIjoxNzIwMTgxMzY0LCJhdWQiOiJwcm9maWxlIiwiaXNzIjoid29ya291dHMtYXV0aC1zeXN0ZW0iLCJzdWIiOiJjbHh5bmd1NWIwMDAwMzllc2lldnp6ODRiIn0.EfttxjJzmE09VMR7BubiScp3Zf0y3Z8r2dkoAGu2wFI"

const socket = io('http://localhost:3001', {
  query: { clientId, clientToken },
});

socket.on('message', (message) => {
  console.log('Received message:', message);
});

socket.emit('message', {
  to: 'clxyni8yz000239eshu5zeq40',
  message: 'Sending this two',
  sensible: false,
});
