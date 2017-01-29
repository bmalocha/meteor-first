registerHelpers();

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