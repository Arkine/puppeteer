const fs = require('fs');
const path = require('path');

module.exports = (filePath, timeout = 15000) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filePath);
        const basename = path.basename(filePath);

        const watcher = fs.watch(dir, (eventType, filename) => {
            if (eventType === 'rename' && filename === basename) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });
        
        const timer = setTimeout(() => {
            watcher.close();
            reject(new Error(' [checkFileExists] File does not exist, and was not created during the timeout delay.'));
        }, timeout);

        fs.access(filePath, fs.constants.R_OK, err => {
            if (!err) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });
    });
}