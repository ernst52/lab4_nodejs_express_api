const express = require('express');
const app = express();
const PORT = 3001;

// Mock student data
const students = [
    { id: 1, name: 'Chai Lepist', major: 'Computer Science', year: 2 },
    { id: 2, name: 'Lerfa Dolhit', major: 'Engineering', year: 3 },
    { id: 3, name: 'Charlie Lee', major: 'Mathematics', year: 1 },
];

// Middleware
app.use(express.json());

// GET / → welcome + endpoints
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Student API!',
        endpoints: [
            'GET /students',
            'GET /students/:id',
            'GET /students/major/:major',
            'GET /stats'
        ]
    });
});

// GET /students → all students
app.get('/students', (req, res) => {
    res.json(students);
});

// GET /students/:id → student by ID
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (student) res.json(student);
    else res.status(404).json({ error: 'Student not found' });
});

// GET /students/major/:major → filter by major
app.get('/students/major/:major', (req, res) => {
    const major = req.params.major.toLowerCase();
    const filtered = students.filter(s => s.major.toLowerCase() === major);
    res.json(filtered);
});

// GET /stats → some stats
app.get('/stats', (req, res) => {
    const total = students.length;
    const majorsCount = students.reduce((acc, s) => {
        acc[s.major] = (acc[s.major] || 0) + 1;
        return acc;
    }, {});
    res.json({ totalStudents: total, studentsPerMajor: majorsCount });
});

// 404 middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Express Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET /');
    console.log('  GET /students'); 
    console.log('  GET /students/:id');
    console.log('  GET /students/major/:major');
    console.log('  GET /stats');
});
