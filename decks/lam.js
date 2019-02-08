'use strict';
exports.handler = (event, context, callback) => {

    // Get request and request headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;
console.log("*** v1 ***");
console.log("******** request.headers (start) **************");
console.log(request.headers);
console.log("******** request.headers (end)**************");

    // Configure authentication
    const authUser = 'm2user';
    const authPass = 'm2demo';

    // Construct the Basic Auth string
    const authString = 'Basic ' + new Buffer(authUser + ':' + authPass).toString('base64');

console.log("******** headers.authorization[0].value (start) **************");
console.log(headers.authorization[0].value);
console.log("******** headers.authorization[0].value (end)**************");

    // Require Basic authentication
    if (typeof headers.authorization == 'undefined' || headers.authorization[0].value != authString) {
        const body = 'Unauthorized';
        const response = {
            status: '401',
            statusDescription: 'Unauthorized',
            body: body,
            headers: {
                'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
            },
        };
        callback(null, response);
    }

    // Continue request processing if authentication passed
    callback(null, request);
};
