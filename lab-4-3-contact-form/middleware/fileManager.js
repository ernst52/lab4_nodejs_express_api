const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
const ensureDataDir = async () => {
    try {
        await fs.access(DATA_DIR);
    } catch (error) {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
};

// Read JSON file
const readJsonFile = async (filename) => {
    try {
        await ensureDataDir();
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file does not exist, return empty array
        return [];
    }
};

// Write JSON file
const writeJsonFile = async (filename, data) => {
    try {
        await ensureDataDir();
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing file:', error);
        return false;
    }
};

// Append data to JSON file
const appendToJsonFile = async (filename, newData) => {
    try {
        const existingData = await readJsonFile(filename);

        // Add ID and timestamp
        const dataWithId = {
            id: Date.now(),
            ...newData,
            createdAt: new Date().toISOString()
        };

        existingData.push(dataWithId);
        await writeJsonFile(filename, existingData);
        return dataWithId;
    } catch (error) {
        console.error('Error appending to file:', error);
        return null;
    }
};

// Get file stats: number of records in each file
const getFileStats = async () => {
    await ensureDataDir();
    const files = ['contacts.json', 'feedback.json'];
    const stats = {};

    for (const file of files) {
        const data = await readJsonFile(file);
        stats[file] = data.length;
    }

    return stats;
};

module.exports = {
    readJsonFile,
    writeJsonFile,
    appendToJsonFile,
    getFileStats
};
