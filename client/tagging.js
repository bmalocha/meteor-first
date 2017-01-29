import {
  State
} from './state.js';
import {
  TaggingRules
} from '../imports/api/taggingRules.js';

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

Template.taggingRules.helpers({
  rules() {
    return TaggingRules.find({});
  }
})

function applyFilters(filters) {
  _.keys(filters.textFilters).forEach(key => {
    $("input[name='" + key + "']").val(filters.textFilters[key]);
  })
  State.setFilters(filters);
}
