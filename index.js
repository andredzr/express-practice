const express = require('express');
const fs = require('fs');
const app = express();
app.get('/employee/:ide/:attr?', function (req, res) {
    let id_param = req.params.ide;
    let attr = req.params.attr;
    let output;
    fs.readFile('employees.csv', 'utf8', function (err, data) {
        if (err) {
            console.error(err.message);
        }
        //////// This part of the code (mostly) taken from: https://stackoverflow.com/a/64396703
        //This converts the coming data into an array of objects.
        // headerLina = upper row, lines=all the others
        const [headerLine, ...lines] = String(data).split('\n');
        const valueSeparator = ',';
        const headers = headerLine.split(valueSeparator);

        // Create objects from parsing lines
        // There will be as much objects as lines
        const objects = lines
            .map((line) =>
                line
                    // Split line with value separators
                    .split(valueSeparator)
                    // Reduce values array into an object like: { [header]: value }
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
                    .reduce(
                        // Reducer callback 
                        (object, value, index) => ({
                            ...object,
                            [headers[index]]: value,
                        }),
                        // Initial value (empty JS object)
                        {}
                    )
            );
        output = objects.find(item => item.id === id_param);
        ///////////////////////// end of code adapted from https://stackoverflow.com/a/64396703   
        if (attr !== undefined) {
            output = output[attr];
        } else {
            output = JSON.stringify(output, null, '<br/>');
        }
        res.send(output);
    });
});
app.listen(3000, function () {
    console.log('application started.');
});