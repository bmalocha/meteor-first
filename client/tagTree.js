import {
    TaggingRules
} from '../imports/api/taggingRules.js';

Template.tagTree.onRendered(() => {
    var data = [{
            name: 'all',
            children: [{
                    name: 'child1'
                },
                {
                    name: 'child2'
                }
            ]
        },
        {
            name: 'node2',
            children: [{
                name: 'child3'
            }]
        }
    ];
    $('#tree1').tree({
        data: data,
        dragAndDrop: true,
        autoOpen: 0
    });

    console.log("rules");
    var rules = TaggingRules.findOne();
    rules.rules.map(r=>r.tag).forEach(tag=>
    $('#tree1').tree(
        'appendNode', {
            name: tag,
            id: newId()
        }
    ));
});

function newId() {
    return (new Mongo.ObjectID)._str;
}