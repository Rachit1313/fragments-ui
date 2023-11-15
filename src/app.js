// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postUserFragments } from './api';
async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const postSection = document.querySelector('#postSection');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const newFragmentBox = document.querySelector('#newFragmentBox');
  const submitBtn = document.querySelector('#submitBtn');
  const errorMsg = document.querySelector('#errorMsg')
  const fragmentType = document.querySelector('#type');
  const existingFragmentsBox = document.querySelector('#existingFragments')
  

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
    if(newFragmentBox.value == ""){
      errorMsg.innerHTML = "Error : data for the fragment is required"
    }
    else{
      errorMsg.innerHTML = ""
      postUserFragments(user,newFragmentBox.value,fragmentType.value)
      displayUserFragments();
    }
  };

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
  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);