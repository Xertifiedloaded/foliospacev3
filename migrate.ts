
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function migrateSubscriptions() {
  console.log("🚀 Starting subscription migration...\n")

  const stats = {
    totalPremiumUsers: 0,
    usersWithSubscription: 0,
    usersWithoutSubscription: 0,
    created: 0,
    failed: 0,
    errors: [],
  }

  try {
    const premiumUsers = await prisma.user.findMany({
      where: {
        subscriptionTier: "PREMIUM",
      },
      include: {
        subscription: true,
        payments: {
          where: {
            status: "COMPLETED",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })

    stats.totalPremiumUsers = premiumUsers.length
    console.log(`📊 Found ${stats.totalPremiumUsers} PREMIUM users\n`)
    const usersNeedingSubscription = premiumUsers.filter(
      (user) => !user.subscription
    )

    stats.usersWithSubscription = premiumUsers.length - usersNeedingSubscription.length
    stats.usersWithoutSubscription = usersNeedingSubscription.length

    console.log(`✅ Users with subscription: ${stats.usersWithSubscription}`)
    console.log(`❌ Users without subscription: ${stats.usersWithoutSubscription}\n`)

    if (usersNeedingSubscription.length === 0) {
      console.log("✨ All PREMIUM users already have subscription records!")
      return stats
    }

    console.log("🔄 Creating subscription records...\n")

    for (const user of usersNeedingSubscription) {
      try {
        console.log(`Processing user: ${user.email} (${user.id})`)
        const now = new Date()
        let startDate = user.subscriptionStartDate || now
        let endDate = user.subscriptionEndDate || new Date(now)
        if (!user.subscriptionEndDate && user.billingCycle) {
          if (user.billingCycle === "MONTHLY") {
            endDate.setMonth(endDate.getMonth() + 1)
          } else if (user.billingCycle === "YEARLY") {
            endDate.setFullYear(endDate.getFullYear() + 1)
          }
        }
        const lastPayment = user.payments[0]
        const paystackData = lastPayment
          ? {
              paystackAuthorizationCode: lastPayment.paystackAuthorizationCode,
            }
          : {}

        const subscription = await prisma.subscription.create({
          data: {
            userId: user.id,
            tier: "PREMIUM",
            status: user.subscriptionStatus || "ACTIVE",
            billingCycle: user.billingCycle,
            paystackSubscriptionCode: paystackData.paystackAuthorizationCode || null,
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false,
          },
        })

        console.log(`  ✅ Created subscription: ${subscription.id}`)
        console.log(`     Start: ${startDate.toISOString()}`)
        console.log(`     End: ${endDate.toISOString()}`)
        console.log(`     Billing: ${user.billingCycle || "N/A"}\n`)

        stats.created++
      } catch (error) {
        console.error(`  ❌ Failed for user ${user.email}:`, error.message)
        stats.failed++
        stats.errors.push({
          userId: user.id,
          email: user.email,
          error: error.message,
        })
      }
    }

    // 4. Print summary
    console.log("\n" + "=".repeat(60))
    console.log("📋 MIGRATION SUMMARY")
    console.log("=".repeat(60))
    console.log(`Total PREMIUM users:           ${stats.totalPremiumUsers}`)
    console.log(`Users with subscription:       ${stats.usersWithSubscription}`)
    console.log(`Users needing subscription:    ${stats.usersWithoutSubscription}`)
    console.log(`Subscriptions created:         ${stats.created}`)
    console.log(`Failed:                        ${stats.failed}`)
    console.log("=".repeat(60))

    if (stats.errors.length > 0) {
      console.log("\n❌ ERRORS:")
      stats.errors.forEach((err, index) => {
        console.log(`${index + 1}. User: ${err.email} (${err.userId})`)
        console.log(`   Error: ${err.error}\n`)
      })
    }

    return stats
  } catch (error) {
    console.error("\n💥 Fatal error during migration:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}


if (require.main === module) {
  migrateSubscriptions()
    .then((stats) => {
      console.log("\n✨ Migration completed successfully!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("\n💥 Migration failed:", error)
      process.exit(1)
    })
}

module.exports = { migrateSubscriptions }