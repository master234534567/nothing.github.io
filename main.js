const tls = require("tls");
const zlib = require("zlib");

function makeJoinReq(bsid,data){
return new Promise(res=>{
const request = `PUT https://fb.blooket.com/c/firebase/join HTTP/1.1
Host: fb.blooket.com
Connection: close
Content-Length: ${Buffer.from(data,"utf8").length}
sec-ch-ua-platform: "Windows"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 OPR/115.0.0.0
Accept: application/json, text/plain, */*
sec-ch-ua: "Chromium";v="130", "Opera GX";v="115", "Not?A_Brand";v="99"
Content-Type: application/json
sec-ch-ua-mobile: ?0
Origin: https://goldquest.blooket.com
Sec-Fetch-Site: same-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://goldquest.blooket.com/
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: en-US,en;q=0.9
Cookie: ${bsid}

${data}`;

const client = tls.connect({ host: "fb.blooket.com", port: 443, servername: 'fb.blooket.com' }, () => {
    client.write(request);
});

let responseBuffer = Buffer.alloc(0);

client.on("data", (chunk) => {
	//console.log(responseBuffer.toString());
    responseBuffer = Buffer.concat([responseBuffer, chunk]);
    //client.end();
});

client.on("end", () => {
    if(global.logResponses){console.log(responseBuffer.toString());}
    const responseText = responseBuffer.toString();
    const bodyStart = responseText.indexOf("\r\n\r\n") + 4;
    if (bodyStart == 3) {throw "wtf"}

    if (/Content-Encoding:\s*gzip/i.test(responseText)) {
        zlib.gunzip(responseBuffer.slice(bodyStart, bodyStart + parseInt(responseText.match(/Content-Length:\s*(\d+)/i)[1])), (err, decoded) => {
            if (err){console.error(err);}
		else {res(decoded.toString());}
        });
} else {res(body.toString());}
});

client.on("error", console.error);
});
}
