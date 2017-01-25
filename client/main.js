import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';
import {
  State
} from './state.js';

import {
  Transactions
} from '../imports/api/transactions.js';
import {
  TaggingRules
} from '../imports/api/taggingRules.js';


import '../imports/api/methods.js';

import './main.html';

registerHelpers();

function getTransactions() {
  var filters = State.getFilters();
  var filtering = {};
  if (filters) {
    var fieldName = "description";
    var textFilters = filters.textFilters || {};
    var textConditions = _.keys(textFilters).map(function (fieldName) {
      return "this." + fieldName + ".toLowerCase().indexOf('" + textFilters[fieldName] + "')!=-1";
    });
    if(textConditions.length>0){
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
    var stats = { in: 0,
      inCount: 0,
      out: 0,
      outCount: 0,
      total: 0,
      totalCount: 0
    }

    transactions.forEach(transaction => {
      if (transaction.value > 0) {
        stats.inCount++;
        stats.in += transaction.value;
      } else {
        stats.outCount++;
        stats.out += transaction.value;
      }
      stats.totalCount++;
      stats.total += transaction.value;
    });
    stats.inAvg = stats.in / stats.inCount;
    stats.outAvg = stats.out / stats.outCount;
    stats.totalAvg = stats.total / stats.totalCount;

    stats.in12m = stats.in / 12;
    stats.inCount12m = Math.ceil(stats.inCount / 12);
    stats.out12m = stats.out / 12;
    stats.outCount12m = Math.ceil(stats.outCount / 12);
    stats.total12m = stats.total / 12;
    stats.totalCount12m = Math.ceil(stats.totalCount / 12);

    return stats;
  },
});

Template.transactionsTable.events({
  'click button.resetFilters' (event, instance){
    $("input.filter").val('');
    State.setFilters({});
  }
});

Template.controlPanel.events({
  'click button.load' (event, instance) {
    Meteor.call('loadData');
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
    console.log(Meteor.call('getHeaders'));
  },
  'click button.clear' (event, instance) {
    Meteor.call('clearAll');
    console.log("removed");
  },
});

Template.sortableHeader.events({
  'click .header' (event, instance) {
    event.preventDefault();
    var currentHeaderName = event.target.dataset.headername;
    var sortObj = State.getSort();

    var sort = (sortObj || {}).order;
    if (!sort || sort == "none" || !isHeaderSorted(sortObj, currentHeaderName)) {
      sort = "desc";
    } else if (sort == "desc") {
      sort = "asc";
    } else if (sort == "asc") {
      sort = "none";
    }
    State.setSort({
      column: currentHeaderName,
      order: sort
    });
  },
});

Template.sortableHeader.helpers({
  sortOrder() {
    var sort = State.getSort();
    return isHeaderSorted(sort, Template.instance().data.name) ? sort.order : "";
  }
})

Template.textFilter.events({
  'change input.filter' (event, instance) {
    var filterName = instance.data.name;
    var value = event.target.value;

    var filters = State.getFilters() || {};
    filters.textFilters = filters.textFilters || {};
    filters.textFilters[filterName] = value;
    State.setFilters(filters);

    console.log("changed");
  }
})

Template.taggingRules.events({
  'click button.addRule' (event, instance) {
    var ruleName = $("input[name='ruleName']").val();
    var tag = $("input[name='tag']").val();
    console.log("add rule: " + ruleName + " " + tag + JSON.stringify(State.getFilters()));

    var rule = {
      tag: tag,
      name: ruleName,
      filters: State.getFilters()
    };

    TaggingRules.insert(rule);

    $("input[name='ruleName']").val('');
    $("input[name='tag']").val('');
  },
  'click li' (event, instance) {
    const id = event.target.dataset.id;
    console.log("clicked li " + id);

    const rule = TaggingRules.findOne({
      _id: id
    });
    applyFilters(rule.filters);
  }
})

function applyFilters(filters) {
  _.keys(filters.textFilters).forEach(key => {
    $("input[name='" + key + "']").val(filters.textFilters[key]);
  })
  State.setFilters(filters);
}

Template.taggingRules.helpers({
  rules() {
    return TaggingRules.find({});
  }
})

function isHeaderSorted(sort, headerName) {
  return !!sort && sort.order != "none" && sort.column == headerName;
}

function registerHelpers() {
  UI.registerHelper('formatTime', function (context, options) {
    if (context) {
      return moment(context, "YYYYMMDD").format("MMM Do YY");
    }
  });

  UI.registerHelper('formatMoney', function (context, options) {
    if (context) {
      return context.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
  });
}