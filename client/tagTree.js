import {
    TaggingRules
} from '../imports/api/taggingRules.js';

const ALL_NODE_ID = 1;
const UNASSIGNED_NODE_ID = 2;

Template.tagTree.onRendered(() => {
    var treeData = loadTree();
    var tree = $('#tree1');

    tree.tree({
        data: treeData,
        dragAndDrop: true,
        autoOpen: 0
    });

    addMissingTags(tree, treeData);
    saveTree();
});

Template.tagTree.events({
    'click button.addTag' (event, instance) {
        var tag = $("input[name='tagGroup']").val();
        var tree = $('#tree1');
        appendNode(tree, tag, ALL_NODE_ID);
        $("input[name='tagGroup']").val('');
        saveTree();
    }
});



function addMissingTags(tree, treeData) {
    var tags = getAllTags();
    crossOutExistingTags(tags, treeData);
    tags.forEach(tag => appendNode(tree, tag, UNASSIGNED_NODE_ID));
}

function crossOutExistingTags(tags, treeData){
    treeData.forEach(node => {
        var i = tags.indexOf(node.name);
        if(i!=-1){
            tags.splice(i, 1);
        }
        if(typeof node.children !=='undefined'){
            crossOutExistingTags(tags, node.children);
        }
    });
}

function appendNode(tree, name, parent_node_id) {
    var parent_node = tree.tree('getNodeById', parent_node_id);
    tree.tree(
        'appendNode', {
            name: name,
            id: newId()
        }, parent_node
    )
}

function getAllTags() {
    var rules = TaggingRules.findOne();
    return rules.rules.map(r => r.tag);
}

function loadTree() {
    var rules = TaggingRules.findOne();
    var tree = rules.tree || baseTree();
    return tree;
}

function saveTree() {
    var tree = $('#tree1');
    var treeData = JSON.parse(tree.tree('toJson'));

    var rules = TaggingRules.findOne();
    TaggingRules.update(rules._id, {
        $set: {
            tree: treeData
        }
    });
}

function baseTree() {
    return [{
            name: 'all',
            id: ALL_NODE_ID
        },
        {
            name: 'Unassigned',
            id: UNASSIGNED_NODE_ID
        }
    ];
}

function newId() {
    return (new Mongo.ObjectID)._str;
}