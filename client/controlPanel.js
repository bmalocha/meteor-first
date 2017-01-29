Template.controlPanel.events({
  'click button.load' (event, instance) {
    Meteor.call('loadData');
    console.log(Meteor.call('getHeaders'));
  },
  'click button.clear' (event, instance) {
    Meteor.call('clearAll');
    console.log("removed");
  },
});
