// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
    return data.fragments;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}
  export async function postUserFragments(user,value,type) {
    console.log('Posting user fragments data...');
    try {
      const res = await fetch(`${apiUrl}/v1/fragments`, {
        // Generate headers with the proper Authorization bearer token to pass
        headers: {
          ...user.authorizationHeaders(),
          "Content-Type": type
           },
        method: 'POST',
        body: value
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Posted user fragments data', { data });
    } catch (err) {
      console.error('Unable to call POST /v1/fragment', { err });
    }
}

export async function getFragmentDataByID(user, id) {
  try {
    if (id != "") {
      console.log(`Requesting user fragment data by ID...`);
      console.log(`Fetching ${apiUrl}/v1/fragments/${id}`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        headers: user.authorizationHeaders(),
      });

      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }

      const type = res.headers.get("Content-Type");
      if (type.includes("text")) {
        const data = await res.text();
        console.log(`Received user fragment by ID: ${id}`, { data });
        document.getElementById("returnedData").innerHTML = data;
      } else if (type.startsWith("image")) {
        const data = await res.blob();
        console.log(`Received user fragment by ID: ${id}`, { data });
        var image = document.querySelector('img');
        // see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
        var objectURL = URL.createObjectURL(data);
        image.src = objectURL;
      } else if (type.includes("json")) {
        const data = await res.json();
        console.log(`Received user fragment by ID: ${id}`, { data });
        document.getElementById("returnedData").innerHTML = data;
      } 
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}

export async function deleteFragmentByID(user, id){
  try {
    if (id != "") {
      console.log(`Deleting user fragment data by ID...`);
      const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
        headers: user.authorizationHeaders(),
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      else{
        document.getElementById("returnedData").textContent = "Fragment Deleted Successfully";
      }
    } else {
      document.getElementById("returnedData").textContent = "Error: ID required";
      console.log("Error: ID required");
    }
  } catch (err) {
    console.log(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}

export async function updateFragmentByID(user, newValue, type, id){
  try{
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: {
        ...user.authorizationHeaders(),
        "Content-Type": type
         },
      method: 'PUT',
      body: newValue
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    else{
      document.getElementById("returnedData").textContent = "Fragment Updated Successfully";
    }
  }
  catch (err){
    console.log(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}