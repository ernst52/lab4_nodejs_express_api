const http = require('http');
const url = require('url');

const PORT = 3000;

// Mock student data
const students = [
    { id: 1, name: 'Chai Lepist', major: 'Computer Science', year: 2 },
    { id: 2, name: 'Lerfa Dolhit', major: 'Engineering', year: 3 },
    { id: 3, name: 'Charlie Lee', major: 'Mathematics', year: 1 },
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (method === 'GET' && pathname === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({
            message: 'Welcome to the Student API!',
            endpoints: [
                'GET /students',
                'GET /students/:id',
                'GET /students/major/:major'
            ]
        }));
    } else if (method === 'GET' && pathname === '/students') {
        res.writeHead(200);
        res.end(JSON.stringify(students));
    } else if (method === 'GET' && pathname.startsWith('/students/major/')) {
        const major = pathname.split('/')[3];
        const filtered = students.filter(s => s.major.toLowerCase() === major.toLowerCase());
        res.writeHead(200);
        res.end(JSON.stringify(filtered));
    } else if (method === 'GET' && pathname.startsWith('/students/')) {
        const id = parseInt(pathname.split('/')[2]);
        const student = students.find(s => s.id === id);
        if (student) {
            res.writeHead(200);
            res.end(JSON.stringify(student));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Student not found' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET /');
    console.log('  GET /students');
    console.log('  GET /students/:id');
    console.log('  GET /students/major/:major');
});
