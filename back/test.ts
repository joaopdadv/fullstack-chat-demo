import * as crypto from 'crypto';


class CryptoService {
  public readonly algorithm = 'aes-256-ctr';
  public readonly secretKey = "VP#EFMm&4YG^kYGsVUzQ9aCBj#wMgf-g"; // Ensure the secretKey is properly assigned

  encrypt(data: string): string {
    const key = crypto.scryptSync(this.secretKey, 'salt', 32); // Derive key from this.secretKey
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(data: string): string {
    const [ivHex, encrypted] = data.split(':');
    const key = crypto.scryptSync(this.secretKey, 'salt', 32); // Derive key from this.secretKey
    const iv = Buffer.from(ivHex, 'hex'); // Convert the iv from hex string to Buffer
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

// Example usage
const cryptoService = new CryptoService();

const message = 'Sending this one';
const encryptedMessage = cryptoService.encrypt(message);
console.log('Encrypted message:', encryptedMessage);

const decryptedMessage = cryptoService.decrypt(encryptedMessage);
console.log('Decrypted message:', decryptedMessage);