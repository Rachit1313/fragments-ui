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