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
            _id: newId(),
            tag: tag,
            name: ruleName,
            filters: State.getFilters()
        };

        var rules = TaggingRules.findOne();
        if (rules) {
            rules.rules.push(rule);
            TaggingRules.update(rules._id, {
                $set: {
                    rules: rules.rules
                }
            });
        } else {
            TaggingRules.insert({
                rules: [rule]
            });
        }

        $("input[name='ruleName']").val('');
        $("input[name='tag']").val('');
    },

    'click li' (event, instance) {
        const id = event.target.dataset.id;
        console.log("clicked li " + id);
        const rule = getRules().find(rule => rule._id == id);
        if (rule) {
            applyFilters(rule.filters);
        }
    }
})

Template.taggingRules.helpers({
    rules() {
        return getRules();
    }
})

function getRules() {
    var rules = TaggingRules.findOne() || {
        rules: []
    };
    return rules.rules;
}

function applyFilters(filters) {
    _.keys(filters.textFilters).forEach(key => {
        $("input[name='" + key + "']").val(filters.textFilters[key]);
    })
    State.setFilters(filters);
}

function newId() {
    return (new Mongo.ObjectID)._str;
}