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
import {
  TaggingRules
} from '../imports/api/taggingRules.js';

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
  var filtering = getQuery(filters);

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

function getQuery(filters) {
  var filtering = {};
  if (filters) {
    var textFilters = filters.textFilters || {};
    var textConditions = _.keys(textFilters).map(function (fieldName) {
      if(textFilters[fieldName]){
        return "typeof this." + fieldName+"!=='undefined' && this." + fieldName + ".toLowerCase().indexOf('" + textFilters[fieldName] + "')!=-1";
      } else {
        return "true";
      }
    });
    if (textConditions.length > 0) {
      filtering["$where"] = _.values(textConditions).join(" && ");
    }
  }
  return filtering;
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
  },
  'click button.tagTransactions' (event, instance) {
    var rules = TaggingRules.findOne();
    if (rules) {
      console.log("tagging start");
      rules.rules.reverse().forEach(rule => {
        var filtering = getQuery(rule.filters);
        // console.log(JSON.stringify(filtering));
        Meteor.call('tagTransactions', filtering, rule.tag);        
      });
      console.log('tagging finished');
    }
  }
});