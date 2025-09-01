const express = require('express');
const fetch = require('node-fetch').default; // Corrected import
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const AZURE_FUNCTION_URL = "https://chrome-ext-timelogger-dbc8ctcbe8f7gpc4.centralindia-01.azurewebsites.net/api";

// Use CORS middleware to allow your extension to make requests to the proxy
app.use(cors({
  origin: 'chrome-extension://gjbkecdnojcclholeecialklefnjikcj'
}));

app.use(express.json());

// Proxy endpoint for getLogs
app.get('/api/getLogs', async (req, res) => {
  const { date, developer } = req.query;
  const url = `${AZURE_FUNCTION_URL}/getLogs?date=${date}&developer=${developer}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error for getLogs:", error);
    res.status(500).json({ error: 'Failed to fetch logs from Azure Function.' });
  }
});

// Proxy endpoint for addLog
app.post('/api/addLog', async (req, res) => {
  const url = `${AZURE_FUNCTION_URL}/addLog`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error for addLog:", error);
    res.status(500).json({ error: 'Failed to add log to Azure Function.' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});