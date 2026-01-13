import fs from 'fs';

export default function handler(req, res) {
    try {
      // Read the contents of data.txt
      const data = fs.readFileSync('./public/data.txt', 'utf8');
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error reading file' });
    }
  }
  