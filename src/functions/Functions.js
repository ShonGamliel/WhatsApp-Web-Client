export function getChatID(id1, id2) {
  let sorted = [id1, id2].sort();
  id1 = sorted[0];
  id2 = sorted[1];
  let result = id1 + id2;
  return result;
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  return `${date.getHours().toString()}:${date.getMinutes().toString().padStart(2, "0")}`;
}
