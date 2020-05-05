import api from './api.js';
let Store={bookmarks:[],error:null,filter:0};
const instertStore = function(bookmark){
  this.Store.bookmarks.push(bookmark)}

const emptyStore = function(){
  this.Store.bookmarks=[];
}


export default {
  Store,
  instertStore,
  emptyStore,
};