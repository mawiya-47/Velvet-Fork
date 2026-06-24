/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db-velvet-fork.json");

// Middleware
app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: Read / Write Local DB
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    // Generate Initial Seed Data
    const seedData = getSeedDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), "utf8");
    return seedData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading DB file, recreating seed data...", e);
    const seedData = getSeedDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), "utf8");
    return seedData;
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// REST API Endpoints

// 1. Auth routes
app.post("/api/auth/register", (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const db = readDB();
  const exists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  // Assign admin role to first user or if email contains "admin"
  const isFirst = db.users.length === 0;
  const isAdminEmail = email.toLowerCase().includes("admin") || email.toLowerCase() === "muhammadmawiya5@gmail.com";
  const role = (isFirst || isAdminEmail) ? "admin" : "user";

  const newUser = {
    id: "usr_" + Math.random().toString(36).substr(2, 9),
    email: email.toLowerCase(),
    name,
    role,
    points: 200, // starting loyalty welcome points!
    balance: 500, // starting gourmet wallet amount!
    wishlist: [],
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ success: true, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const db = readDB();
  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // If not exists, auto register gracefully for easy testing
    const name = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
    const isAdminEmail = email.toLowerCase().includes("admin") || email.toLowerCase() === "muhammadmawiya5@gmail.com";
    const role = isAdminEmail ? "admin" : "user";

    user = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      role,
      points: 250,
      balance: 1000, // luxury credits for tasting
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDB(db);
  }

  res.json({ success: true, user });
});

app.get("/api/auth/me", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  if (!email) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ success: true, user });
});

app.post("/api/auth/update-wallet", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { amount } = req.body;
  if (!email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  db.users[userIndex].balance += Number(amount);
  writeDB(db);

  // Add notification
  const newNotif = {
    id: "not_" + Math.random().toString(36).substr(2, 9),
    userId: db.users[userIndex].id,
    title: "Balance Deposited",
    message: `Successfully topped up $${Number(amount).toFixed(2)} to your Velvet Fork wallet.`,
    type: "system",
    date: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(newNotif);
  writeDB(db);

  res.json({ success: true, user: db.users[userIndex] });
});

app.post("/api/auth/toggle-wishlist", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { itemId } = req.body;
  if (!email || !itemId) {
    return res.status(400).json({ error: "Email and itemId are required" });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = db.users[userIndex];
  if (!user.wishlist) user.wishlist = [];

  const itemIndex = user.wishlist.indexOf(itemId);
  if (itemIndex > -1) {
    user.wishlist.splice(itemIndex, 1);
  } else {
    user.wishlist.push(itemId);
  }

  db.users[userIndex] = user;
  writeDB(db);

  res.json({ success: true, wishlist: user.wishlist });
});


// 2. Menu routes (Full CRUD support for Admin)
app.get("/api/menu", (req, res) => {
  const db = readDB();
  res.json(db.menuItems);
});

app.post("/api/menu", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin level permission required" });
  }

  const newItem = {
    ...req.body,
    id: "item_" + Math.random().toString(36).substr(2, 9),
    rating: req.body.rating || 5,
  };

  db.menuItems.push(newItem);
  writeDB(db);
  res.status(201).json({ success: true, item: newItem });
});

app.put("/api/menu/:id", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { id } = req.params;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin level permission required" });
  }

  const index = db.menuItems.findIndex((it: any) => it.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Menu item not found" });
  }

  db.menuItems[index] = { ...db.menuItems[index], ...req.body };
  writeDB(db);
  res.json({ success: true, item: db.menuItems[index] });
});

app.delete("/api/menu/:id", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { id } = req.params;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin level permission required" });
  }

  const index = db.menuItems.findIndex((it: any) => it.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Menu item not found" });
  }

  db.menuItems.splice(index, 1);
  writeDB(db);
  res.json({ success: true, message: "Item deleted successfully" });
});


// 3. Reservations routes
app.get("/api/reservations", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const db = readDB();
  if (!email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "admin") {
    return res.json(db.reservations);
  } else {
    const userReservations = db.reservations.filter((r: any) => r.userId === user.id);
    return res.json(userReservations);
  }
});

app.post("/api/reservations", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { date, time, guests, specialInstructions, eventType, paymentMode } = req.body;

  if (!email || !date || !time || !guests) {
    return res.status(400).json({ error: "Missing required reservation details" });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = db.users[userIndex];

  // Optional luxury reservation deposit logic (Stripe simulation or Wallet)
  let chargedAmount = 0;
  if (eventType === "Private Event") {
    chargedAmount = 150.00; // deposit fee for private events
  } else if (eventType === "Birthday" || eventType === "Anniversary") {
    chargedAmount = 50.00; // smaller event deposit fee
  }

  if (chargedAmount > 0) {
    if (paymentMode === "wallet") {
      if (user.balance < chargedAmount) {
        return res.status(400).json({ error: `Insufficient balance. Deposit required: $${chargedAmount}.00` });
      }
      user.balance -= chargedAmount;
    } else {
      // paymentMode === "card", simulate successful Stripe card processing
      console.log(`Simulating Stripe card charge of $${chargedAmount} for event reservation.`);
    }
    // Earn loyalty points on deposits!
    user.points += Math.floor(chargedAmount * 2);
  }

  // Assign random elegant table number
  const tableNumber = Math.floor(Math.random() * 24) + 1;

  const newReservation = {
    id: "res_" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    date,
    time,
    guests: Number(guests),
    specialInstructions: specialInstructions || "",
    tableNumber,
    status: chargedAmount > 0 ? "Confirmed" : "Pending",
    eventType: eventType || "Standard Dining",
    cardChargedAmount: chargedAmount,
  };

  db.reservations.push(newReservation);
  db.users[userIndex] = user; // persist loyalty points or balance change

  // Create customized user notification
  const newNotif = {
    id: "not_" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    title: "Table Reserved",
    message: `${eventType} booked for ${guests} guests on ${date} at ${time}. Table #${tableNumber} is prepared.`,
    type: "reservation",
    date: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(newNotif);

  writeDB(db);
  res.status(201).json({ success: true, reservation: newReservation, user });
});

app.put("/api/reservations/:id", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { id } = req.params;
  const { status } = req.body; // e.g. "Confirmed", "Checked In", "Cancelled"

  const db = readDB();
  const index = db.reservations.findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  // Authorization check (Author or Admin)
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const reservation = db.reservations[index];
  if (user.role !== "admin" && reservation.userId !== user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  db.reservations[index].status = status;

  // Notification
  const newNotif = {
    id: "not_" + Math.random().toString(36).substr(2, 9),
    userId: reservation.userId,
    title: `Reservation ${status}`,
    message: `Your fine dining reservation for ${reservation.date} has been ${status.toLowerCase()}.`,
    type: "reservation",
    date: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(newNotif);

  writeDB(db);
  res.json({ success: true, reservation: db.reservations[index] });
});


// 4. Online Ordering / Checkout routes
app.get("/api/orders", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const db = readDB();
  if (!email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "admin") {
    res.json(db.orders);
  } else {
    const userOrders = db.orders.filter((ord: any) => ord.userId === user.id);
    res.json(userOrders);
  }
});

app.post("/api/orders", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { items, subtotal, discount, total, address, phone, paymentMode, pointsUsed, specialInstructions } = req.body;

  if (!email || !items || items.length === 0 || !total) {
    return res.status(400).json({ error: "Invalid order details" });
  }

  const db = readDB();
  const userIndex = db.users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = db.users[userIndex];

  // If using wallet payment, verify balance
  if (paymentMode === "wallet") {
    if (user.balance < total) {
      return res.status(400).json({ error: `Insufficient gourmet wallet balance. Needed: $${total.toFixed(2)}` });
    }
    user.balance -= total;
  } else {
    // paymentMode === "card", simulate Stripe Charge
    console.log(`Processing card payment of $${total.toFixed(2)} on Stripe Gateway... Payment Success.`);
  }

  // Award points based on subtotal (10 points per dollar spent)
  const pointsEarned = Math.floor(subtotal * 10);
  user.points += pointsEarned;

  // Deduct spent points from loyalty rewards program
  if (pointsUsed) {
    user.points = Math.max(0, user.points - Number(pointsUsed));
  }

  const newOrder = {
    id: "ord_" + Math.floor(100000 + Math.random() * 900000).toString(), // clean 6 digit invoice order sequence
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount),
    total: Number(total),
    pointsEarned,
    pointsUsed: Number(pointsUsed || 0),
    address,
    phone,
    paymentMode,
    paymentStatus: "paid",
    status: "Received",
    date: new Date().toISOString(),
    specialInstructions: specialInstructions || "",
  };

  db.orders.push(newOrder);
  db.users[userIndex] = user; // update profile stats

  // Log order notification
  const newNotif = {
    id: "not_" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    title: "Order Placed Successfully",
    message: `Your gourmet order #${newOrder.id} has been received and sent to the kitchen. Chef is preparing it!`,
    type: "order",
    date: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(newNotif);

  writeDB(db);
  res.status(201).json({ success: true, order: newOrder, user });
});

app.put("/api/orders/:id", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { id } = req.params;
  const { status } = req.body; // 'Preparing' | 'In Transit' | 'Delivered' | 'Cancelled'

  const db = readDB();
  const index = db.orders.findIndex((o: any) => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Authorization check
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const order = db.orders[index];
  if (user.role !== "admin" && order.userId !== user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  db.orders[index].status = status;

  // Add notification
  const newNotif = {
    id: "not_" + Math.random().toString(36).substr(2, 9),
    userId: order.userId,
    title: `Order Status: ${status}`,
    message: `Your Velvet Fork order #${order.id} is now ${status.toLowerCase()}.`,
    type: "order",
    date: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(newNotif);

  writeDB(db);
  res.json({ success: true, order: db.orders[index] });
});


// 5. Reviews routes
app.get("/api/reviews", (req, res) => {
  const db = readDB();
  res.json(db.reviews);
});

app.post("/api/reviews", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { rating, comment, menuItemId } = req.body;

  if (!email || !rating || !comment) {
    return res.status(400).json({ error: "Missing required review inputs" });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User session not found" });
  }

  const newReview = {
    id: "rev_" + Math.random().toString(36).substr(2, 9),
    userId: user.id,
    userName: user.name,
    menuItemId: menuItemId || null,
    rating: Number(rating),
    comment,
    date: new Date().toISOString(),
  };

  db.reviews.push(newReview);

  // Recalculate rating on menu item if applicable
  if (menuItemId) {
    const itemIndex = db.menuItems.findIndex((it: any) => it.id === menuItemId);
    if (itemIndex > -1) {
      const itemReviews = db.reviews.filter((r: any) => r.menuItemId === menuItemId);
      const avg = itemReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / itemReviews.length;
      db.menuItems[itemIndex].rating = parseFloat(avg.toFixed(1));
    }
  }

  writeDB(db);
  res.status(201).json({ success: true, review: newReview });
});


// 6. Blog / Recipes routes
app.get("/api/blogs", (req, res) => {
  const db = readDB();
  res.json(db.blogs);
});

app.post("/api/blogs", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin permissions required" });
  }

  const newBlog = {
    ...req.body,
    id: "blog_" + Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString().split("T")[0],
    author: user.name,
  };

  db.blogs.push(newBlog);
  writeDB(db);
  res.status(201).json({ success: true, blog: newBlog });
});


// 7. Coupons / Promos
app.get("/api/coupons", (req, res) => {
  const db = readDB();
  res.json(db.coupons);
});

app.post("/api/coupons", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin privilege required" });
  }

  const newCoupon = {
    ...req.body,
    active: true,
  };

  db.coupons.push(newCoupon);
  writeDB(db);
  res.status(201).json({ success: true, coupon: newCoupon });
});


// 8. Notifications / Alerts
app.get("/api/notifications", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const db = readDB();

  // Return public special alerts + user specific notifications
  const publicAlerts = db.notifications.filter((n: any) => !n.userId);

  if (!email) {
    return res.json(publicAlerts);
  }

  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.json(publicAlerts);
  }

  const userAlerts = db.notifications.filter((n: any) => n.userId === user.id);
  res.json([...publicAlerts, ...userAlerts]);
});

app.post("/api/notifications/mark-read", (req, res) => {
  const email = req.headers["x-user-email"] as string;
  const { id } = req.body;
  const db = readDB();

  if (!email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (id) {
    const index = db.notifications.findIndex((n: any) => n.id === id && n.userId === user.id);
    if (index > -1) {
      db.notifications[index].read = true;
    }
  } else {
    // Mark all as read
    db.notifications.forEach((n: any, idx: number) => {
      if (n.userId === user.id) {
        db.notifications[idx].read = true;
      }
    });
  }

  writeDB(db);
  res.json({ success: true });
});

app.post("/api/notifications", (req, res) => {
  // Push special alert notification (Admins only)
  const email = req.headers["x-user-email"] as string;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin privilege required" });
  }

  const { title, message, type } = req.body;

  const newNotif = {
    id: "not_" + Math.random().toString(36).substr(2, 9),
    title,
    message,
    type: type || "special",
    date: new Date().toISOString(),
    read: false,
  };

  db.notifications.push(newNotif);
  writeDB(db);
  res.status(201).json({ success: true, notification: newNotif });
});


// 9. Server-side Gemini AI Sommelier Assistant Chat and Menu Matcher
app.post("/api/gemini/sommelier", async (req, res) => {
  const { prompt, currentCart, dietaryPreference, winePairingOnly } = req.body;

  try {
    const db = readDB();
    const menuList = db.menuItems.map((it: any) => `${it.name} (${it.category}) - $${it.price}: ${it.description} [Ingredients: ${it.ingredients.join(", ")}]`).join("\n");

    const systemInstruction = `You are the world-class Head Sommelier and Executive Culinary Consultant of "Velvet Fork", a five-star ultra-luxury Michelin restaurant.
Your task is to provide expert dining guidance, gourmet course selections, elegant wine pairings, or adapt existing dishes to cater to the customer's specified dietary requirements (such as Gluten-Free, Vegan, nut allergies, low-cholesterol, halal, etc.).

Below is Velocity Fork's entire current gourmet menu:
${menuList}

Guidelines for responding:
1. Always maintain a highly sophisticated, warm, and poetic tone suitable for a five-star restaurant.
2. Directly refer to items that exist on the Velvet Fork menu.
3. If they ask about wine pairing, suggest top-tier classic, premium wines to match the dishes they ordered or asked about.
4. If they have dietary restrictions, guide them with deep passion on how the kitchen can custom-modify actual menu items to fulfill their expectations exquisitely.
5. If they are asking for recommendations, customize the flow like a fine dining degustation experience.
6. Provide structured, clean Markdown output so it looks gorgeous on the customer's interface. Use headers, bold terms, and beautiful lists. Keep recommendations focused, precise, and beautiful. No self-mentions of files or code.`;

    const contents = `Customer Request: "${prompt || "Please suggest a magical 3-course dinner pairing from the menu for a date."}"
Current Cart Items (if any): ${JSON.stringify(currentCart || [])}
Dietary constraints (if any): "${dietaryPreference || "none"}"
Wine pairing requested: ${winePairingOnly ? "Yes" : "No"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ error: "Our Sommelier is currently holding a private tasting cellar tour. " + error.message });
  }
});


// Seed DB Generator
function getSeedDB() {
  const initialMenuItems = [
    // STARTERS
    {
      id: "it_st_01",
      name: "Truffle Butter Scallops",
      category: "Starters",
      description: "Pan-seared Hokkaido giant scallops with black truffle emulsion, sunchoke puree, and crisp sage.",
      ingredients: ["Scallops", "Black Truffle", "Sunchoke", "Sauterne Wine", "Cultured Butter"],
      nutritionalInfo: { calories: 310, protein: "24g", carbs: "12g", fat: "18g" },
      price: 28.00,
      rating: 4.9,
      prepTime: "12 mins",
      images: ["https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800"],
      tags: ["Chef Choice", "Gluten Free"],
    },
    {
      id: "it_st_02",
      name: "Heirloom Burrata Artisanal",
      category: "Starters",
      description: "Smoked creamy burrata over heirloom tomato carpaccio, copper balsamic pearls, and garden micro-basil.",
      ingredients: ["Burrata Cheese", "Heirloom Tomatoes", "Aged Balsamic", "Extra Virgin Olive Oil", "Microgreens"],
      nutritionalInfo: { calories: 420, protein: "18g", carbs: "9g", fat: "34g" },
      price: 24.00,
      rating: 4.8,
      prepTime: "8 mins",
      images: ["https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=800"],
      tags: ["Vegan", "Gluten Free"],
    },
    // PIZZA
    {
      id: "it_pz_01",
      name: "Peachy Prosciutto & Truffle Pizza",
      category: "Pizza",
      description: "Smoked mozzarella, white peach slices, prosciutto di Parma, wild arugula, and a luxurious drizzle of white truffle honey.",
      ingredients: ["Prosciutto", "White Peaches", "Truffle Honey", "Mozzarella", "Aged Sourdough Crust"],
      nutritionalInfo: { calories: 750, protein: "32g", carbs: "82g", fat: "28g" },
      price: 36.00,
      rating: 4.7,
      prepTime: "15 mins",
      images: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"],
      tags: ["Aromatic"],
    },
    // BURGERS
    {
      id: "it_bg_01",
      name: "Imperial 24K Wagyu Burger",
      category: "Burgers",
      description: "A6 grade Japanese Wagyu beef patty, molten gruyere, white truffle aioli, and caramelized onions wrapped in edible 24K gold leaf.",
      ingredients: ["Wagyu Beef", "Gruyere Cheese", "Truffle Brioche Bun", "Caramelized Shallots", "Edible Gold Leaf"],
      nutritionalInfo: { calories: 980, protein: "52g", carbs: "44g", fat: "62g" },
      price: 48.00,
      rating: 5.0,
      prepTime: "20 mins",
      images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"],
      tags: ["Chef Choice", "Luxury"],
    },
    // BBQ
    {
      id: "it_bq_01",
      name: "Rosemary Glazed Lamb Chops",
      category: "BBQ",
      description: "Charcoal grill-kissed Australian lamb chops coated in dynamic rosemary, garlic, and copper pomegranate reduction.",
      ingredients: ["Australian Lamb", "Fresh Rosemary", "Pomegranate Reduction", "Smoked Sea Salt"],
      nutritionalInfo: { calories: 680, protein: "48g", carbs: "14g", fat: "42g" },
      price: 45.00,
      rating: 4.9,
      prepTime: "18 mins",
      images: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"],
      tags: ["Signature BBQ", "Gluten Free"],
    },
    // PAKISTANI FOOD
    {
      id: "it_pk_01",
      name: "Saffron Imperial Lamb Korma",
      category: "Pakistani Food",
      description: "Slow-braised tender premium lamb shoulder infused with hand-picked saffron, cardamom essences, crushed almonds, and slow-churned organic ghee.",
      ingredients: ["Tender Lamb Shoulder", "Organic Saffron", "Cardamom Pearls", "Ghee", "Almond Paste"],
      nutritionalInfo: { calories: 820, protein: "44g", carbs: "18g", fat: "56g" },
      price: 38.00,
      rating: 5.0,
      prepTime: "25 mins",
      images: ["https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800"],
      tags: ["Chef Choice", "Royal Heritage"],
    },
    {
      id: "it_pk_02",
      name: "Velvet Butter Chicken Makhani",
      category: "Pakistani Food",
      description: "Charcoal roasted spiced chicken tikka pieces simmered in silk-smooth cashew-tomato gravy with gourmet house butter.",
      ingredients: ["Chicken Tikka", "Gourmet Butter", "Cashew Paste", "Heirloom Tomato Gravy", "Fenugreek"],
      nutritionalInfo: { calories: 710, protein: "38g", carbs: "15g", fat: "44g" },
      price: 32.00,
      rating: 4.9,
      prepTime: "20 mins",
      images: ["https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800"],
      tags: ["Best Seller"],
    },
    // PASTA
    {
      id: "it_ps_01",
      name: "Truffle Wild Mushroom Linguine",
      category: "Pasta",
      description: "House-crafted bronze-cut linguine tossed with morel mushrooms, fresh black truffles, Parmigiano-Reggiano cream, and soft chives.",
      ingredients: ["Handmade Linguine", "Organic Mushrooms", "Black Truffle Paté", "Pecorino", "Parmigiano-Reggiano"],
      nutritionalInfo: { calories: 680, protein: "22g", carbs: "78g", fat: "26g" },
      price: 34.00,
      rating: 4.9,
      prepTime: "14 mins",
      images: ["https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800"],
      tags: ["Vegan Option"],
    },
    // SEAFOOD
    {
      id: "it_sf_01",
      name: "Saffron Butter Salmon Tail",
      category: "Seafood",
      description: "Wild Scottish salmon fillet pan-roasted skin-crisp, served over asparagus spears and coated in heavy saffron-chive butter.",
      ingredients: ["Scottish Salmon", "Kashmiri Saffron", "Young Asparagus", "Chive Beurre Blanc"],
      nutritionalInfo: { calories: 540, protein: "39g", carbs: "8g", fat: "38g" },
      price: 42.00,
      rating: 4.8,
      prepTime: "16 mins",
      images: ["https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800"],
      tags: ["Signature", "Gluten Free"],
    },
    // DESSERTS
    {
      id: "it_ds_01",
      name: "Golden Velvet Lava Soufflé",
      category: "Desserts",
      description: "72% Madagascar chocolate warm soufflé with a molten interior, raspberry reduction, and gold dust dusting.",
      ingredients: ["Valrhona Chocolate", "Organic Eggs", "Raspberries", "Grand Marnier", "Gold Leaf Crystals"],
      nutritionalInfo: { calories: 480, protein: "8g", carbs: "52g", fat: "22g" },
      price: 18.00,
      rating: 5.0,
      prepTime: "15 mins",
      images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800"],
      tags: ["Chef Choice"],
    },
    {
      id: "it_ds_02",
      name: "Saffron Pistachio Brûlée",
      category: "Desserts",
      description: "Creamy vanilla bean custard infused with saffron threads, topped with hardened sugar glass and roasted Sicilian pistachios.",
      ingredients: ["Vanilla Bean", "Heavy Cream", "Saffron Threads", "Sicilian Pistachio", "Melted Cane Sugar"],
      nutritionalInfo: { calories: 390, protein: "6g", carbs: "28g", fat: "24g" },
      price: 16.00,
      rating: 4.9,
      prepTime: "10 mins",
      images: ["https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&q=80&w=800"],
      tags: ["Gluten Free"],
    },
    // DRINKS
    {
      id: "it_dr_01",
      name: "Hibiscus Saffron Copper Sparkler",
      category: "Drinks",
      description: "Sparkling natural spring hydration combined with cold-extracted hibiscus flowers, luxury saffron syrup, and elderflower mist.",
      ingredients: ["Cold Hibiscus Brew", "Organic Saffron Syrup", "Elderflower Cordial", "Spring Water Sparkling"],
      nutritionalInfo: { calories: 95, protein: "0g", carbs: "24g", fat: "0g" },
      price: 12.00,
      rating: 4.9,
      prepTime: "5 mins",
      images: ["https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800"],
      tags: ["Non-Alcoholic", "Organic"],
    }
  ];

  const initialUsers = [
    {
      id: "usr_admin",
      email: "muhammadmawiya5@gmail.com",
      name: "Muhammad Mawiya",
      role: "admin",
      points: 1250,
      balance: 5000.00,
      wishlist: ["it_st_01", "it_bg_01"],
      createdAt: new Date().toISOString(),
    }
  ];

  const initialReservations = [
    {
      id: "res_01",
      userId: "usr_admin",
      userEmail: "muhammadmawiya5@gmail.com",
      userName: "Muhammad Mawiya",
      date: "2026-06-25",
      time: "19:30",
      guests: 4,
      specialInstructions: "Honeymoon dinner near the terrace.",
      tableNumber: 12,
      status: "Confirmed",
      eventType: "Private Event",
      cardChargedAmount: 150.00,
    }
  ];

  const initialOrders = [
    {
      id: "ord_281943",
      userId: "usr_admin",
      userEmail: "muhammadmawiya5@gmail.com",
      userName: "Muhammad Mawiya",
      items: [
        { menuItemId: "it_st_01", name: "Truffle Butter Scallops", price: 28.00, quantity: 2, image: "https://images.unsplash.com/photo-1532636875304-0c8fe119fa9e?auto=format&fit=crop&q=80&w=800" },
        { menuItemId: "it_ds_01", name: "Golden Velvet Lava Soufflé", price: 18.00, quantity: 1, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800" },
      ],
      subtotal: 74.00,
      discount: 10.00,
      total: 64.00,
      pointsEarned: 740,
      pointsUsed: 0,
      address: "Luxury Penthouse Suite, Downtown 5th Avenue",
      phone: "+1 (555) 123-4567",
      paymentMode: "wallet",
      paymentStatus: "paid",
      status: "Delivered",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      specialInstructions: "Ring bell once",
    }
  ];

  const initialReviews = [
    {
      id: "rev_01",
      userId: "usr_admin",
      userName: "Muhammad Mawiya",
      menuItemId: "it_st_01",
      rating: 5,
      comment: "Absolutely stellar. The sunchoke puree pairs phenomenally with the seared scallops! World-class fine dining indeed.",
      date: new Date().toISOString(),
    },
    {
      id: "rev_02",
      userId: "usr_admin",
      userName: "Muhammad Mawiya",
      menuItemId: "it_pk_01",
      rating: 5,
      comment: "Imperial Lamb Korma is incredibly rich and authentic. Tender meat fell right off the bone with cardamom warmth. Simply stunning.",
      date: new Date().toISOString(),
    }
  ];

  const initialBlogs = [
    {
      id: "blog_01",
      title: "The Crafting of A6 Japanese Wagyu at Velvet Fork",
      excerpt: "Deep dive into the sourcing, marbling indices, and premium char-searing techniques behind our world-famous burger.",
      content: "Inside the kitchens of Velvet Fork, Japanese Wagyu is treated as a sacred medium of art. Raised in pristine mountains in Miyazaki prefecture, our beef contains marble scores reaching grade twelve. Cooking this beef requires intense pan-searing on artisanal pink Himalayan salt stones, locking in pristine monounsaturated fats. Brushed with aged white truffle butter and carefully plated inside 24-carat gourmet gold leaf, our Imperial Wagyu Burger transcends the definition of modern burgers. Pair it with an ancient vintage bordeaux to cut through the exquisite rich fat profile for an unforgettable dinner.",
      author: "Executive Chef Jean-Luc",
      date: "2026-06-15",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
      tags: ["Chef Secret", "Gourmet Story"],
      readTime: "5 min read",
    },
    {
      id: "blog_02",
      title: "Elevating cardamoms and saffrons in Fine Dining",
      excerpt: "Unpacking the rich historic culinary pathways of Imperial Mogul and Pakistani cooking styles redefined for luxury layouts.",
      content: "Pakistani traditional cooking has always carried the depth of aromatic spices. In recreating the Imperial Lamb Korma, our kitchen team set out to marry standard fine-dining reduction techniques with braising methods dating back to the grand Royal Mughlai courts. Hand-ground almonds form a velvety butter paste, emulsified with double-strained warm ghee. Kashmiri saffron threads are lightly toasted to activate volatile esters before being submerged in high-hydration cream. The result is a gorgeous golden gravy with smooth mouthfeel and balanced cardamom finishes. It represents the very DNA of what Velvet Fork stands for: respecting the old while pioneering the sublime.",
      author: "Chef Tariq Mehmood",
      date: "2026-06-18",
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800",
      tags: ["Technique", "Heritage"],
      readTime: "7 min read",
    }
  ];

  const initialCoupons = [
    { code: "VELVETVELVET", discountPercentage: 15, minAmount: 50, active: true, description: "15% off fine-dining gourmet orders above $50" },
    { code: "GOLDENGASTRONOMY", discountPercentage: 20, minAmount: 100, active: true, description: "Exclusive 20% off for bill orders above $100" },
  ];

  const initialNotifications = [
    {
      id: "not_welcome_01",
      title: "Welcome to Velvet Fork",
      message: "Experience modern culinary art. Use coupon code VELVETVELVET to enjoy 15% off your first fine-dining order!",
      type: "special",
      date: new Date().toISOString(),
      read: false,
    },
    {
      id: "not_special_alert",
      title: "Chef's Special Alert: Hokkaido Scallops",
      message: "Enjoy fresh Hokkaido Truffle Butter Scallops crafted by Executive Chef Jean-Luc. Limited portions available today.",
      type: "special",
      date: new Date().toISOString(),
      read: false,
    }
  ];

  return {
    users: initialUsers,
    menuItems: initialMenuItems,
    reservations: initialReservations,
    orders: initialOrders,
    payments: [],
    reviews: initialReviews,
    blogs: initialBlogs,
    coupons: initialCoupons,
    notifications: initialNotifications,
  };
}

// Vite middleware development / Production setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Velvet Fork full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
