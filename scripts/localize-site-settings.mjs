import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from 'next-sanity'

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const contents = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

function loadEnvironment() {
  const cwd = process.cwd()
  loadEnvFile(path.join(cwd, '.env.local'))
  loadEnvFile(path.join(cwd, '.env'))
}

const navLabelMap = {
  Articles: 'लेख',
  Write: 'लिखें',
  Dashboard: 'डैशबोर्ड',
  'Write a story': 'कहानी लिखें',
  Writers: 'लेखक',
  Settings: 'सेटिंग्स',
  Billing: 'बिलिंग',
  'Help Center': 'सहायता केंद्र',
  Posts: 'पोस्ट्स',
  Analytics: 'एनालिटिक्स',
  'Invite Collaborators': 'सहयोगियों को आमंत्रित करें',
  'Sign out': 'साइन आउट',
  'Sign In': 'साइन इन',
  'Get Started': 'शुरू करें',
  Cookies: 'कुकीज़',
  'Privacy Policy': 'गोपनीयता नीति',
  'Terms of Service': 'सेवा की शर्तें',
}

const navGroupMap = {
  Platform: 'प्लेटफ़ॉर्म',
  Account: 'खाता',
}

function withHindiLabel(item) {
  if (!item) return item
  const nextItem = { ...item }
  if (!nextItem.labelHindi && nextItem.label) {
    nextItem.labelHindi = navLabelMap[nextItem.label] || nextItem.label
  }
  if (Array.isArray(nextItem.children)) {
    nextItem.children = nextItem.children.map(withHindiLabel)
  }
  return nextItem
}

function withHindiGroup(group) {
  if (!group) return group
  return {
    ...group,
    titleHindi: group.titleHindi || navGroupMap[group.title] || group.title,
    items: Array.isArray(group.items) ? group.items.map(withHindiLabel) : [],
  }
}

loadEnvironment()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error(
    'Missing Sanity credentials. Expected NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.'
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
  perspective: 'raw',
})

const siteSettings = await client.fetch(
  `*[_type == "siteSettings" && _id == "siteSettings"][0]`
)

if (!siteSettings) {
  throw new Error('siteSettings document was not found.')
}

const patch = {
  siteNameHindi: siteSettings.siteNameHindi || 'कॉन्टेंटफ्लो',
  siteDescriptionHindi:
    siteSettings.siteDescriptionHindi ||
    'लेखकों, क्रिएटर्स और विचारकों के लिए एक आधुनिक प्रकाशन मंच।',
  footerDescriptionHindi:
    siteSettings.footerDescriptionHindi ||
    'लेखकों, क्रिएटर्स और विचारकों के लिए एक आधुनिक प्रकाशन मंच। अपनी कहानियाँ दुनिया के साथ साझा करें और अपना पाठक वर्ग बढ़ाएँ।',
  copyrightTextHindi:
    siteSettings.copyrightTextHindi || '© 2026 कॉन्टेंटफ्लो। सर्वाधिकार सुरक्षित।',
  headerNav: Array.isArray(siteSettings.headerNav)
    ? siteSettings.headerNav.map(withHindiLabel)
    : [],
  footerNav: Array.isArray(siteSettings.footerNav)
    ? siteSettings.footerNav.map(withHindiGroup)
    : [],
  dashboardNav: Array.isArray(siteSettings.dashboardNav)
    ? siteSettings.dashboardNav.map(withHindiLabel)
    : [],
  authNav: Array.isArray(siteSettings.authNav)
    ? siteSettings.authNav.map(withHindiLabel)
    : [],
  guestNav: Array.isArray(siteSettings.guestNav)
    ? siteSettings.guestNav.map(withHindiLabel)
    : [],
  legalLinks: {
    privacy: siteSettings.legalLinks?.privacy
      ? {
          ...siteSettings.legalLinks.privacy,
          labelHindi:
            siteSettings.legalLinks.privacy.labelHindi ||
            navLabelMap[siteSettings.legalLinks.privacy.label] ||
            siteSettings.legalLinks.privacy.label,
        }
      : undefined,
    terms: siteSettings.legalLinks?.terms
      ? {
          ...siteSettings.legalLinks.terms,
          labelHindi:
            siteSettings.legalLinks.terms.labelHindi ||
            navLabelMap[siteSettings.legalLinks.terms.label] ||
            siteSettings.legalLinks.terms.label,
        }
      : undefined,
    cookies: siteSettings.legalLinks?.cookies
      ? {
          ...siteSettings.legalLinks.cookies,
          labelHindi:
            siteSettings.legalLinks.cookies.labelHindi ||
            navLabelMap[siteSettings.legalLinks.cookies.label] ||
            siteSettings.legalLinks.cookies.label,
        }
      : undefined,
  },
  notFoundPage: {
    ...siteSettings.notFoundPage,
    hindi: {
      eyebrow: '404 त्रुटि',
      title: 'पेज नहीं मिला',
      description:
        'जिस पेज को आप ढूँढ रहे हैं वह मौजूद नहीं है, हटाया जा चुका है, या अभी प्रकाशित नहीं हुआ है।',
      primaryButtonLabel: 'होमपेज पर जाएँ',
      secondaryButtonLabel: 'पोस्ट्स देखें',
    },
  },
}

await client.patch('siteSettings').set(patch).commit()

console.log(
  JSON.stringify(
    {
      patched: 'siteSettings',
      updatedFields: Object.keys(patch),
    },
    null,
    2
  )
)
