import mysql from 'mysql2';
import { cars } from './xmlParser.js';

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


const CarDataCleanUp = async () => {
    const idsInXml = cars.map(car => parseInt(car.id)); // Get all the car IDs in the XML file

    // Get all the car IDs in the database
    const [rows] = await pool.query(`SELECT id FROM vehicles`);
    const idsInDb = rows.map(row => row.id);

    // Loop through each car ID in the database and check if it exists in the XML file
    for (const id of idsInDb) {
        if (!idsInXml.includes(id)) {
            // Car doesn't exist in the XML file anymore, delete it from the database
            const sql = `DELETE FROM vehicles WHERE id=${id}`;

            try {
                const connection = await pool.getConnection();
                const result = await connection.query(sql);
                connection.release();

                console.log(`Deleted car with ID ${id}`);
            } catch (err) {
                console.error(err);
            }
        }

    }
};



const addCar = async () => {
    for (const car of cars) {
        // Check if the car already exists in the database
        const [rows] = await pool.query(`SELECT * FROM vehicles WHERE id=${car.id}`);

        if (rows.length === 0) {
            // Car doesn't exist, insert it as a new row
            const sql = `INSERT INTO vehicles (id, make, model, car_type, manfyear, taxclass, taxper, vectype, price, currency, mileage, doors, cylvol, drvtype, grtype, grnumb, fltype, color, commcolor, regnro, regnat, regserial, vincode, faccode, bodytype, brksystem, alarmsystem, car_power, firstreg, lastinsp, warranty, warrantydesc, org, puhcnt, phone, email, note, acc, emiss, eueco, weight, tspeed, accel, trvolume, trailerw, seat, exstart, exend, cmpimg, cmpurl, pics, picsupd, city, agent, vanha)
                            VALUES (${car.id}, '${car.make}', '${car.model}', '${car.type}', ${car.manfyear}, '${car.taxclass}', '${car.taxper}', '${car.vectype}', ${car.price}, '${car.currency}', ${car.mileage}, ${car.doors}, '${car.cylvol}', '${car.drvtype}', '${car.grtype}', ${car.grnumb}, '${car.fltype}', '${car.color}', '${car.commcolor}', '${car.regnro}', '${car.regnat}', '${car.regserial}', '${car.vincode}', '${car.faccode}', '${car.bodytype}', '${car.brksystem}', '${car.alarmsystem}', '${car.power}', '${car.firstreg}', '${car.lastinsp}', '${car.warranty}', '${car.warrantydesc}', '${car.org}', '${car.puhcnt}', '${car.phone}', '${car.email}', '${car.note}', '${car.acc}', ${car.emiss}, '${car.eueco}', ${car.weight}, ${car.tspeed}, '${car.accel}', '${car.trvolume}', ${car.trailerw}, ${car.seat}, '${car.exstart}', '${car.exend}', '${car.cmpimg}', '${car.cmpurl}', '${car.pics}', '${car.picsupd}', '${car.city}', '${car.agent}', ${car.vanha})`;

            try {
                const connection = await pool.getConnection();
                const result = await connection.query(sql);
                connection.release();

                console.log(`Inserted car with ID ${car.id}`);
            } catch (err) {
                console.error(err);
            }
        }
    }
};




await CarDataCleanUp();
await addCar();
