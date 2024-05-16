// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const LOG_FILE_PATH = path.join(__dirname, 'log.json');

// Endpoint to save log entries
app.post('/api/logs', (req, res) => {
    const { log } = req.body;
    if (log === undefined) {
        return res.status(400).json({ error: 'Log entry is required.' });
    }

    // Load existing log entries from log.json file
    fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).json({ error: 'Failed to read log file.' });
        }

        let logEntries = [];
        if (data) {
            try {
                logEntries = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing log file:', parseError);
                return res.status(500).json({ error: 'Failed to parse log file.' });
            }
        }

        // Append new log entry
        logEntries.push(log);

        // Write updated log entries to log.json file
        fs.writeFile(LOG_FILE_PATH, JSON.stringify(logEntries, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to log file:', writeErr);
                return res.status(500).json({ error: 'Failed to save log entry.' });
            }
            res.status(201).json({ message: 'Log entry saved successfully.' });
        });
    });
});

// Endpoint to retrieve log entries
app.get('/api/logs', (req, res) => {
    fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).json({ error: 'Failed to read log file.' });
        }

        let logEntries = [];
        if (data) {
            try {
                logEntries = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing log file:', parseError);
                return res.status(500).json({ error: 'Failed to parse log file.' });
            }
        }

        res.json({ logs: logEntries });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
