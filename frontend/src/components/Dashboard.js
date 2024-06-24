import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
const Dashboard = () => {
  const [bandwidthData, setBandwidthData] = useState([]);

  useEffect(() => {
    // API-Aufruf zum Abrufen von Bandbreitendaten
    axios.get('http://localhost:3001/api/bandwidth-data')
      .then(response => {
        setBandwidthData(response.data);
      })
      .catch(error => {
        console.error('Es gab ein Problem beim Abrufen der Daten', error);
      });
  }, [bandwidthData]);

  const calculateMedian = (values) => {
    if (values.length === 0) return 0;
    const sortedValues = [...values].sort((a, b) => a - b);
    const half = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2) {
      return sortedValues[half];
    }

    return (sortedValues[half - 1] + sortedValues[half]) / 2.0;
  };
  const medianDownloadMbps = calculateMedian(bandwidthData.map(entry => entry.downloadMbps)).toFixed(2);

  const data = {
    labels: bandwidthData.map(entry => entry.readableTimestamp),
    datasets: [{
      label: 'Downloadgeschwindigkeit (Mbps)',
      data: bandwidthData.map(entry => entry.downloadMbps),
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    }],
  };

  return (
    <div>
      <h1>Downloadgeschwindigkeit</h1>
      <p>Median der Downloadgeschwindigkeit: {medianDownloadMbps} Mbps</p>
      <Line data={data} />
    </div>
  );
}

export default Dashboard;
