const fs = require('fs');
const path = require('path');

// Path to the dictionaryData.json file
const filePath = path.join(__dirname, '../assets', 'dicts', 'dictionaryData.json');

// Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let dictionaryData;
  try {
    dictionaryData = JSON.parse(data);
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
    return;
  }

  // Process the data
  const processedData = dictionaryData.map(item => {
    if (item[4] && Array.isArray(item[4])) {
        item[4] = item[4][item[4].length - 1]; // get the last item only
    }
    return item;
  });

  // Write the modified data back to the JSON file
  fs.writeFile(filePath, JSON.stringify(processedData, null, 0), 'utf8', writeErr => {
    if (writeErr) {
      console.error('Error writing the file:', writeErr);
      return;
    }
    console.log('File has been successfully processed and saved.');
  });
});
