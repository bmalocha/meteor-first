import {
    State
} from './state.js';
import {
    TaggingRules
} from '../imports/api/taggingRules.js';

Template.taggingRules.onRendered(() => {
    $("ul.taggingRules").sortable({
        update: function (event, ui) {
            console.log("update");
            setRules(oldRules => {
                var sortedRules = $(event.target.children)
                    .map(function () {
                        var id = this.dataset.id;
                        return oldRules.find(rule => rule._id == id);
                    }).toArray();
                return sortedRules;
            });
        }
    });
    console.log("sortable");
});

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

        setRules(oldRules => {
            oldRules.push(rule);
            return oldRules;
        });

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
});

Template.taggingRules.helpers({
    rules() {
        return getRules();
    }
});

function getRules() {
    var rules = TaggingRules.findOne() || {
        rules: []
    };
    return rules.rules;
}

function setRules(callback) {
    var oldRules = TaggingRules.findOne();
    if (oldRules) {
        var newRules = callback(oldRules.rules);
        TaggingRules.update(oldRules._id, {
            $set: {
                rules: newRules
            }
        });
    } else {
        var newRules = callback([]);
        TaggingRules.insert({
            rules: newRules
        });
    }
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