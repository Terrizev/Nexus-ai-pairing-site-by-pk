const mega = require('megajs');

// These are extracted from the obfuscated array
const email = 'kibuukauthuman123@gmail.com';
const password = '8v.xLVX.c7.a37B'; // This is inferred from the string above

// User agent string used in the auth object
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const auth = {
    email: email,
    password: password,
    userAgent: userAgent
};

/**
 * Uploads a file to MEGA.
 * @param {stream.Readable} fileStream - The file stream to upload.
 * @param {string} fileName - The destination file name on MEGA.
 */
function upload(fileStream, fileName) {
    return new Promise((resolve, reject) => {
        try {
            const storage = new mega.Storage(auth, () => {
                const uploadStream = storage.upload({ name: fileName, allowUploadBuffering: true });
                fileStream.pipe(uploadStream);

                uploadStream.on('complete', file => {
                    resolve(file); // file contains info about the uploaded file
                    storage.close();
                });

                uploadStream.on('error', err => {
                    reject(err);
                    storage.close();
                });
            });

            storage.on('error', err => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { upload };
