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
      <option value='0'>No rating+</option>
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
  $(filterHandler);
  $(newBookmarkButton);
  $(mainButtonRender);
};

//creates the html string for each bookmark in the list
const bookmarkString = function(filter){
  return api.apiRead().then(x=>x.json()).then(x=>x.filter(y=>y.rating>=filter)).then(x=>x.map(y=>{
    let z='';
    for(let i=0;i<5;i++){
      if(i<y.rating){z+='<span class=\'fa fa-star checked\'></span>';} else{z+='<span class=\'fa fa-star\'></span>';}
    }
    return `
      <button type='button' class='bookmarkButton' id='${y.id}' value='${y.id}'>
        <p>${y.title}</p>
        <div class='starBox'>
          ${z}
        </div>
      </button>
      <p data='${y.id} description' class='details hidden'>
        <b>Description:  </b>${y.desc===null?'No description provided':y.desc}
      </p>
      <p data='${y.id} url' class='url hidden'>
        <b>Url:  </b>${y.url}
      </p>
      <section class='expandedButtonBox'>
        <button type='button' data='${y.id} visit' class='visitButton hidden' value='${y.url}'>
          Visit
        </button>
        <button type='button' data='${y.id} edit' class='editButton hidden'>
          Edit
        </button>
        <button class='deleteButton hidden' type='button' data='${y.id}'>
          Delete &#128465
        </button>
      </section>
        `;})).then(x=>x.join('')).then(x=>{$('main').html(x);
    $(condensedHandler);});
  ////////////////Wrong, shouldn't be building in this function
};

//solution after moving to store-state instaed of api call***

//pulls the current bookmarks via api and renders a bookmark button for each, placing the bookmark id as its value
const mainButtonRender = function(){
  bookmarkString(0);
  ///////////Fix this - not generating the list$('main').html();
};

const formRender=function(){
  $('form').html(`
    <input type='text' id='title' name='title' placeholder='Title' required>
    <input type='text' id='url' name='url' placeholder='URL' required>
    <input type='text' id='desc' name='desc' placeholder='Description'>
    <div class='rate'>
      <input type="radio" id="star5" name="rate" value=5>
        <label for="star5" title="text">5 stars</label>
      <input type="radio" id="star4" name="rate" value=4>
        <label for="star4" title="text">4 stars</label>
      <input type="radio" id="star3" name="rate" value=3>
        <label for="star3" title="text">3 stars</label>
      <input type="radio" id="star2" name="rate" value=2>
        <label for="star2" title="text">2 stars</label>
      <input type="radio" id="star1" name="rate" value=1>
        <label for="star1" title="text">1 star</label>
    </div>
    <section class='buttonBox'>
      <button type='button' class='cancelForm'>Cancel</button>
      <button type='submit' class='newFormSubmit'>Add Bookmark</button>  
    </section>`);
};

const editFormRender=function(item){
  $('form').html(`
    <input type='text' id='title' name='title' value='${item.title}' required>
    <input type='text' id='url' name='url' value='${item.url}' required>
    <input type='text' id='desc' name='desc' ${item.desc===null?"placeholder='Description'":`value=${item.desc}`}>
    <div class='rate'> 
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
    </div>
    <section class='buttonBox data='${item.id}'>
      <button type='button' class='cancelForm'>Cancel</button>
      <button type='submit' class='editFormSubmit'>Update Bookmark</button>  
    </section>`);
};

//Pulls the value of the current filter selection, and runs the render function for the bookmark list based upon the current value.
const filterHandler = function(){
  $('#filter').on('change', function(e){
    bookmarkString($(e.currentTarget).val());
  });
};

//pulls a bookmark's data by id
const bookmarkById = function(id){
  return api.apiRead().then(x=>x.json()).then(y=>y.find(x=>x.id===id));
};
//Pulls the id of the bookmark to be changed, and fills in the expanded/detail view of that bookmark
const condensedHandler=function(){
  $('.bookmarkButton').on('click',function(e){
    $(`*[data~=${$(e.currentTarget).val()}]`).toggleClass(['hidden','expanded']);
    visitButtonHandler();
    editButtonHandler();
    deleteButtonHandler();
  });
};



//////////////




////////////Delete Handler
const deleteButtonHandler = function(){
  $('.deleteButton').on('click',function(e){
    api.apiDelete(e.currentTarget.getAttribute('data')).then(x=>bookmarkString(0));
  })
}


///////////Expanded view buttons
//Opens the link in a new tab on visit click
const visitButtonHandler = function(){
  $('.visitButton').on('click',function(e){
    window.open(`${$(e.currentTarget).val()}`);
  });
};

let editId = '';

//Handles the render and handling of the edit form
const editButtonHandler = function(){
  $('.editButton').on('click',function(e){
    editId = e.currentTarget.getAttribute('data').split(' ')[0];
    bookmarkById(editId).then(x=>{
      editFormRender(x);
      formCancelHandler();
      editFormSubmitHandler();});
    $('#newForm').css('width','100%');
  });
};

//Moves away the form and re-renders the button list
const editFormComplete = function(){
  $('#newForm').css('width','0%');
  bookmarkString(0);
};
////////////Edit Bookmark Form//////////////
//listens to the submit button on the edit for, verifies its validity and pushes it to completion if it resolves
const editFormSubmitHandler = function(x){
  $('.editFormSubmit').on('click',function(e){
    e.preventDefault();
    api.apiUpdate(editId,formSubmitObject()).then(x=>x.status===400?alert('Title and URL with http/https required'):editFormComplete());
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
  [$('input[name=\'title\']').val(),$('input[name=\'url\']').val(),$('input[name=\'desc\']').val(),Number($('input[name=\'rate\']:checked').val())].forEach((x,y)=>x===undefined||x===''?null:o[['title','url','desc','rating'][y]]=x);
  return o;
};

//Submits form, re-renders the list and the form, hides the form screen
const formComplete = function(){
  $('#newForm').css('width','0%');
  bookmarkString(0);
};

//checks the form for missing information and either throws an alert or passes the info to the form completion function
const formSubmitHandler=function(){
  $('.newFormSubmit').on('click',function(e){
    e.preventDefault();
    api.apiCreate(formSubmitObject()).then(x=>x.status===400?alert('Title and URL with http/https required'):formComplete());
  });
};

//cancel form after entry
const formCancelHandler = function(){
  $('.cancelForm').on('click',function(e){
    e.preventDefault();
    $('#newForm').css('width','0%');
  });
};



//Unnecessary*****
//performs the initial render of the page and logs the current data in the api to the console, additionally performs the initial rendering of the store object
const main = function(){
  $(mainPageRender);
  store.refreshStore();
  console.log(store)
};



$(main);