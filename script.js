// get DOM controls
const postContainer = document.querySelector('#post-container');
const loading = document.querySelector('.loader');
const filter = document.querySelector('#filter');

// global variables
let limit = 5;
let page = 1;

// fetch our posts using a fake rest API from http://jsonplaceholder.typicode.com/
// using async/await for promises
// fetching the data using our variables for limit and page
// awaiting the fetch and then turning it into res.json();
async function getPosts() {
  const res = await fetch(`http://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);

  const data = await res.json();
  
  return data;
}

// show posts in DOM
async function showPosts() {
  const posts = await getPosts();

  // we take each post item in the array and loop through with the forEach and create the html and content
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    postEl.innerHTML = `
      <div class="number">${post.id}</div>
      <div class="post-info">
        <h2 class="post-title">${post.title}</h2>
        <p class="post-body">${post.body}</p>
      </div>
    `;

    // we then append the item to the page
    postContainer.appendChild(postEl);
  })
}

// show loader and fetch more posts
function showLoading() {
  // show the loading circles
  loading.classList.add('show');

  // run a function to remove the loading cirlces after 1 second
  setTimeout(() => {
    loading.classList.remove('show');

    // inside that, run another setTimeout to increase the page count and rerun the showPosts function
    setTimeout(() => {
      page++;
      // console.log('page is ' + page + ' and limit is ' + limit);
      // rerun showposts function with the new page count
      showPosts();
    }, 300);
  }, 1000);
}

// Filter posts by input
function filterPosts(e) {
  const term = (e.target.value.toUpperCase()); // get the term typed in the field
  const posts = document.querySelectorAll('.post'); // get all of the posts (multiple)

  // posts creates an array of results, we then want to loop through it
  // assign the text to the title and body variables
  // then compare the term entered to see if its in either the title or body
  // if it isn't we use css to hide the result
  // if it is, we keep the flex class that already exists
  posts.forEach(post => {
    const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if( title.indexOf(term) > -1 || body.indexOf(term) > -1 ) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none'
    }
  });
}

// show initial posts
showPosts();



// Event listener
// we want to listen for the scroll event
window.addEventListener('scroll', () => {
  // using destructuring to get properties from documentElement
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

  // using this to determine when we want to show the loader and fetch more data
  if(scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
  
  // console.log(document.documentElement.scrollTop); // distance from top, document.documentElement is root element of the document
  // console.log(document.documentElement.scrollHeight); // height of the window
});

// run a filter of the posts
filter.addEventListener('input', filterPosts);
