const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const port = 3001;

app.use(cors()); // Add this line to enable CORS

app.use(express.json());

let bandwidthData = [];
let userLimit = 0;

// Route zum Abrufen von Bandbreitendaten
app.get('/api/bandwidth-data', (req, res) => {
  res.json(bandwidthData);
});

// Route zum Speichern des Bandbreitenlimits
app.post('/api/save-limit', (req, res) => {
  userLimit = req.body.limit;
  res.status(200).send('Limit gespeichert');
});

let prevReceivedBytes = 0;
let prevSentBytes = 0;
let prevTimestamp = new Date();

// Funktion zum Abrufen der Netzwerkdaten
const getBandwidthData = () => {
  exec('powershell.exe Get-NetAdapterStatistics', (error, stdout, stderr) => {
    const lines = stdout.split('\n');
    const line = lines.find(line => line.includes('Ethernet'));
    const parts = line.split(/\s+/);
    const name = lines;

    const receivedBytes  = parseInt(parts[1]) || 0;
    const sentBytes = parseInt(parts[3]) || 0  ;
    
    const timestamp = new Date().getTime();
    const timeDiffInSeconds = ((timestamp) - prevTimestamp) / 1000;
    const readableTimestamp = new Date(timestamp).toLocaleString();

    const downloadMbps = ((receivedBytes - prevReceivedBytes) * 8) / (timeDiffInSeconds * 100000);
    const uploadMbps = ((sentBytes - prevSentBytes) * 8) / (timeDiffInSeconds * 100000);

    prevReceivedBytes = receivedBytes;
    prevSentBytes = sentBytes;
    prevTimestamp = timestamp;

    if (downloadMbps > 20 || uploadMbps > 20) {
      return;
    }
    bandwidthData.push({
      readableTimestamp,
      downloadMbps,
      uploadMbps,
    }); 
  });
};

setInterval(getBandwidthData, 1000);

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
