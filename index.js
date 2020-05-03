import $ from 'jquery';
import api from './api.js';

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
  $(filterHandler);
  $(mainButtonRender);
  $(formRender);
  $(condensedHandler);
  $(newBookmarkButton);
};

//creates the html string for each bookmark in the list
const bookmarkString = function(){
  return api.apiRead().then(x=>x.json()).then(x=>x.map(function(y){
    let z='';
    for(let i=0;i<5;i++){
      if(i<y.rating){z+='<span class=\'fa fa-star checked\'></span>';} else{z+='<span class=\'fa fa-star\'></span>';}
    }
    return `<button type='button' class='bookmarkButton' value='Title1id'>
  <p>${y.title}</p>
  <div class='starBox'>${z}</div>
  </button>`;})).then(x=>x.join('')).then(x=>$('main').html(x));
};
//pulls the current bookmarks via api and renders a bookmark button for each, placing the bookmark id as its value
const mainButtonRender = function(){
  $('main').html(bookmarkString());
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
    <button type='submit' class='newFormSubmit'>Add Bookmark</button>`);
};

//Pulls the value of the current filter selection, and runs the render function for the bookmark list based upon that.
const filterHandler = function(){
  $('#filter').on('change', function(e){
    console.log($(e.currentTarget).val());
  });
};

//Pulls the id of the bookmark to be changed, and fills in the expanded/detail view of that bookmark
const condensedHandler=function(){
  $('.bookmarkButton').on('click',function(e){
    console.log($(e.currentTarget).val());
  });
};

//////////////













////////////New Bookmark Creation////////////
//Pulls open the form to create a new bookmark
const newBookmarkButton = function(){
  $('.newBookmark').on('click',function(){
    //render (pull up?) new bookmark form
    $('#newForm').css('width','100%');
    $(formSubmitHandler);  
    console.log('Form Initiated');
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
  $(mainButtonRender);
  $(formRender);
  console.log('Form Submitted');
};

//checks the form for missing information and either throws an alert or passes the info to the form completion function
const formSubmitHandler=function(){
  $('.newFormSubmit').on('click',function(e){
    e.preventDefault();
    api.apiCreate(formSubmitObject()).then(x=>x.status===400?alert('Title and URL required'):formComplete());
  });
};



//Unnecessary*****
//performs the initial render of the page and logs the current data in the api to the console
const main = function(){
  //api.apiCreate({title:'Google',url:'https://www.google.com/',desc:'some description text',rating:3});
  api.apiRead().then(x=>x.json()).then(y=>console.log(y));
  $(mainPageRender);
};



$(main);