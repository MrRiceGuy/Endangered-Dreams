// script.js

document.addEventListener('DOMContentLoaded', function() {
    const logInput = document.getElementById('logInput');
    const saveButton = document.getElementById('saveButton');
    const logEntriesContainer = document.getElementById('logEntries');

    // Load log entries when the page is loaded
    loadLogEntries();

    // Function to load log entries
    function loadLogEntries() {
        // Clear existing log entries
        logEntriesContainer.innerHTML = '';

        // Fetch log entries from the server
        fetch('/api/logs')
            .then(response => response.json())
            .then(data => {
                // Reverse the order of log entries
                const reversedLogs = data.logs.reverse();
                // Create a div element for the log entries
                const entriesDiv = document.createElement('div');
                // Preserve new lines and spaces using CSS white-space property
                entriesDiv.style.whiteSpace = 'pre-line';
                // Join the reversed log entries with newline characters
                entriesDiv.textContent = reversedLogs.join('\n');
                // Append the entries div to the log entries container
                logEntriesContainer.appendChild(entriesDiv);
            })
            .catch(error => console.error('Error fetching log entries:', error));
    }

    // Function to save log entry
    function saveLogEntry() {
        const logText = logInput.value.trim();
        if (logText === '') {
            alert('Please enter a log entry.');
            return;
        }

        // Send log entry to the server
        fetch('/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ log: logText })
        })
        .then(response => {
            if (response.ok) {
                // Clear the log input field
                logInput.value = '';
                // Reload log entries
                loadLogEntries();
            } else {
                console.error('Failed to save log entry:', response.statusText);
                alert('Failed to save log entry. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error saving log entry:', error);
            alert('Failed to save log entry. Please try again.');
        });
    }

    // Event listener for the save button
    saveButton.addEventListener('click', saveLogEntry);
});
