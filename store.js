import api from './api.js';
let store=[]
const refreshStore = function(){
  return api.apiRead().then(x=>x.json()).then(x=>x.forEach(y=>store.push(y))).then(x=>store.forEach(y=>y.expanded=false)).then(x=>store=x)
}


export default {
  store,
  refreshStore
}