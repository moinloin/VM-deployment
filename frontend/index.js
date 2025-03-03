const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Statische Dateien ausliefern (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Fallback für SPA-Routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Frontend running on: http://localhost:${PORT}`);
});
