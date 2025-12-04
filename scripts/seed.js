const { PrismaClient } = require("@prisma/client")
const bcryptjs = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Hash password
  const hashedPassword = await bcryptjs.hash("demo123456", 10)

  // Create or update demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "demo@example.com",
      password: hashedPassword,
    },
  })

  console.log("✅ User created/updated:", user.email)

  // Create sample CVs
  const cv1 = await prisma.cV.upsert({
    where: { id: "sample-cv-1" },
    update: {},
    create: {
      id: "sample-cv-1",
      userId: user.id,
      title: "Senior Software Engineer",
      personalInfo: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        summary:
          "Experienced full-stack engineer with 8+ years building scalable web applications. Passionate about clean code, system design, and mentoring junior developers.",
        website: "https://johndoe.dev",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
      },
      experiences: [
        {
          id: "exp-1",
          company: "TechCorp",
          position: "Senior Software Engineer",
          startDate: "2020-01",
          endDate: "",
          current: true,
          description:
            "Led frontend architecture for B2B SaaS platform. Managed team of 3 engineers. Improved performance by 40% through code optimization.",
        },
        {
          id: "exp-2",
          company: "StartupXYZ",
          position: "Full Stack Developer",
          startDate: "2018-06",
          endDate: "2019-12",
          current: false,
          description:
            "Built and maintained web applications using React and Node.js. Implemented CI/CD pipelines reducing deployment time by 50%.",
        },
      ],
      educations: [
        {
          id: "edu-1",
          school: "State University",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2012-09",
          endDate: "2016-05",
          current: false,
        },
      ],
      skills: [
        {
          id: "skill-1",
          name: "React",
          level: "expert",
        },
        {
          id: "skill-2",
          name: "Node.js",
          level: "expert",
        },
        {
          id: "skill-3",
          name: "TypeScript",
          level: "advanced",
        },
        {
          id: "skill-4",
          name: "MongoDB",
          level: "advanced",
        },
      ],
      projects: [
        {
          id: "proj-1",
          name: "E-Commerce Platform",
          description: "Full-stack e-commerce platform with payment integration and real-time inventory management.",
          url: "https://github.com/johndoe/ecommerce",
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        },
      ],
    },
  })

  const cv2 = await prisma.cV.upsert({
    where: { id: "sample-cv-2" },
    update: {},
    create: {
      id: "sample-cv-2",
      userId: user.id,
      title: "Product Manager",
      personalInfo: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        summary:
          "Product-focused leader with 6+ years driving growth and innovation. Skilled at cross-functional collaboration, data-driven decision making, and market analysis.",
      },
      experiences: [
        {
          id: "exp-3",
          company: "ProductCo",
          position: "Senior Product Manager",
          startDate: "2021-03",
          endDate: "",
          current: true,
          description:
            "Launched 3 major product features generating $5M ARR. Increased user engagement by 60% through UX improvements.",
        },
      ],
      educations: [
        {
          id: "edu-2",
          school: "State University",
          degree: "MBA",
          field: "Business Administration",
          startDate: "2015-09",
          endDate: "2017-05",
          current: false,
        },
      ],
      skills: [
        {
          id: "skill-5",
          name: "Product Strategy",
          level: "expert",
        },
        {
          id: "skill-6",
          name: "Data Analysis",
          level: "advanced",
        },
      ],
      projects: [],
    },
  })

  console.log("✅ Sample CVs created:", cv1.title, cv2.title)
  console.log("\n🎉 Seeding completed!")
  console.log("\nDemo credentials:")
  console.log("  Email: demo@example.com")
  console.log("  Password: demo123456")
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
