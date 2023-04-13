import axios from "axios";
import { ip } from "../env";

export function getUser() {
  return axios.get(`${ip}/user`);
}

export function register(username, password) {
  return axios.post(`${ip}/register`, { username: username, password: password });
}

export function login(username, password) {
  return axios.post(`${ip}/login`, { username: username, password: password });
}

export function search(username) {
  return axios.get(`${ip}/search/${username}`);
}

export function getChatsHistory() {
  return axios.get(`${ip}/chats`);
}

export function getChatHistory(id) {
  return axios.get(`${ip}/chat/${id}`);
}

export function getLastSeen(id) {
  return axios.get(`${ip}/lastseen/${id}`);
}

export function getNewMessages() {
  return axios.get(`${ip}/newmessages`);
}
