import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAccounts() {
  const response = await axios.get(`${API_BASE_URL}/accounts`);
  return response.data;
}

export async function getPosts() {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
}

export async function postScheduledPost(postData: any) {
  const response = await axios.post(`${API_BASE_URL}/posts/schedule`, postData);
  return response.data;
}

export async function deletePost(postId: string) {
  const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
  return response.data;
}
