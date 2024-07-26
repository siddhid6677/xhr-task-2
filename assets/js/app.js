const cl = console.log;

const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");


// api url

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`; // this url will be used for get and post method
// const EDIT_URL = `${BASE_URL}/posts/:editId`    >> here editId is params

let postsArr = [];

// const SINGLE_POST_URL = `${BASE_URL}/posts/:id`

const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `
                    <div class="col-md-4 mb-4">
                        <div class="card  postCards" id="${post.id}">
                            <div class="card-header">
                                <h3 class="m-0">
                                    ${post.title}
                                </h3>
                            </div>
                            <div class="card-body">
                                <p>
                                    ${post.body}
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                <button onclick="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                            </div>
                        </div>
                    </div>

                    `
    });

    postsContainer.innerHTML = result;
}

const fetchPosts = () => {

    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest()

        xhr.open("GET", POST_URL, true)

        xhr.send();

        xhr.onload = function(){
            // cl(xhr.response)
            // cl(xhr.status)
            // cl(xhr.statusText)
            // let data = JSON.parse(xhr.response);
            // cl(data)

            if(xhr.status >= 200 && xhr.status < 300){
                //
                postsArr = JSON.parse(xhr.response)
                cl(postsArr);
                templating(postsArr)
            }
            loader.classList.add("d-none");

        }
}

fetchPosts();

const onEdit = (ele) => {
    cl(ele);
    let editId = ele.closest('.card').id;
    localStorage.setItem("editId" ,editId);

    let EDIT_URL = `${BASE_URL}/posts/${editId}`

    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);

    xhr.onload = function(){
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300){
                cl(xhr.response)
                let post = JSON.parse(xhr.response);
                titleControl.value = post.title;
                contentControl.value = post.body;
                userIdControl.value = post.userId;
    
                updateBtn.classList.remove("d-none");
                submitBtn.classList.add("d-none");
            }
            loader.classList.add("d-none");
            
        }, 5000);
        
    }

    xhr.send()

}


const onDelete = (ele) => {

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            let removeId = ele.closest(".card").id;
    let REMOVE_URL = `${BASE_URL}/posts/${removeId}`
    cl(removeId)

    loader.classList.remove("d-none")

    let xhr = new XMLHttpRequest()

    xhr.open("DELETE", REMOVE_URL);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            ele.closest('.col-md-4').remove()
        }
        loader.classList.add("d-none")
    }

    xhr.send()
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
      

}

const onPostUpdate = () => {
    let updatedObj = {
        title : titleControl.value,
        body : contentControl.value.trim(),
        userId : userIdControl.value
    }
    cl(updatedObj)

    let updateId = localStorage.getItem("editId");

    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`;
    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL)

    xhr.onload = function(){
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300){
                cl(xhr.response);
                let card = [...document.getElementById(updateId).children];
                cl(card)
    
                card[0].innerHTML = `<h3 class="m-0">${updatedObj.title}</h3>`;
                card[1].innerHTML = `<p>${updatedObj.body}</p>`
                updateBtn.classList.add("d-none");
                submitBtn.classList.remove("d-none")
                postForm.reset();

    
            }
            loader.classList.add("d-none");

        }, 5000);
    }

    xhr.send(JSON.stringify(updatedObj));

}


const onPostSubmit = (eve) => {
    eve.preventDefault();
    // get new post object from form 
    loader.classList.remove("d-none");

    let newPost = {
        title : titleControl.value,
        body : contentControl.value.trim(),
        userId : userIdControl.value
    }
    cl(newPost);
    postForm.reset();
    // 1 xmlhttprequest ka instance

    let xhr = new XMLHttpRequest();

    xhr.open("POST", POST_URL);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            newPost.id = JSON.parse(xhr.response).id;
            // postsArr.unshift(newPost);
            // templating(postsArr)

            let div = document.createElement('div');
            div.className = `col-md-4 mb-4`;
            div.innerHTML = `
        
                                    <div class="card postCards" id="${newPost.id}">
                                        <div class="card-header">
                                            <h3 class="m-0">
                                                ${newPost.title}
                                            </h3>
                                        </div>
                                        <div class="card-body">
                                            <p>
                                                ${newPost.body}
                                            </p>
                                        </div>
                                        <div class="card-footer d-flex justify-content-between">
                                            <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                            <button onclick="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                                        </div>
                                    </div>

                    ` 
                    postsContainer.prepend(div)
        }
            loader.classList.add("d-none");

    }

    xhr.send(JSON.stringify(newPost));

}






postForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate);












// id >> : Params >> just placeholder

// C >> create >> Post
// R >> read >> Get
// U >> update >> Put/Patch
// D >> delete >> Delete

// xhr >> XmlHttpRequest

// xhr.status >> 200 to 299 success

// xhr.status >> 400 to 499 client side error
// xhr.status >> 500 to 599 server side error




