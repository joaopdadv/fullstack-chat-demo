"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class CryptoService {
    constructor() {
        this.algorithm = 'aes-256-ctr';
        this.secretKey = "VP#EFMm&4YG^kYGsVUzQ9aCBj#wMgf-g";
    }
    encrypt(data) {
        const key = crypto.scryptSync(this.secretKey, 'salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    }
    decrypt(data) {
        const [ivHex, encrypted] = data.split(':');
        const key = crypto.scryptSync(this.secretKey, 'salt', 32);
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
const cryptoService = new CryptoService();
const message = 'Sending this one';
const encryptedMessage = cryptoService.encrypt(message);
console.log('Encrypted message:', encryptedMessage);
const decryptedMessage = cryptoService.decrypt(encryptedMessage);
console.log('Decrypted message:', decryptedMessage);
//# sourceMappingURL=test.js.map