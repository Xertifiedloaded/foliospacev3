const { MongoClient, ObjectId } = require("mongodb");

const OLD_DB_URI = "mongodb+srv://certifiedloaded:KhsBpLQcK31murUr@checkin.r5ib3.mongodb.net";
const NEW_DB_URI = "mongodb+srv://certifiedloaded:KhsBpLQcK31murUr@checkin.r5ib3.mongodb.net";

const OLD_DB_NAME = "creatify";
const NEW_DB_NAME = "foliocv";

const OLD_PROJECTS_COLLECTION = "Project";

async function migrateProjects() {
  const oldClient = new MongoClient(OLD_DB_URI);
  const newClient = new MongoClient(NEW_DB_URI);

  try {
    await oldClient.connect();
    await newClient.connect();

    const oldDB = oldClient.db(OLD_DB_NAME);
    const newDB = newClient.db(NEW_DB_NAME);

    console.log("Connected to both databases…");

    const oldProjects = await oldDB.collection(OLD_PROJECTS_COLLECTION).find().toArray();
    console.log(`Found ${oldProjects.length} old projects.`);

    for (const p of oldProjects) {
      if (!p.userId) {
        console.log(`❗ Project ${p._id} missing userId`);
        continue;
      }

      // 1️⃣ Find old user
      const oldUser = await oldDB.collection("User").findOne({ _id: new ObjectId(p.userId) });

      if (!oldUser) {
        console.log(`❗ No OLD USER found for project: ${p._id}`);
        continue;
      }

      // 2️⃣ Match new user via email OR username
      const newUser = await newDB.collection("User").findOne({
        $or: [
          { email: oldUser.email },
          { username: oldUser.username }
        ]
      });

      if (!newUser) {
        console.log(`❗ No NEW USER found for email/username of ${oldUser.email}`);
        continue;
      }

      // 3️⃣ Find CV of the matched user
      const cv = await newDB.collection("CV").findOne({ userId: newUser._id });

      if (!cv) {
        console.log(`❗ No CV for NEW USER: ${newUser._id} (${newUser.email})`);
        continue;
      }

      // 4️⃣ Build project object for the new schema
      const projectObj = {
        id: p._id.toString(),
        name: p.title || p.name || "",
        description: p.description || "",
        url: p.link || p.url || "",
        technologies: p.technologies || [],
        createdAt: p.createdAt || new Date(),
      };

      // 5️⃣ Push project into CV.projects
      await newDB.collection("CV").updateOne(
        { _id: cv._id },
        { $push: { projects: projectObj } }
      );

      console.log(`✓ Project ${p._id} added to CV for user ${newUser.username}`);
    }

    console.log("\n🎉 Projects successfully migrated!");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

migrateProjects();
