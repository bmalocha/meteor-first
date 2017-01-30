import {
    Transactions
} from './transactions.js';
import {
    TaggingRules
} from './taggingRules.js';

var headers;
Meteor.methods({
    'loadData': function () {
        console.log("Loading data " + new Date());
        var data;
        if (Meteor.isServer) {
            csv = Assets.getText('input/aliorUTF8.csv');
            data = Papa.parse(csv, {
                delimiter: ";",
                header: false
            });

            data = transformData(data);
            headers = removeHeaders(data);
            console.log(headers);
            data.forEach((item) => {
                Transactions.insert(item);
            });
        }

    },
    'clearAll': function () {
        Transactions.remove({});
        console.log("removed all");
    },

    'getHeaders': function () {
        return headers;
    },

    'tagTransactions': function (filtering, tag) {
        Transactions.update(filtering, {
            $set: {
                tag: tag
            }
        }, {
            multi: true
        })
    }
});

function removeHeaders(data) {
    return data.splice(0, 1)
}

function transformData(data) {
    return _.map(data.data, function (r) {
        return {
            bookDate: r[0], //"Data księgowania",
            transactionDate: r[1], //"Data transakcji",
            from: r[2], //"Nadawca",
            to: r[3], //"Odbiorca",
            title: r[4] + " " + r[5] + " " + r[6] + " " + r[7],
            //"Tytuł płatności (linia 1)",
            //"Tytuł płatności (linia 2)",
            //"Tytuł płatności (linia 3)",
            //"Tytuł płatności (linia 4)",
            description: r[8], //"Opis transakcji",
            value: parseFloat(r[9]), //"Kwota",
            valueRaw: r[9], //"Kwota",
            currency: r[10], //"Waluta",
            balance: parseFloat(r[11]), //"Saldo po operacji"
            balanceRaw: r[11] //"Saldo po operacji"
        }
    });
}