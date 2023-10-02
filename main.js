g.clear();
// Function to draw the barcode
function drawBarcode(binarycode) {
	for (let i = 0; i < binarycode.length; i++) {
		const binaryDigit = binarycode[i];
		const x = i * lineWidth+3;
		if (binaryDigit === "1") {
			const startY = 10; // Starting y-coordinate
			var height = 100; // Height of the line, adjust as needed
			if (i<4 || i>91) {
			height = 110; // height of start and end marker, adjust as needed
			}
			g.fillRect(x, startY, x+lineWidth-1, startY + height);
		}
}
// Function to generate EAN-13 barcode
function generateEAN13(barcode) {
	const lineWidth = 1.8; // Adjust as needed. 1.8 fills the screen but causes errors that need to be fixed with the parity check.
	// Table for encoding the first digit
var table_encoding = [
	["000000", 0], ["001011", 1], ["001101", 2], ["001110", 3], ["010011", 4],
	["011001", 5], ["011100", 6], ["010101", 7], ["010110", 8], ["011010", 9]
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
	var encoding = table_encoding[firstDigit][0];
	var ean13 = "101"; // Start marker
	// Encode the first 6 digits using the determined encoding
	for (var j = 1; j < 7; j++) {
	var usageIndex = parseInt(encoding[j-1]);
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
	}
g.setFont("6x8",2.4);
g.drawString(barcode, 10, 115);
// Render the graphics on the display
g.flip();
}
// Example usage
var barcodeDigits = "4055334874045"; // Replace with desired 13-digit EAN-13 barcode
generateEAN13(barcodeDigits);