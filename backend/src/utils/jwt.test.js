
const dotenv = require("dotenv");

dotenv.config();

const { generateToken, verifyToken } = require('./jwt');

const payload = {
    id: 123,
    role: "CLIENTE"
}

const token = generateToken(payload);

console.log("Token gerado");
console.log(token);

const decoded = verifyToken(token);

console.log("Token decodificado");
console.log(decoded);