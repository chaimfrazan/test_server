import fs from "fs/promises";

export async function readUsers() {
  const data = await fs.readFile("data/users.json", "utf-8");
  return JSON.parse(data);
}

export async function readEvents() {
  const data = await fs.readFile("data/events.json", "utf-8");
  return JSON.parse(data);
}
export async function readReceipts() {
  const data = await fs.readFile("data/receipts.json", "utf-8");
  return JSON.parse(data);
}
export async function writeUsers(users) {
  await fs.writeFile("data/users.json", JSON.stringify(users, null, 2));
}
export async function writeEvents(posts) {
  await fs.writeFile("data/events.json", JSON.stringify(posts, null, 2));
}
export async function writeReceipts(posts) {
  await fs.writeFile("data/receipts.json", JSON.stringify(posts, null, 2));
}

export async function validUser(username, password) {
  const users = await readUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    return user;
  } else {
    return null;
  }
}
