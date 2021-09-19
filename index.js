const https = require('https'),
    fs = require('fs'),
    request = require('request'),
    memesDir = __dirname + "/memes";

if (!fs.existsSync(memesDir)) {
    fs.mkdirSync(memesDir);
    console.log("[INFO]: 'memes' folder has been created")
} else {
    console.log("[INFO]: 'memes' folder is existing.")
}

const downloadProcess = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

https.get('https://api.memegen.link/images', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        startDownloadProcess(data);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

function startDownloadProcess(data) {
    worker = JSON.parse(data);

    for (let i = 0; i < 10; i++) {
        const element = worker[i];
        urlArr = element.url.split("/");
        const imageName = urlArr[urlArr.length - 1]
        downloadProcess(element.url, memesDir + '/' + imageName, function () {
            console.log('Picture [' + imageName + "] has been saved into memes folder");
        });
    }
}