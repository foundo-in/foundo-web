import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding...')

  // Create a seed user to own the demo startups
  const seedUser = await prisma.user.upsert({
    where: { email: 'demo@foundo.in' },
    update: {},
    create: {
      clerkId: 'seed_user_demo',
      email: 'demo@foundo.in',
      name: 'Foundo Demo',
      city: 'Bengaluru',
      role: 'FOUNDER',
    },
  })

  const startups = [
    {
      name: 'KrishiAI',
      tagline: 'AI-powered crop advisory for small farmers in India',
      description: 'KrishiAI uses satellite imagery and local weather data to give hyper-local crop advisory to farmers in vernacular languages. We target the 86% of Indian farmers who own less than 2 hectares and have no access to agronomists.',
      stage: 'MVP',
      city: 'Pune',
      tags: ['AgriTech', 'AI', 'Rural India'],
      lookingFor: ['Investor', 'Business Partner', 'Marketer'],
    },
    {
      name: 'HostelDesk',
      tagline: 'Modern hostel management software for Tier 2 & 3 cities',
      description: 'HostelDesk replaces Excel sheets and WhatsApp groups with a simple SaaS tool for student hostel owners. Handles rent collection, complaints, food menus, and occupancy — built for non-tech operators.',
      stage: 'GROWTH',
      city: 'Jaipur',
      tags: ['SaaS', 'PropTech', 'EdTech'],
      lookingFor: ['Investor', 'Developer', 'Co-founder'],
    },
    {
      name: 'NyayaBot',
      tagline: 'Legal aid chatbot for first-generation professionals',
      description: 'Most Indians encounter their first legal problem with no idea what to do. NyayaBot is a WhatsApp-first legal assistant that explains rights, drafts notices, and connects users to affordable lawyers. Starting with landlord-tenant and employment disputes.',
      stage: 'VALIDATION',
      city: 'Hyderabad',
      tags: ['LegalTech', 'AI', 'WhatsApp'],
      lookingFor: ['Co-founder', 'Investor', 'Mentor'],
    },
    {
      name: 'Stackd',
      tagline: 'Portfolio tracker built for Indian retail investors',
      description: 'Stackd aggregates stocks, mutual funds, crypto, and gold into one clean dashboard. Unlike Smallcase or Groww, we focus purely on portfolio analytics — XIRR, sector allocation, benchmark comparison — for the serious retail investor.',
      stage: 'MVP',
      city: 'Mumbai',
      tags: ['FinTech', 'Investing', 'SaaS'],
      lookingFor: ['Tech Co-founder', 'Designer', 'Investor'],
    },
    {
      name: 'CampusHire',
      tagline: 'Connecting college students to local internships',
      description: '90% of internships never get posted on Internshala or LinkedIn. CampusHire connects local businesses directly with students from nearby colleges — hyper-local, no resume required, skill-first matching.',
      stage: 'IDEA',
      city: 'Chandigarh',
      tags: ['EdTech', 'Jobs', 'Students'],
      lookingFor: ['Co-founder', 'Developer', 'Business Partner'],
    },
    {
      name: 'Rasoi',
      tagline: 'Dark kitchen OS for home chefs and cloud kitchens',
      description: 'Rasoi is an operations platform for home chefs and small cloud kitchens — order management, inventory tracking, and Zomato/Swiggy integration in one place. Targeting the 2L+ home chefs selling on social media with no backend.',
      stage: 'MVP',
      city: 'Delhi',
      tags: ['FoodTech', 'SaaS', 'D2C'],
      lookingFor: ['Investor', 'Marketer', 'Business Partner'],
    },
    {
      name: 'VaidyaAI',
      tagline: 'Pre-diagnosis health assistant for rural primary care',
      description: 'VaidyaAI helps ASHA workers and rural health workers do structured pre-diagnosis before a doctor visit. Reduces consultation time by 60% and flags high-risk cases early. Trained on Indian clinical data.',
      stage: 'VALIDATION',
      city: 'Bengaluru',
      tags: ['HealthTech', 'AI', 'Rural India'],
      lookingFor: ['Investor', 'Co-founder', 'Mentor'],
    },
    {
      name: 'Parchai',
      tagline: 'Vernacular tutoring marketplace for Class 6-10 students',
      description: 'Parchai connects students in Hindi-medium and regional language schools with tutors who teach in their native language. We focus on Maths and Science where language is the biggest barrier to understanding.',
      stage: 'GROWTH',
      city: 'Lucknow',
      tags: ['EdTech', 'Vernacular', 'Marketplace'],
      lookingFor: ['Investor', 'Tech Co-founder', 'Designer'],
    },
  ]

  for (const startup of startups) {
    await prisma.startup.create({
      data: {
        ...startup,
        userId: seedUser.id,
        isPublished: true,
      },
    })
  }

  console.log(`✓ Seeded ${startups.length} startups`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())