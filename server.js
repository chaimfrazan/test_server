import express from "express";
import {
  readUsers,
  writeUsers,
  validUser,
  readEvents,
  readReceipts,
  writeEvents,
  writeReceipts,
} from "./utils/helper_function.js";

const app = express();
const port = process.env.port || 8000;
app.use(express.json());

app.post("/users/register", async (req, res) => {
  try {
    const { body } = req;
    const users = await readUsers();

    if (users.some((u) => u.username === body.username)) {
      return res.status(400).json({ message: "username already exists" });
    }

    const maxId = users[users.length - 1].id;
    const newUser = {
      id: maxId + 1,
      ...body,
    };
    users.push(newUser);
    await writeUsers(users);
    res.status(201).json({ massage: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ massage: "server error" });
  }
});

app.post("/creator/events", async (req, res) => {
  try {
    const { body } = req;
    const users = await readUsers();
    const data = await validUser(body.username, body.password);
    if (data === null) {
      return res.status(401).json({ massage: "Unauthorized" });
    }
    users.push(body);
    await writeEvents(users);
    res.status(201).json({ massage: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ massage: "server error" });
  }
});

app.post("/users/tickets/buy", async (req, res) => {
  try {
    const { body } = req;
    const users = await readUsers();

    const valUs = await validUser(body.username, body.password);
    if (valUs === null) {
      return res.status(401).json({ massage: "Unauthorized" });
    } else {
      const dataEvents = await readEvents();
      const dataRec = await readReceipts();
      const findEvent = dataEvents.find((f) => f.eventName == body.eventName);
      const ticketsSale = findEvent?.ticketsForSale;
      if (findEvent) {
        if (ticketsSale > body.quantity) {
          const filter = dataEvents.filter(
            (f) => f.eventName != body.eventName
          );
          console.log(filter);
          const newData = {
            findEvent,
            ticketsForSale: ticketsSale - body.quantity,
          };
          dataEvents.push(newData);
          await writeEvents(dataEvents);
          dataRec.push(body);
          await writeReceipts(dataRec);
          res.status(201).json({ massage: "Event created successfully" });
        } else {
          res.status(404).json({ massage: "Not enough tickets" });
        }
      } else {
        res.status(400).json({ massage: "Not metch event" });
      }
    }
  } catch (error) {
    res.status(500).json({ massage: "server error" });
  }
});

app.get("/users/:username/summary", async (req, res) => {
  try {
    const data = await readReceipts();
    const { username } = req.params;

    const eventsName = [];
    let count = 0;
    let aveTickets = 0;
    const eventByUserName = data.filter((f) => f.username == username);
    console.log(eventByUserName);

    let tickets = 0;
    for (let index = 0; index < eventByUserName.length; index++) {
      tickets += eventByUserName[index].quantity;
      if (!eventsName.includes(data.eventName)) {
        eventsName.push(eventByUserName[index].eventName);
      }
      count++;
      aveTickets = tickets / count;
    }
    res
      .status(200)
      .json({ tickets: tickets, uniqName: eventsName, avarege: aveTickets });
  } catch (error) {
    res.status(500).json({ massage: "server error" + error });
  }
});

app.listen(port, () => {
  console.log(`server is runing on ${port}`);
});
