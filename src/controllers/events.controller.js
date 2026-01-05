const { ObjectId } = require("mongodb");
const connectDB = require("../db");

const COLLECTION = "events";

/**
 * GET events
 * - by id
 * - by type=latest with pagination
 */
exports.getEvents = async (req, res) => {
  const db = await connectDB();
  const col = db.collection(COLLECTION);

  if (req.query.id) {
    const event = await col.findOne({ _id: new ObjectId(req.query.id) });
    return res.json(event);
  }

  if (req.query.type === "latest") {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;

    const events = await col
      .find()
      .sort({ schedule: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return res.json(events);
  }

  res.status(400).json({ error: "Invalid query" });
};

/**
 * POST create event
 */
exports.createEvent = async (req, res) => {
  try {
    // DEBUG LOG (TEMPORARY)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.body || !req.body.uid) {
      return res.status(400).json({
        error: "Invalid request body. uid is required."
      });
    }

    const db = await connectDB();
    const col = db.collection(COLLECTION);

    const event = {
      type: "event",
      uid: Number(req.body.uid),
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: new Date(req.body.schedule),
      description: req.body.description,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: Number(req.body.rigor_rank),
      attendees: [],
      files: req.file ? { image: req.file.path } : {}
    };

    const result = await col.insertOne(event);

    res.status(201).json({ event_id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
};


/**
 * PUT update event
 */
exports.updateEvent = async (req, res) => {
  const db = await connectDB();
  const col = db.collection(COLLECTION);

  const updates = { ...req.body };

  if (req.file) {
    updates.files = { image: req.file.path };
  }

  await col.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: updates }
  );

  res.json({ message: "Event updated" });
};

/**
 * DELETE event
 */
exports.deleteEvent = async (req, res) => {
  const db = await connectDB();
  const col = db.collection(COLLECTION);

  await col.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "Event deleted" });
};
