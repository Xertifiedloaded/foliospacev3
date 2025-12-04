// const { MongoClient, ObjectId } = require('mongodb');

// const OLD_DB = "mongodb+srv://certifiedloaded:KhsBpLQcK31murUr@checkin.r5ib3.mongodb.net/creatify";
// const NEW_DB = "mongodb+srv://certifiedloaded:KhsBpLQcK31murUr@checkin.r5ib3.mongodb.net/foliocv";

// interface MigrationStats {
//   users: { total: number; migrated: number; failed: number };
//   cvs: { created: number; failed: number };
//   blogPosts: { total: number; migrated: number; failed: number };
//   comments: { migrated: number; failed: number };
//   likes: { migrated: number; failed: number };
// }

// const stats: MigrationStats = {
//   users: { total: 0, migrated: 0, failed: 0 },
//   cvs: { created: 0, failed: 0 },
//   blogPosts: { total: 0, migrated: 0, failed: 0 },
//   comments: { migrated: 0, failed: 0 },
//   likes: { migrated: 0, failed: 0 },
// };

// async function migrateUsers(oldDb: any, newDb: any) {
//   console.log('🚀 Starting user migration...');
  
//   const usersCollection = oldDb.collection('User');
//   const profileCollection = oldDb.collection('Profile');
//   const skillsCollection = oldDb.collection('Skill');
//   const experienceCollection = oldDb.collection('Experience');
//   const educationCollection = oldDb.collection('Education');
  
//   const newUsersCollection = newDb.collection('User');
//   const newCVCollection = newDb.collection('CV');

//   const oldUsers = await usersCollection.find({}).toArray();
//   stats.users.total = oldUsers.length;

//   for (const oldUser of oldUsers) {
//     try {
//       const profile = await profileCollection.findOne({ 
//         $or: [
//           { userId: oldUser._id.toString() },
//           { userId: oldUser._id }
//         ]
//       });
      
//       const skills = await skillsCollection.find({ 
//         $or: [
//           { userId: oldUser._id.toString() },
//           { userId: oldUser._id }
//         ]
//       }).toArray();
      
//       const experiences = await experienceCollection.find({ 
//         $or: [
//           { userId: oldUser._id.toString() },
//           { userId: oldUser._id }
//         ]
//       }).toArray();
      
//       const educations = await educationCollection.find({ 
//         $or: [
//           { userId: oldUser._id.toString() },
//           { userId: oldUser._id }
//         ]
//       }).toArray();

//       console.log(`  📊 User ${oldUser.email}: ${experiences.length} experiences, ${educations.length} educations, ${skills.length} skills`);

//       const newUser = {
//         name: oldUser.name,
//         email: oldUser.email,
//         password: oldUser.password,
//         createdAt: oldUser.createdAt || new Date(),
//         updatedAt: oldUser.updatedAt || new Date(),
//       };

//       const insertedUser = await newUsersCollection.insertOne(newUser);
//       const newUserId = insertedUser.insertedId.toString();

//       stats.users.migrated++;
//       console.log(`✅ Migrated user: ${newUser.email}`);

//       // Create CV from old portfolio data
//       await createCVForUser(
//         newCVCollection,
//         oldUser,
//         profile,
//         skills,
//         experiences,
//         educations,
//         newUserId
//       );
//     } catch (error) {
//       stats.users.failed++;
//       console.error(`❌ Failed to migrate user ${oldUser.email}:`, error);
//     }
//   }
// }

// async function createCVForUser(
//   cvCollection: any,
//   oldUser: any,
//   profile: any,
//   skills: any[],
//   experiences: any[],
//   educations: any[],
//   newUserId: string
// ) {
//   try {
//     // Build personal info - clean structure matching new schema
//     const personalInfo = {
//       fullName: oldUser.name,
//       email: oldUser.email,
//       phone: profile?.phoneNumber || '',
//       location: profile?.address || '',
//       summary: profile?.bio || '',
//       website: '',
//       github: '',
//       linkedin: '',
//     };

//     const educationsData = educations.map((edu) => ({
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       school: edu.institution || '',
//       degree: edu.degree || '',
//       field: '',
//       startDate: edu.startDate ? new Date(edu.startDate).toISOString().substring(0, 7) : '',
//       endDate: edu.endDate ? new Date(edu.endDate).toISOString().substring(0, 7) : '',
//       current: !edu.endDate,
//     }));


//     const experiencesData = experiences.map((exp) => ({
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       company: exp.company || '',
//       position: exp.position || '',
//       startDate: exp.startDate ? new Date(exp.startDate).toISOString().substring(0, 7) : '',
//       endDate: exp.endDate ? new Date(exp.endDate).toISOString().substring(0, 7) : '',
//       current: !exp.endDate,
//       description: exp.description || '',
//     }));

//     // Transform skills with generated IDs
//     const skillsData = skills.map((skill) => ({
//       id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//       name: skill.name,
//       level: skill.level.toLowerCase(),
//     }));

//     // Create CV record
//     const cv = {
//       userId: new ObjectId(newUserId),
//       title: `${oldUser.name}'s CV`,
//       personalInfo: personalInfo,
//       educations: educationsData,
//       experiences: experiencesData,
//       skills: skillsData,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     await cvCollection.insertOne(cv);

//     stats.cvs.created++;
//     console.log(`  ✅ Created CV for: ${oldUser.email} (${experiencesData.length} experiences, ${educationsData.length} educations, ${skillsData.length} skills)`);
//   } catch (error) {
//     stats.cvs.failed++;
//     console.error(`  ❌ Failed to create CV for ${oldUser.email}:`, error);
//   }
// }

// async function migrateBlogPosts(oldDb: any, newDb: any) {
//   console.log('\n🚀 Starting blog posts migration...');
  
//   const oldPostsCollection = oldDb.collection('BlogPost');
//   const oldCommentsCollection = oldDb.collection('BlogComment');
//   const oldLikesCollection = oldDb.collection('BlogLike');
//   const oldUsersCollection = oldDb.collection('User');
  
//   const newPostsCollection = newDb.collection('BlogPost');
//   const newCommentsCollection = newDb.collection('BlogComment');
//   const newLikesCollection = newDb.collection('BlogLike');
//   const newUsersCollection = newDb.collection('User');

//   const oldBlogPosts = await oldPostsCollection.find({}).toArray();
//   stats.blogPosts.total = oldBlogPosts.length;

//   for (const oldPost of oldBlogPosts) {
//     try {
//       // Find old user
//       const oldUser = await oldUsersCollection.findOne({ _id: new ObjectId(oldPost.userId) });
      
//       if (!oldUser) {
//         console.error(`  ⚠️  User not found for post: ${oldPost.title}`);
//         stats.blogPosts.failed++;
//         continue;
//       }

//       // Find new user by email
//       const newUser = await newUsersCollection.findOne({ email: oldUser.email });

//       if (!newUser) {
//         console.error(`  ⚠️  New user not found for post: ${oldPost.title}`);
//         stats.blogPosts.failed++;
//         continue;
//       }

//       // Create new blog post
//       const newPost = {
//         title: oldPost.title,
//         slug: oldPost.slug,
//         content: oldPost.content,
//         excerpt: oldPost.excerpt || null,
//         coverImage: oldPost.coverImage || null,
//         tags: oldPost.tags || [],
//         isPublished: oldPost.isPublished || false,
//         publishedAt: oldPost.publishedAt || null,
//         readTime: oldPost.readTime || null,
//         views: oldPost.views || 0,
//         createdAt: oldPost.createdAt || new Date(),
//         updatedAt: oldPost.updatedAt || new Date(),
//         userId: newUser._id,
//       };

//       const insertedPost = await newPostsCollection.insertOne(newPost);
//       const newPostId = insertedPost.insertedId.toString();

//       stats.blogPosts.migrated++;
//       console.log(`✅ Migrated blog post: ${newPost.title}`);

//       // Migrate comments
//       const comments = await oldCommentsCollection.find({ postId: oldPost._id.toString() }).toArray();
//       if (comments.length > 0) {
//         await migrateBlogComments(oldCommentsCollection, newCommentsCollection, comments, oldPost._id.toString(), newPostId);
//       }

//       // Migrate likes
//       const likes = await oldLikesCollection.find({ postId: oldPost._id.toString() }).toArray();
//       if (likes.length > 0) {
//         await migrateBlogLikes(newLikesCollection, likes, newPostId);
//       }
//     } catch (error) {
//       stats.blogPosts.failed++;
//       console.error(`❌ Failed to migrate blog post ${oldPost.title}:`, error);
//     }
//   }
// }

// async function migrateBlogComments(
//   oldCommentsCollection: any,
//   newCommentsCollection: any,
//   comments: any[],
//   oldPostId: string,
//   newPostId: string
// ) {
//   // Map old comment IDs to new ones
//   const commentIdMap = new Map<string, ObjectId>();

//   // First migrate top-level comments
//   const topLevelComments = comments.filter((c) => !c.parentId);
  
//   for (const comment of topLevelComments) {
//     try {
//       const newComment = {
//         content: comment.content,
//         author: comment.author,
//         email: comment.email,
//         website: comment.website || null,
//         createdAt: comment.createdAt || new Date(),
//         updatedAt: comment.updatedAt || new Date(),
//         postId: new ObjectId(newPostId),
//         parentId: null,
//       };

//       const result = await newCommentsCollection.insertOne(newComment);
//       commentIdMap.set(comment._id.toString(), result.insertedId);
//       stats.comments.migrated++;
//     } catch (error) {
//       stats.comments.failed++;
//       console.error(`  ❌ Failed to migrate comment:`, error);
//     }
//   }

//   // Then migrate replies
//   const replies = comments.filter((c) => c.parentId);
  
//   for (const reply of replies) {
//     try {
//       const newParentId = commentIdMap.get(reply.parentId);

//       const newReply = {
//         content: reply.content,
//         author: reply.author,
//         email: reply.email,
//         website: reply.website || null,
//         createdAt: reply.createdAt || new Date(),
//         updatedAt: reply.updatedAt || new Date(),
//         postId: new ObjectId(newPostId),
//         parentId: newParentId || null,
//       };

//       await newCommentsCollection.insertOne(newReply);
//       stats.comments.migrated++;
//     } catch (error) {
//       stats.comments.failed++;
//       console.error(`  ❌ Failed to migrate reply:`, error);
//     }
//   }
// }

// async function migrateBlogLikes(newLikesCollection: any, likes: any[], newPostId: string) {
//   for (const like of likes) {
//     try {
//       const newLike = {
//         ipAddress: like.ipAddress,
//         userAgent: like.userAgent || null,
//         createdAt: like.createdAt || new Date(),
//         postId: new ObjectId(newPostId),
//       };

//       await newLikesCollection.insertOne(newLike);
//       stats.likes.migrated++;
//     } catch (error) {
//       stats.likes.failed++;
//       console.error(`  ❌ Failed to migrate like:`, error);
//     }
//   }
// }

// function printStats() {
//   console.log('\n' + '='.repeat(50));
//   console.log('📊 MIGRATION SUMMARY');
//   console.log('='.repeat(50));
//   console.log(`\n👤 Users:`);
//   console.log(`   Migrated: ${stats.users.migrated}/${stats.users.total}`);
//   console.log(`   Failed: ${stats.users.failed}`);
  
//   console.log(`\n📄 CVs:`);
//   console.log(`   Created: ${stats.cvs.created}`);
//   console.log(`   Failed: ${stats.cvs.failed}`);
  
//   console.log(`\n📝 Blog Posts:`);
//   console.log(`   Migrated: ${stats.blogPosts.migrated}/${stats.blogPosts.total}`);
//   console.log(`   Failed: ${stats.blogPosts.failed}`);
  
//   console.log(`\n💬 Comments:`);
//   console.log(`   Migrated: ${stats.comments.migrated}`);
//   console.log(`   Failed: ${stats.comments.failed}`);
  
//   console.log(`\n❤️  Likes:`);
//   console.log(`   Migrated: ${stats.likes.migrated}`);
//   console.log(`   Failed: ${stats.likes.failed}`);
  
//   console.log('\n' + '='.repeat(50) + '\n');
// }

// async function main() {
//   console.log('🔄 Database Migration Started\n');
//   console.log('Old DB: creatify → New DB: foliocv\n');

//   const oldClient = new MongoClient(OLD_DB);
//   const newClient = new MongoClient(NEW_DB);

//   try {
//     // Connect to databases
//     await oldClient.connect();
//     await newClient.connect();
//     console.log('✅ Database connections established\n');

//     const oldDb = oldClient.db('creatify');
//     const newDb = newClient.db('foliocv');

//     await migrateUsers(oldDb, newDb);
//     await migrateBlogPosts(oldDb, newDb);

//     printStats();

//     const totalFailed = stats.users.failed + stats.cvs.failed + 
//                         stats.blogPosts.failed + stats.comments.failed + 
//                         stats.likes.failed;

//     if (totalFailed === 0) {
//       console.log('✨ Migration completed successfully with no errors!');
//     } else {
//       console.log(`⚠️  Migration completed with ${totalFailed} errors. Please review the logs above.`);
//     }
//   } catch (error) {
//     console.error('\n💥 Migration failed with critical error:', error);
//     throw error;
//   } finally {
//     await oldClient.close();
//     await newClient.close();
//     console.log('\n👋 Database connections closed');
//   }
// }

// module.exports = { main };

// if (require.main === module) {
//   main()
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
// }







import { MongoClient } from "mongodb";

const OLD_DB =
  "mongodb+srv://certifiedloaded:KhsBpLQcK31murUr@checkin.r5ib3.mongodb.net/creatify";
const NEW_DB =
  "mongodb+srv://certifiedloaded:KhsBpLQcK31murUr@checkin.r5ib3.mongodb.net/foliocv";

async function migrateUsernames() {
  console.log("🚀 Starting USERNAME migration...\n");

  const oldClient = new MongoClient(OLD_DB);
  const newClient = new MongoClient(NEW_DB);

  try {
    await oldClient.connect();
    await newClient.connect();

    const oldDb = oldClient.db("creatify");
    const newDb = newClient.db("foliocv");

    const oldUsers = oldDb.collection("User");
    const newUsers = newDb.collection("User");

    const allOld = await oldUsers.find({}).toArray();
    console.log(`Found ${allOld.length} old users\n`);

    let updated = 0;
    let failed = 0;

    for (const oldUser of allOld) {
      try {
        const result = await newUsers.updateOne(
          { email: oldUser.email }, // match by email
          { $set: { username: oldUser.username || "" } }
        );

        if (result.matchedCount === 0) {
          console.log(`⚠️ No matching new user found for ${oldUser.email}`);
          failed++;
          continue;
        }

        updated++;
        console.log(`✅ Username added for ${oldUser.email}`);
      } catch (err) {
        failed++;
        console.error(`❌ Failed updating ${oldUser.email}:`, err);
      }
    }

    console.log("\n===== USERNAME MIGRATION COMPLETE =====");
    console.log(`Updated: ${updated}`);
    console.log(`Failed: ${failed}`);
    console.log("========================================\n");
  } catch (err) {
    console.error("💥 Critical error:", err);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

migrateUsernames();
