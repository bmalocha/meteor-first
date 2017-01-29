import {
  Template
} from 'meteor/templating';
import {
  State
} from './state.js';
import {
  SummaryData
} from './summary.js';

import {
  Transactions
} from '../imports/api/transactions.js';

import '../imports/api/methods.js';
import './viewHelpers.js';
import './tagging.js';
import './headersFilters.js';
import './controlPanel.js';

import './main.html';
import './summary.html';
import './table.html';
import './tagging.html';

function getTransactions() {
  var filters = State.getFilters();
  var filtering = {};
  if (filters) {
    var fieldName = "description";
    var textFilters = filters.textFilters || {};
    var textConditions = _.keys(textFilters).map(function (fieldName) {
      return "this." + fieldName + ".toLowerCase().indexOf('" + textFilters[fieldName] + "')!=-1";
    });
    if (textConditions.length > 0) {
      filtering["$where"] = _.values(textConditions).join(" && ");
    }
  }

  var sort = State.getSort();
  if (!sort || !sort.order || sort.order == "none") {
    return Transactions.find(filtering);
  } else {
    var order = sort.order == "desc" ? -1 : 1;
    var sortOption = {}
    sortOption[sort.column] = order;
    return Transactions.find(filtering, {
      sort: sortOption
    });
  }
}

Template.transactionsTable.helpers({
  transactions() {
    return getTransactions();
  },
  summaryData() {
    var transactions = getTransactions();
    return SummaryData(transactions);
  },
});

Template.transactionsTable.events({
  'click button.resetFilters' (event, instance) {
    $("input.filter").val('');
    State.setFilters({});
  }
});


