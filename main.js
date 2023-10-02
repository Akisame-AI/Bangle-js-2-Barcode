g.clear();
// Function to draw the barcode
function drawBarcode(binaryCode) {
    var lineWidth = 1.0;
    if (binaryCode.length < 85) {
        lineWidth = 2.0;
    } else if (binaryCode.length < 97) {
        lineWidth = 1.8;
    } else {// Adjust as needed. 1.8 fills the screen but causes errors that need to be fixed with the parity check.
        lineWidth = 1.0;
    }
    for (let i = 0; i < binaryCode.length; i++) {
        const binaryDigit = binaryCode[i];
        const x = i * lineWidth+3;
        if (binaryDigit === "1") {
            const startY = 10; // Starting y-coordinate
            var height = 100; // Height of the line, adjust as needed
            if (i<4 || i>binaryCode.length-4) {
                height = 110; // height of start and end marker, adjust as needed
            }
            g.fillRect(x, startY, x+lineWidth-1, startY + height);
        }
    }
}
// Function to generate EAN-13 barcode
function generateEAN13(barcode) {
    // Table for encoding the first digit
    var table_encoding = [
        "000000", "001011", "001101", "001110", "010011", "011001", "011100", "010101", "010110", "011010"
    ];
    // Encoding dictionary for L, G, and R patterns
    var dict = [
        ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"], // L
        ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"], // G
        ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"] // R
    ];
    if (barcode.length !== 13) {
        console.error("Barcode must be a string of length 13");
        return "";
    }
    var firstDigit = parseInt(barcode[0]);
    var encoding = table_encoding[firstDigit];
    var ean13 = "101"; // Start marker
    // Encode the first 6 digits using the determined encoding
    console.log(parseInt(barcode[0]))
    console.log(encoding)
    for (var j = 1; j < 7; j++) {
        var usageIndex = parseInt(encoding.charAt(j-1));
        console.log(usageIndex);
        ean13 += dict[usageIndex][parseInt(barcode[j])];
        if (j === 6) {
            ean13 += "01010"; // Center marker
        }
    }
    // Encode the last 6 digits using the R pattern
    for (var k = 7; k < 13; k++) {
        var rIndex = parseInt(barcode[k]);
        ean13 += dict[2][rIndex];
    }
    ean13 += "101"; // End marker
    drawBarcode(ean13);
    g.setFont("6x8",2.4);
    g.drawString(barcode, 10, 115);
    // Render the graphics on the display
    g.flip();
}

function lookUpCode128(codeSet, character, returnIndex) {
    // Code 128 Character Sets

    // Code Set A
    const codeSetA = [
        " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
        "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
        "NUL", "SOH", "STX", "ETX", "EOT", "ENQ", "ACK", "BEL", "BS", "HT", "LF", "VT", "FF", "CR", "SO", "SI",
        "DLE", "DC1", "DC2", "DC3", "DC4", "NAK", "SYN", "ETB", "CAN", "EM", "SUB", "ESC", "FS", "GS", "RS", "US",
        "FNC 3", "FNC 2", "SHIFT", "CODE C", "CODE B", "FNC 4", "FNC 1", "Start A", "Start B", "Start C", "Stop"
    ];
    
    // Code Set B
    const codeSetB = [
        " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
        "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
        "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
        "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "DEL",
        "FNC 3", "FNC 2", "SHIFT", "CODE C", "CODE A", "FNC 4", "FNC 1", "Start A", "Start B", "Start C", "Stop"
    ];
    
    // Code Set C encodes two numeric digits per character (00-99), and the remaining characters are special/control characters.
    const codeSetC = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
        "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
        "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
        "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
        "40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
        "50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
        "60", "61", "62", "63", "64", "65", "66", "67", "68", "69",
        "70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
        "80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
        "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", 
        "CODE A", "CODE B", "FNC 1", "Start A", "Start B", "Start C", "Stop"
        ];

    // binary patterns for the code sets
    const BINARY_PATTERNS = [
        "11011001100", "11001101100", "11001100110", "10010011000", "10010001100",
        "10001001100", "10011001000", "10011000100", "10001100100", "11001001000",
        "11001000100", "11000100100", "10110011100", "10011011100", "10011001110",
        "10111001100", "10011101100", "10011100110", "11001110010", "11001011100",
        "11001001110", "11011100100", "11001110100", "11101101110", "11101001100",
        "11100101100", "11100100110", "11101100100", "11100110100", "11100110010",
        "11011011000", "11011000110", "11000110110", "10100011000", "10001011000",
        "10001000110", "10110001000", "10001101000", "10001100010", "11010001000",
        "11000101000", "11000100010", "10110111000", "10110001110", "10001101110",
        "10111011000", "10111000110", "10001110110", "11101110110", "11010001110",
        "11000101110", "11011101000", "11011100010", "11011101110", "11101011000",
        "11101000110", "11100010110", "11101101000", "11101100010", "11100011010",
        "11101111010", "11001000010", "11110001010", "10100110000", "10100001100",
        "10010110000", "10010000110", "10000101100", "10000100110", "10110010000",
        "10110000100", "10011010000", "10011000010", "10000110100", "10000110010",
        "11000010010", "11001010000", "11110111010", "11000010100", "10001111010",
        "10100111100", "10010111100", "10010011110", "10111100100", "10011110100",
        "10011110010", "11110100100", "11110010100", "11110010010", "11011011110",
        "11011110110", "11110110110", "10101111000", "10100011110", "10001011110",
        "10111101000", "10111100010", "11110101000", "11110100010", "10111011110",
        "10111101110", "11101011110", "11110101110", "11010000100", "11010010000",
        "11010011100", "11000111010"
        ];

    let lookupArray;
    switch (codeSet) {
        case 'A':
            lookupArray = codeSetA;
            break;
        case 'B':
            lookupArray = codeSetB;
            break;
        case 'C':
            lookupArray = codeSetC;
            break;
        case 'binary':
            return BINARY_PATTERNS[character];
        default:
            throw new Error("Invalid code set provided");
    }
    
    const index = lookupArray.indexOf(character);
    if (index === -1) {
        throw new Error(`Character pair '${character}' not found in code set`);
    }
    if (returnIndex) {
        return index;
    } else {
        return BINARY_PATTERNS[index];
    }
    
}

function convertToBinary(subString, codeSet) {
    let lookupArray;
    let binarySequence = '';

    

    if (codeSet === 'C') {
        for (let i = 0; i < subString.length; i += 2) {
            const characterPair = subString[i] + subString[i + 1];
            binarySequence += lookUpCode128(codeSet, characterPair, false);
        }
    } else {
        for (let char of subString) {
            binarySequence += lookUpCode128(codeSet, char, false);
        }
    }

    return binarySequence;
}

function appendChecksumAndStop(barcodeString, binaryRepresentation) {
    // 1. Calculate the checksum
    let checksumValue = 0;
    let currentCodeSet;

    // The start character is weighted as position 1.
    if (!isNaN(barcodeString[0]) && 
        !isNaN(barcodeString[1])) {
        checksumValue += 105;  // Start C has a value of 105 in Code 128
        currentCodeSet = "C"
    } else {
        // For simplicity, I'm only considering Start B here. 
        // You can add a condition for Start A if needed.
        checksumValue += 104;  // Start B has a value of 104 in Code 128
        currentCodeSet = "B"
    }

    // Now, loop over the data characters, adding their position multiplied by their weight.
    let position = 1; // Starting from the second position since the Start character was position 1
    for (let i = 0; i < barcodeString.length; i++) {
        let charValue;
        if (!isNaN(barcodeString[i]) && !isNaN(barcodeString[i+1]))  { // Numeric character
            if (currentCodeSet == 'B') {
                checksumValue += 99 * position;
                position++
                currentCodeSet = 'C'
            }
            charValue = parseInt(barcodeString.substr(i, 2)); // Take two numeric characters for Code C
            i++;  // Skip the next character in the loop since we're taking two characters here
        } else {
            if (currentCodeSet == 'C') {
                checksumValue += 100 * position;
                position++
                currentCodeSet = 'B'
            }
            charValue = lookUpCode128(currentCodeSet, barcodeString[i], true);  // Assuming we're using Code Set B for simplicity
        }
        checksumValue += charValue * position;
        position++;
    }
    console.log(checksumValue)
    checksumValue = checksumValue % 103;
    // Convert the checksum value to its binary pattern
    binaryRepresentation += lookUpCode128('binary', checksumValue, false);

    // 2. Append the Stop symbol
    binaryRepresentation += "1100011101011"; // This is the stop binary code

    return binaryRepresentation;
}

function generateCode128(barcodeString) {
    let binaryRepresentation = '';
    let currentIndex = 0;
    let currentCodeSet;

    while (currentIndex < barcodeString.length) {
        if (currentIndex + 1 < barcodeString.length && 
            !isNaN(barcodeString[currentIndex]) && 
            !isNaN(barcodeString[currentIndex + 1])) {
            
            // Switch to Code Set C if we aren't already there
            if (currentCodeSet !== 'C') {
                if (!currentCodeSet) {
                    binaryRepresentation += lookUpCode128('B', 'Start C', false);//BINARY_PATTERNS[codeSetB.indexOf("Start C")];  // Start C
                } else if (currentCodeSet !== 'B') {
                    binaryRepresentation += lookUpCode128('B', 'CODE C', false);//BINARY_PATTERNS[codeSetB.indexOf("CODE C")];   // Switch to Code C
                } else {
                    binaryRepresentation += lookUpCode128('A', 'CODE C', false);//BINARY_PATTERNS[codeSetA.indexOf("CODE C")];   // Switch to Code C
                }
                currentCodeSet = 'C';
            }
            
            let codeCSequence = '';
            while (currentIndex + 1 < barcodeString.length && 
                   !isNaN(barcodeString[currentIndex]) && 
                   !isNaN(barcodeString[currentIndex + 1])) {
                codeCSequence += barcodeString[currentIndex] + barcodeString[currentIndex + 1];
                currentIndex += 2;
            }
            
            binaryRepresentation += convertToBinary(codeCSequence, 'C');
        } else {
            let char = barcodeString[currentIndex];
            let targetCodeSet = (char.charCodeAt(0) <= 127) ? 'B' : 'A';

            if (currentCodeSet !== targetCodeSet) {
                if (!currentCodeSet) {
                    binaryRepresentation += lookUpCode128('B', `Start ${targetCodeSet}`, false);//BINARY_PATTERNS[codeSetB.indexOf(`Start ${targetCodeSet}`)];  // Start A or Start B
                } else {
                    binaryRepresentation += lookUpCode128(currentCodeSet, `CODE ${targetCodeSet}`, false);//BINARY_PATTERNS[codeSetA.indexOf(`CODE ${targetCodeSet}`)];   // Switch to Code A, Code B or Code C
                }
                currentCodeSet = targetCodeSet;
            }
            
            binaryRepresentation += convertToBinary(char, targetCodeSet);
            currentIndex++;
        }
    }
    console.log(binaryRepresentation);
    binaryRepresentation = appendChecksumAndStop(barcodeString, binaryRepresentation);
    console.log(binaryRepresentation);
    drawBarcode(binaryRepresentation);
    g.setFont("6x8",2.4);
    g.drawString(barcodeString, 10, 115);
    // Render the graphics on the display
    g.flip();
}

// Example usage
var barcodeDigits = "4055334874045"; // Replace with desired 13-digit EAN-13 barcode
generateEAN13(barcodeDigits);
//generateCode128("Hello World");