// server/index.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());



app.get("/api/sales/calendar/clientsetter/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let appts = await prisma.clientApts.findMany({ where: { userEmail: user.email } });
     appts = appts.map((event) => ({    ...event,    start: new Date(event.start),    end: new Date(event.end) ,   isDraggable: false ,  }));

    console.log(appts,'server appts')
    res.json(appts);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/sales/calendar/clientsetter/user/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    return res.json(user);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email },
  });
  res.json(newUser);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
