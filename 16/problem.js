const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => fs.readFileSync(path.join(__dirname, INPUT_FILE)).toString();

const hexToBin = (hex) =>
    hex.split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('');


class BitScanner {
    constructor(bits) {
        this.bits = bits;
        this.cursor = 0;
    }

    readBits(length) {
        const val = this.bits.slice(this.cursor, this.cursor + length);
        this.cursor += length; 
        return val;
    }

    readInt(length) {
        return parseInt(this.readBits(length), 2);
    }
}

const parsePacket = (scanner) => {
    let packetStart = scanner.cursor;

    const version = scanner.readInt(3);
    const type = scanner.readInt(3);

    // Literal value packet
    if (type === 4) {
        let header;
        let valBits = '';
        do {
            header = scanner.readBits(1);
            valBits += scanner.readBits(4);
        } while(header === '1');

        return {
            type,
            version,
            length: scanner.cursor - packetStart,
            value: parseInt(valBits, 2),
        }
    }
    
    let subPackets = [];
    let lengthTypeId = scanner.readInt(1);

    if(lengthTypeId === 0) {
        const subPacketsLength = scanner.readInt(15);

        let i = 0;
        while(i < subPacketsLength) {
            let subPacket = parsePacket(scanner);
            i += subPacket.length;
            subPackets.push(subPacket);
        }

    } else {
        const numSubPackets = scanner.readInt(11);

        for(let i = 0; i < numSubPackets; i++) {
            subPackets.push(parsePacket(scanner));
        }
    }

    return {
        type,
        version,
        subPackets,
        length: scanner.cursor - packetStart,
    }
}


const getVersionSum = (packet) => {
    let sum = packet.version;

    if (packet.subPackets) {
        packet.subPackets.forEach((subPacket) => sum += getVersionSum(subPacket));
    }
    return sum;
}

const evaluatePacket = (packet) => {
    switch(packet.type) {
        case 0:
            return packet.subPackets.reduce((acc, p) => acc + evaluatePacket(p), 0);
        case 1:
            return packet.subPackets.reduce((acc, p) => acc * evaluatePacket(p), 1);
        case 2:
            return Math.min(...packet.subPackets.map((p) => evaluatePacket(p)));
        case 3:
            return Math.max(...packet.subPackets.map((p) => evaluatePacket(p)));
        case 4: 
            return packet.value;
        case 5:
            return evaluatePacket(packet.subPackets[0]) > evaluatePacket(packet.subPackets[1]) ? 1 : 0;
        case 6:
            return evaluatePacket(packet.subPackets[0]) < evaluatePacket(packet.subPackets[1]) ? 1 : 0;
        case 7:
            return evaluatePacket(packet.subPackets[0]) === evaluatePacket(packet.subPackets[1]) ? 1 : 0;
        default:
            throw Error("Invalid packet type: " + JSON.stringify(packet));
    }
}

const binaryInput = hexToBin(readInput());
const packet = parsePacket(new BitScanner(binaryInput));

console.log('Version sum:', getVersionSum(packet));
console.log('Value:', evaluatePacket(packet));
