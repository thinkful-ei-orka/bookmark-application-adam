import $ from 'jquery';
import api from './api.js';
import store from './store.js';

//Render function for the main page
const mainPageRender = function(){
  $('body').html(
    `<header>
    <h1>My bookmarks</h1>
    <select id='filter'>
      <option value='' disabled selected>Filter by Rating</option>
      <option value='1'>&#11088+</option>
      <option value='2'>&#11088&#11088+</option>
      <option value='3'>&#11088&#11088&#11088+</option>
      <option value='4'>&#11088&#11088&#11088&#11088+</option>
      <option value='5'>&#11088&#11088&#11088&#11088&#11088</option>
    </select>
  </header>
  <main>
  </main>
  <footer>
    <button type='button' class='newBookmark'>+ New Bookmark &#x1F4D1</button>
  </footer>
  <form id='newForm' class='overlay'>
  </form>`
  );
};

//creates the html string for each bookmark in the list
const bookmarkString = function(filter){
  return store.Store.bookmarks.filter(x=>x.rating>=filter).map(y=>{
    let z='';
    for(let i=0;i<5;i++){
      if(i<y.rating){z+='<span class=\'fa fa-star checked\'></span>';} else{z+='<span class=\'fa fa-star\'></span>';}
    }
    if(y.expanded){
      return `
        <button type='button' class='bookmarkButton' id='${y.id}' value='${y.id}'>
          <p>${y.title}</p>
          <section class='starBox'>
            ${z}
          </section>
        </button>
        <p data='${y.id} description' class='details expanded'>
          <b>Description:  </b>${y.desc===null?'No description provided':y.desc}
        </p>
        <p data='${y.id} url' class='url expanded'>
          <b>Url:  </b>${y.url}
        </p>
        <section class='expandedButtonBox'>
          <button type='button' data='${y.id} visit' class='visitButton' value='${y.url}'>
            Visit
          </button>
          <button type='button' data='${y.id} edit' class='editButton'>
            Edit
          </button>
          <button class='deleteButton' type='button' data='${y.id}'>
            Delete &#128465
          </button>
        </section>`;
    } else {
      return `<button type='button' class='bookmarkButton' id='${y.id}' value='${y.id}'><p>${y.title}</p><section class='starBox'>${z}</section>`;
    }}).join('');
};

const mainButtonRender = function(){
  $('main').html(bookmarkString(store.Store.filter));
  condensedHandler();
  visitButtonHandler();
  editButtonHandler();
  deleteButtonHandler();
};

const formRender=function(){
  $('form').html(`
    <p class='errorBox'></p>
    <input type='text' id='title' name='title' placeholder='Title' required>
    <input type='text' id='url' name='url' placeholder='URL' required>
    <input type='text' id='desc' name='desc' placeholder='Description' required>
    <section class='rate'>
      <input type="radio" id="star5" name="rate" value=5 required>
        <label for="star5" title="text">5 stars</label>
      <input type="radio" id="star4" name="rate" value=4 required>
        <label for="star4" title="text">4 stars</label>
      <input type="radio" id="star3" name="rate" value=3 required>
        <label for="star3" title="text">3 stars</label>
      <input type="radio" id="star2" name="rate" value=2 required>
        <label for="star2" title="text">2 stars</label>
      <input type="radio" id="star1" name="rate" value=1 required>
        <label for="star1" title="text">1 star</label>
    </section>
    <section class='buttonBox'>
      <button type='button' class='cancelForm'>Cancel</button>
      <button type='submit' class='newFormSubmit'>Add Bookmark</button>  
    </section>`);
};

const editFormRender=function(item){
  $('form').html(`
    <p class='errorBox'></p>
    <input type='text' id='title' name='title' value='${item.title}' required>
    <input type='text' id='url' name='url' value='${item.url}' required>
    <input type='text' id='desc' name='desc' ${item.desc===null?"placeholder='Description'":`value=${item.desc}`}>
    <section class='rate'> 
      <input type="radio" id="star5" name="rate" value=5${item.rating===5?' checked':''}>
        <label for="star5" title="text">5 stars</label>
      <input type="radio" id="star4" name="rate" value=4${item.rating===4?' checked':''}>
        <label for="star4" title="text">4 stars</label>
      <input type="radio" id="star3" name="rate" value=3${item.rating===3?' checked':''}>
        <label for="star3" title="text">3 stars</label>
      <input type="radio" id="star2" name="rate" value=2${item.rating===2?' checked':''}>
        <label for="star2" title="text">2 stars</label>
      <input type="radio" id="star1" name="rate" value=1${item.rating===1?' checked':''}>
        <label for="star1" title="text">1 star</label>
    </section>
    <section class='buttonBox data='${item.id}'>
      <button type='button' class='cancelForm'>Cancel</button>
      <button type='submit' class='editFormSubmit'>Update Bookmark</button>  
    </section>`);
};

//Pulls the value of the current filter selection, and runs the render function for the bookmark list based upon the current value.
const filterHandler = function(){
  $('#filter').on('change', function(e){
    store.Store.filter=$(e.currentTarget).val();
    mainButtonRender();
  });
};

//pulls a bookmark's data by id
const bookmarkById = function(id){
  return store.Store.bookmarks.find(x=>x.id===id);
};

const bookmarkIndex = function(id){
  return store.Store.bookmarks.findIndex(x=>x.id===id);
};
//Pulls the id of the bookmark to be changed, and fills in the expanded/detail view of that bookmark
const condensedHandler=function(){
  $('.bookmarkButton').on('click',function(e){
    let targetId=$(e.currentTarget).val();
    store.Store.bookmarks[bookmarkIndex(targetId)].expanded=!bookmarkById(targetId).expanded;
    mainButtonRender();
    
  });
};


////////////Delete Handler
const deleteButtonHandler = function(){
  $('.deleteButton').on('click',function(e){
    api.apiDelete(e.currentTarget.getAttribute('data')).then(()=>refresh());
  });
};


///////////Expanded view buttons
//Opens the link in a new tab on visit click
const visitButtonHandler = function(){
  $('.visitButton').on('click',function(e){
    window.open(`${$(e.currentTarget).val()}`);
  });
};

//variable to identify the element to be edited within the server (see editButtonHandler -> editFormSubmitHandler)
let editId = '';

//Handles the render and handling of the edit form
const editButtonHandler = function(){
  $('.editButton').on('click',function(e){
    editId = e.currentTarget.getAttribute('data').split(' ')[0];
    editFormRender(bookmarkById(editId));
    formCancelHandler();
    editFormSubmitHandler();
    $('#newForm').css('width','100%');
  });
};


////////////Edit Bookmark Form//////////////
//listens to the submit button on the edit for, verifies its validity and pushes it to completion if it resolves
const editFormSubmitHandler = function(x){
  $('.editFormSubmit').on('click',function(e){
    e.preventDefault();
    if ($(`input[name='desc']`).val()===''){store.Store.error='Description required';}
    else if ($(`input[name='rate']:checked`).val()===undefined){
      store.Store.error='Rating required';}
    else{
      api.apiUpdate(editId,formSubmitObject()).then(()=>formComplete()).catch(error=>store.Store.error=error.message);}
      store.Store.error!==null?$('.errorBox').html(`${store.Store.error}`):null;
  });
};
////////////New Bookmark Creation////////////
//Pulls open the form to create a new bookmark
const newBookmarkButton = function(){
  $('.newBookmark').on('click',function(){
    formRender();
    //render (pull up?) new bookmark form
    $('#newForm').css('width','100%');
    formSubmitHandler();
    formCancelHandler();
  });
};

//organizes the object of form information on submit
const formSubmitObject = function(){
  let o={};
  [$(`input[name='title']`).val(),$(`input[name='url']`).val(),$(`input[name='desc']`).val(),Number($(`input[name='rate']:checked`).val())].forEach((x,y)=>x===undefined||x===''?null:o[['title','url','desc','rating'][y]]=x);
  return o;
};

//Submits form, re-renders the list and the form, hides the form screen
const formComplete = function(){
  $('#newForm').css('width','0%');
  refresh();
};

//checks the form for missing information and either throws an alert or passes the info to the form completion function
const formSubmitHandler=function(){
  $('.newFormSubmit').on('click',function(e){
    e.preventDefault();
    if ($(`input[name='desc']`).val()===''){store.Store.error='Description required';}
    else if ($(`input[name='rate']:checked`).val()===undefined){
      store.Store.error='Rating required';}
    else{
      api.apiCreate(formSubmitObject()).then(()=>formComplete()).catch(error=>store.Store.error=error.message);}
    store.Store.error!==null?$('.errorBox').html(`${store.Store.error}`):null;
  });
};

//cancel form after entry
const formCancelHandler = function(){
  $('.cancelForm').on('click',function(e){
    e.preventDefault();
    $('#newForm').css('width','0%');
  });
};



//Clears current store and pulls the current list
const refresh = function(){
  store.emptyStore();
  api.apiRead().then(x=>{
    x.forEach(y=>store.instertStore(y));
    store.Store.bookmarks.forEach(x=>x.expanded=false);
    mainButtonRender();
  });
};

//initial page fill
const main = function(){
  mainPageRender();
  filterHandler();
  newBookmarkButton();
  refresh();
};



$(main);