import {
  State
} from './state.js';

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

function isHeaderSorted(sort, headerName) {
  return !!sort && sort.order != "none" && sort.column == headerName;
}

