import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';

const app = express();
const port = 3000;

// function that generates the checksum
function generateChecksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
}

app.get('/', (req, res) => {
    // make a http request to a webpage
    fetch('https://www.tesla.com/')
        // fetch and convert the response to a text
        .then(res => res.text())
        .then(webContent => {
            // writeFile function with filename, content and callback function
            fs.writeFile('newfile.txt', webContent, function (err) {
                // throws and error when there is an error
                if(err){
                    throw err;
                }

                // read the newly created file and generate checksum
                fs.readFile('newfile.txt', function(err, checksumData) {
                    const checksum = generateChecksum(checksumData);

                    // create the checksum file
                    fs.writeFile('newfile_checksum.txt', checksum, function (err) {
                        res.send('Checksum successfully created...')
                    });
                    console.log(checksum);
                });

            });

        })
        .catch(err => console.log(err));

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});