"use strict"

const fs = require('fs');
const yargs = require("yargs");

function parkingSystem(fileData) {

    try {

        if (fileData.length === 0) {
            throw new Error('No data in file')
        }

        const systemCommands = ['create', 'park', 'leave', 'status'];
        const dataArray = fileData.split('\n');
        let parkings = []

        if (!Array.isArray(dataArray)) {
            throw new Error('Invalid input. Please check the input file.')
        }

        for (const command of dataArray) {

            const [action, info, time] = command.split(' ')

            if (action === systemCommands[0]) {

                parkings = makeParking(parkings, Number(info))

            } else if (action === systemCommands[1]) {

                allocateParking(parkings, info)

            } else if (action === systemCommands[2]) {

                if (!Number.isInteger(+time)) {
                    console.log(`${info} : Invalid time!`)
                } else {
                    const charge = calculateCharge(+time, 10, 10, 2)
                    leaveParking(parkings, info, charge)
                }

            } else if (action === systemCommands[3]) {

                displayStatus(parkings)
            } else {

                console.log(`${action} not a system command. Please make sure commands are one of these ${systemCommands.toString()}`)
            }
        }
    } catch (error) {
        console.error(error);
    }
}

const makeParking = (parkings = [], size) => {

    if (parkings.length === 0) {
        parkings = [...Array(size)]
        console.log(`Created parking lot with ${size} slots`)

    } else {
        let newParking = [...Array(size)]
        parkings = parkings.concat(newParking)
        console.log(`Created additional parking lot with ${size} slots`)
    }
    return parkings;
}

const calculateCharge = (time, basicCharge, additionalCharge, after) => time <= 1 ? basicCharge : basicCharge + (time - after) * additionalCharge

const displayStatus = (parkings) => {

    if (parkings.length > 0) {
        console.log('Slot No. Registration No.')

        for (let i = 0; i < parkings.length && parkings[i]; i++) {
            console.log(`${i + 1} ${parkings[i]}`)
        }
    } else {
        console.log('No data to display')
    }
}

const allocateParking = (parkings, carRegNo) => {

    const location = parkings.indexOf(undefined)

    if (location === -1) {
        console.log('Sorry, parking lot is full')
    } else {
        console.log(`Allocated slot number: ${location + 1}`)
        parkings[location] = carRegNo;
    }
}

const leaveParking = (parkings, carRegNo, charge) => {

    const location = parkings.indexOf(carRegNo)

    if (location === -1) {
        console.log(`Registration Number ${carRegNo} not found`)
    } else {
        console.log(`Registration Number ${carRegNo} from Slot ${parkings.indexOf(carRegNo) + 1} has left with Charge ${charge}`)
        parkings[parkings.indexOf(carRegNo)] = undefined
    }
}


var argv = yargs
    .usage('Please make sure you have proper file path')
    .example('node . --file filename.txt')
    .alias('f', 'file')
    .nargs('f', 1)
    .describe('f', 'Load a file')
    .demandOption(['f'])

    .help('h')
    .alias('h', 'help')
    .epilog('Creator @Darshan')
    .argv;

try {
    const fileData = fs.readFileSync(argv.file)
    parkingSystem(fileData.toString())

} catch (error) {
    throw error;
}