import {
    ReactiveDict
} from 'meteor/reactive-dict';

const state = new ReactiveDict();
export const State = {
    getSort: () => state.get('sort'),
    getFilters: () => state.get('filters'),
    setSort: (sort) => state.set('sort', sort),
    setFilters: (filters) => state.set('filters', filters),
}