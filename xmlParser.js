import fs from 'fs';
import xml2js from 'xml2js';

// Read the XML data from a file
const xmlData = fs.readFileSync('autot.xml');
export let cars;

// Parse the XML data using xml2js
const parser = xml2js.parseString(xmlData, (err, result) => {
    if (err) {
        console.error(err);
    } else {
        // Extract the array of cars from the parsed result
        cars = result.cars.car;
    }
});

//console.log(cars);