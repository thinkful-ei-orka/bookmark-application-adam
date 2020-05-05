const baseUrl = 'https://thinkful-list-api.herokuapp.com/adam';

//GET url+/bookmarks - Read
//POST url+/bookmarks - Create
//PATCH url+/bookmarks/:id - Update
//DELETE url+/bookmarks/:id - Delete

const apiFetch = function(...args){
  let error;
  return fetch(...args).then(x=>{
    if(!x.ok){error={code:x.status};
      if(!x.headers.get('content-type').includes('json')){
        error.message = x.statusText;
        return Promise.reject(error);
      } }
    return x.json();}).then(data=>{
    if(data.code===400){
      return data
    }
    if(error){
      error.message = data.message;
      return Promise.reject(error);
    }
    return data;
  });
};

const apiCreate = function(formInfo){
  return apiFetch(`${baseUrl}/bookmarks`,
    {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formInfo)});
};

const apiRead = function(){
  return apiFetch(`${baseUrl}/bookmarks`);
};

const apiUpdate = function(id,updatedObject){
  return apiFetch(`${baseUrl}/bookmarks/${id}`,
    {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(updatedObject)});
};

const apiDelete = function(id){
  return apiFetch(`${baseUrl}/bookmarks/${id}`,{method:'DELETE',headers:{'Content-Type':'application/json'}});
};


export default {
  apiCreate,
  apiRead,
  apiUpdate,
  apiDelete,
};