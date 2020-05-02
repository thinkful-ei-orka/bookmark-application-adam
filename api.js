const baseUrl = 'https://thinkful-list-api.herokuapp.com/adam'

//GET url+/bookmarks - Read
//POST url+/bookmarks - Create
//PATCH url+/bookmarks/:id - Update
//DELETE url+/bookmarks/:id - Delete

const apiCreate = function(formInfo){
  return fetch(`${baseUrl}/bookmarks`,
  {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formInfo)});
}

const apiRead = function(){
  return fetch(`${baseUrl}/bookmarks`)
}

const apiUpdate = function(){}

const apiDelete = function(){}


export default {
  apiCreate,
  apiRead,
  apiUpdate,
  apiDelete,
  
}