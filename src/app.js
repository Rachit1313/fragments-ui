// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postUserFragments, getFragmentDataByID, deleteFragmentByID, updateFragmentByID, getConvertedFragmentData} from './api';
async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const postSection = document.querySelector('#postSection');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const newFragmentBox = document.querySelector('#newFragmentBox');
  const submitBtn = document.querySelector('#submitBtn');
  const convertBtn = document.querySelector('#convertBtn')
  const errorMsg = document.querySelector('#errorMsg')
  const fragmentType = document.querySelector('#type');
  const updateType = document.querySelector('#updateType')
  const existingFragmentsBox = document.querySelector('#existingFragments')
  const viewFragmentSection = document.querySelector('#viewFragmentSection')
  const getFragmentDataBtn = document.querySelector('#getFragmentDataBtn')
  const deleteFragmentBtn = document.querySelector('#deleteFragmentBtn')
  const updateFragmentImageDataBtn = document.querySelector('#updateFragmentImageDataBtn')

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  submitBtn.onclick = () => {
    if(!fragmentType.value.startsWith('image')){
    if(newFragmentBox.value == ""){
      errorMsg.innerHTML = "Error : data for the fragment is required"
    }
    else{
      errorMsg.innerHTML = ""
      postUserFragments(user,newFragmentBox.value,fragmentType.value)
      displayUserFragments();
    }
  }
  //handling image fragments here
  else{
    console.log("posting image frag")
    let data = document.getElementById("fileInput").files[0];
    postUserFragments(user,data,fragmentType.value)
    displayUserFragments();
  }
  };


  convertBtn.onclick = () => {
    document.getElementById("convertedFragmentdata").innerHTML = "";
    document.getElementById("convertedFragmentImage").src = "";
    let id = document.querySelector('#convertFragmentId').value;
    let ext = document.querySelector('#convertType').value;

    getConvertedFragmentData(user,id,ext)
  }

  getFragmentDataBtn.onclick = () =>{
    document.getElementById("returnedData").innerHTML = "";
    document.getElementById("image").src = "";
    let id = document.querySelector('#fragmentId').value;
    getFragmentDataByID(user, id);
  }


  deleteFragmentBtn.onclick = () =>{
    document.getElementById("returnedData").innerHTML = "";
    document.getElementById("image").src = "";
    let id = document.querySelector('#fragmentId').value;
    deleteFragmentByID(user, id);
  }

  updateFragmentDataBtn.onclick = () => {
    document.getElementById("returnedData").innerHTML = "";
    document.getElementById("image").src = "";
    let id = document.querySelector('#fragmentId').value;
    let newValue = document.querySelector('#updatedFragmentData').value;

    updateFragmentByID(user,newValue,updateType.value,id)
  }

  updateFragmentImageDataBtn.onclick = () => {
    document.getElementById("returnedData").innerHTML = "";
    document.getElementById("image").src = "";
    let id = document.querySelector('#fragmentId').value;
    let newValue = document.querySelector('#updatedFragmentImage').files[0];

    updateFragmentByID(user,newValue,updateType.value,id)
  }

  function displayUserFragments() {  
    getUserFragments(user)
      .then((fragments) => {
        // Assuming fragments is an array, you can process it and update the HTML
        existingFragmentsBox.innerHTML = createHTMLFromFragments(fragments);
      })
      .catch((error) => {
        console.error('Error fetching user fragments:', error);
      });
  }

  function createHTMLFromFragments(fragments) {
    // Implement your logic to create HTML from the fragments array
    // For example, you could use a loop to create a list
    console.log(fragments)
    const fragmentList = fragments.map(fragment => `<p> <li> Id: ${fragment.id} <br> Owner Id : ${fragment.ownerId} <br> Size: ${fragment.size} <br> Type : ${fragment.type} <br> Updated : ${fragment.updated} <br> Created : ${fragment.created}
    </li></p>`).join('');
    return `<ul>${fragmentList}</ul>`;

  }



  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });
  displayUserFragments();
  // Update the UI to welcome the user
  userSection.hidden = false;
  postSection.hidden = false;
  viewFragmentSection.hidden = false;
  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

function toggleFragmentInputs(){

  const fragmentType = document.querySelector('#type');
  const imageForm = document.querySelector('#imageForm');
  const newFragmentBox = document.querySelector('#newFragmentBox');

  if (fragmentType.value.startsWith('image/')) {
    // If an image type is selected, hide text input and show file input
    newFragmentBox.style.display = 'none';
    imageForm.style.display = 'block';
  } else {
    // If a non-image type is selected, hide file input and show text input
    newFragmentBox.style.display = 'block';
    imageForm.style.display = 'none';
  }
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', () => {
  init();
  // Ensure toggleFragmentInputs is available globally
  window.toggleFragmentInputs = toggleFragmentInputs;
});