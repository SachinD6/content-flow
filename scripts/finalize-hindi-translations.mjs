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

function getPublishedId(id) {
  return id.replace(/^drafts\./, '')
}

function createPortableText(text) {
  return [
    {
      _key: 'intro',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'intro-span',
          _type: 'span',
          marks: [],
          text,
        },
      ],
    },
  ]
}

function getHindiPostMeta(sourceId) {
  const map = {
    aOxHEEeQWsCXvQhdzwOvdR: {
      title: 'लो लेटेंसी सिस्टम्स: मिलीसेकंड आपकी सोच से ज़्यादा क्यों मायने रखते हैं',
      excerpt:
        'यह लेख बताता है कि लो लेटेंसी सिस्टम्स में मिलीसेकंड का फर्क प्रदर्शन, विश्वसनीयता और उपयोगकर्ता अनुभव पर कितना असर डालता है।',
    },
    aOxHEEeQWsCXvQhdzwgyy9: {
      title: 'वेब ऐप्स को स्केल करते समय सबसे पहले क्या टूटता है',
      excerpt:
        'यह लेख बताता है कि वेब ऐप्स के बढ़ते ट्रैफिक के साथ सबसे पहले कौन से हिस्से प्रभावित होते हैं और उन्हें कैसे संभालें।',
    },
    aOxHEEeQWsCXvQhdzxFetd: {
      title: 'UI/UX सिर्फ डिज़ाइन नहीं है — यह प्रोडक्ट सोच है',
      excerpt:
        'यह लेख समझाता है कि अच्छा UI/UX केवल सुंदर इंटरफ़ेस नहीं, बल्कि बेहतर प्रोडक्ट निर्णयों का हिस्सा है।',
    },
    iR6HWOrDtSlHj93fkVTNoO: {
      title: 'तारों को निहारने का आनंद: रात के आसमान के लिए शुरुआती गाइड',
      excerpt:
        'यह शुरुआती गाइड रात के आसमान को समझने, नक्षत्र पहचानने और स्टारगेज़िंग को एक शांत शौक बनाने में मदद करती है।',
    },
  }

  return (
    map[sourceId] || {
      title: null,
      excerpt: 'इस लेख का हिंदी अनुवाद तैयार किया जा रहा है।',
    }
  )
}

loadEnvironment()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  throw new Error('Missing Sanity credentials. Expected NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
  perspective: 'raw',
})

const data = await client.fetch(`
  {
    "siteSettings": *[_type == "siteSettings" && _id == "siteSettings"][0],
    "pages": *[_type == "page" && coalesce(language->id, language, "en") == "hi"]{
      _id,
      title,
      pageType,
      "slug": slug.current,
      translationOf,
      components,
      description,
      brandName,
      tagline,
      features,
      loginPage,
      signupPage,
      dashboardWelcome,
      stats,
      activitySection
    },
    "posts": *[_type == "post" && coalesce(language->id, language, "en") == "hi"]{
      _id,
      title,
      excerpt,
      body,
      "slug": slug.current,
      translationOf
    }
  }
`)

const postTranslationBySourceId = new Map()
for (const post of data.posts) {
  const sourceId = post.translationOf?._ref
  if (sourceId) {
    postTranslationBySourceId.set(sourceId, getPublishedId(post._id))
  }
}

const siteSettingsPatch = {
  notFoundPage: {
    english: {
      eyebrow: '404 Error',
      title: 'Page not found',
      description:
        "The page you're looking for doesn't exist, was moved, or is not published yet.",
      primaryButtonLabel: 'Go to homepage',
      secondaryButtonLabel: 'Browse posts',
    },
    hindi: {
      eyebrow: '404 त्रुटि',
      title: 'पेज नहीं मिला',
      description:
        'जिस पेज को आप ढूंढ रहे हैं वह मौजूद नहीं है, हटाया जा चुका है, या अभी प्रकाशित नहीं हुआ है।',
      primaryButtonLabel: 'होमपेज पर जाएँ',
      secondaryButtonLabel: 'पोस्ट्स देखें',
    },
  },
}

await client.patch('siteSettings').set(siteSettingsPatch).commit()

const draftPagePatches = []
const publishedPagePatches = []

for (const page of data.pages) {
  const publishedId = getPublishedId(page._id)

  if (publishedId === 'translation.page.page-home.hi') {
    const nextComponents = (page.components || []).map((component) => {
      if (component._type === 'featuredPostBlock') {
        return {
          ...component,
          label: 'फ़ीचर्ड पोस्ट',
        }
      }

      if (component._type === 'tagsFilterBlock') {
        return {
          ...component,
          title: component.title || 'विषय के अनुसार पढ़ें',
          allTagLabel: 'सभी पोस्ट',
        }
      }

      if (component._type === 'postsGridBlock') {
        const nextManualPosts = Array.isArray(component.manualPosts)
          ? component.manualPosts.map((postRef) => {
              const translatedId = postTranslationBySourceId.get(postRef._ref)
              return translatedId
                ? { ...postRef, _ref: translatedId }
                : postRef
            })
          : component.manualPosts

        return {
          ...component,
          title: component.title || 'सबसे ज्यादा पढ़े गए लेख',
          emptyMessage: component.emptyMessage || 'अभी कोई पोस्ट उपलब्ध नहीं है।',
          manualPosts: nextManualPosts,
          viewAllLink: component.viewAllLink
            ? {
                ...component.viewAllLink,
                text: component.viewAllLink.text || 'सभी पोस्ट देखें',
              }
            : component.viewAllLink,
        }
      }

      if (component._type === 'pricingBlock') {
        return {
          ...component,
          title: component.title || 'सरल और पारदर्शी प्राइसिंग',
          subtitle: component.subtitle || 'अपनी ज़रूरत के अनुसार प्लान चुनें',
          plans: (component.plans || []).map((plan) => ({
            ...plan,
            name:
              plan.name === 'basic'
                ? 'बेसिक'
                : plan.name === 'pro'
                  ? 'प्रो'
                  : plan.name,
            highlightLabel:
              plan.highlightLabel === 'Most Popular'
                ? 'सबसे लोकप्रिय'
                : plan.highlightLabel,
            buttonText: plan.buttonText || 'शुरू करें',
          })),
        }
      }

      return component
    })

    publishedPagePatches.push({
      id: publishedId,
      set: {
        title: 'होम',
        components: nextComponents,
      },
    })
  }

  if (publishedId === 'translation.page.c0cdb917-1938-4bd1-ac02-51306772dea9.hi') {
    const nextComponents = (page.components || []).map((component, index) => ({
      ...component,
      title:
        component.title || (index === 0 ? 'नवीनतम लेख' : 'ताज़ा पोस्ट्स'),
      subtitle:
        component.subtitle || (index === 0 ? 'ज्ञान की दुनिया में डूब जाएँ' : undefined),
      emptyMessage: component.emptyMessage || 'अभी कोई पोस्ट उपलब्ध नहीं है।',
      viewAllLink: component.viewAllLink
        ? {
            ...component.viewAllLink,
            text: component.viewAllLink.text || 'सभी पोस्ट देखें',
          }
        : component.viewAllLink,
    }))

    publishedPagePatches.push({
      id: publishedId,
      set: {
        title: 'ब्लॉग पोस्ट्स',
        components: nextComponents,
      },
    })
  }

  if (publishedId === 'translation.page.8076ab6e-b28a-417f-959b-fc5a04b1376c.hi') {
    const nextComponents = (page.components || []).map((component) => {
      if (component._type === 'heroBlock') {
        return {
          ...component,
          title: 'कुकीज़',
          subtitle: 'हमारी कुकी नीति',
          description:
            component.description || 'यह पेज बताता है कि हमारी वेबसाइट कुकीज़ का उपयोग कैसे करती है।',
        }
      }

      return component
    })

    publishedPagePatches.push({
      id: publishedId,
      set: {
        title: 'कुकीज़',
        description:
          page.description || 'यह कुकीज़ पेज का हिंदी संस्करण है।',
        components: nextComponents,
      },
    })
  }

  if (publishedId === 'drafts.translation.page.page-auth.hi' || publishedId === 'translation.page.page-auth.hi') {
    draftPagePatches.push({
      id: page._id,
      set: {
        title: 'प्रमाणीकरण',
        brandName: 'ContentFlow',
        tagline: 'आधुनिक पब्लिशिंग टीमों के लिए CMS-आधारित प्लेटफ़ॉर्म।',
        features: [
          {
            _key: 'auth-feature-1',
            title: 'तेज़ और भरोसेमंद पब्लिशिंग',
            description: 'अपनी सामग्री को एक ही जगह से मैनेज और प्रकाशित करें।',
            icon: 'zap',
          },
          {
            _key: 'auth-feature-2',
            title: 'टीम सहयोग',
            description: 'लेखकों, संपादकों और एडमिन के लिए सरल वर्कफ़्लो।',
            icon: 'users',
          },
          {
            _key: 'auth-feature-3',
            title: 'Sanity से पूरी तरह नियंत्रित',
            description: 'पेज, पोस्ट और नेविगेशन बिना कोड बदले अपडेट करें।',
            icon: 'layers',
          },
        ],
        loginPage: {
          title: 'वापस स्वागत है',
          subtitle: 'अपने अकाउंट में साइन इन करें',
          buttonText: 'साइन इन करें',
          alternateText: 'क्या आपका अकाउंट नहीं है?',
          alternateLinkText: 'साइन अप करें',
        },
        signupPage: {
          title: 'अपना अकाउंट बनाएं',
          subtitle: 'शुरू करने के लिए साइन अप करें',
          buttonText: 'साइन अप करें',
          alternateText: 'पहले से अकाउंट है?',
          alternateLinkText: 'साइन इन करें',
        },
      },
    })
  }

  if (publishedId === 'drafts.translation.page.page-dashboard.hi' || publishedId === 'translation.page.page-dashboard.hi') {
    draftPagePatches.push({
      id: page._id,
      set: {
        title: 'डैशबोर्ड',
        dashboardWelcome: {
          message: 'वापसी पर स्वागत है, {name}',
          description: 'यहाँ आज आपकी सामग्री से जुड़ी मुख्य अपडेट दिखाई जा रही हैं।',
        },
        stats: {
          totalPosts: {
            ...(page.stats?.totalPosts || {}),
            label: 'कुल पोस्ट्स',
          },
          subscription: {
            ...(page.stats?.subscription || {}),
            label: 'सब्सक्रिप्शन प्लान',
            proText: 'सभी फीचर्स का पूरा एक्सेस',
            freeText: 'बेसिक पब्लिशिंग सीमाएँ लागू हैं',
          },
          profileComplete: {
            ...(page.stats?.profileComplete || {}),
            label: 'प्रोफ़ाइल पूर्णता',
          },
        },
        activitySection: {
          title: 'हाल की कंटेंट गतिविधि',
          viewAllLink: 'सभी गतिविधि देखें',
          emptyMessage: 'अभी तक कोई हाल की गतिविधि दर्ज नहीं हुई है।',
          tableHeaders: {
            title: 'शीर्षक',
            author: 'लेखक',
            date: 'प्रकाशन तिथि',
          },
        },
      },
    })
  }
}

for (const patch of draftPagePatches) {
  await client.patch(patch.id).set(patch.set).commit()
}

const postPatches = []

for (const post of data.posts) {
  if (!post._id.startsWith('drafts.translation.post.')) continue

  const sourceId = post.translationOf?._ref
  if (!sourceId) continue

  const hindiMeta = getHindiPostMeta(sourceId)

  postPatches.push({
    id: post._id,
    set: {
      title: hindiMeta.title || post.title,
      excerpt: hindiMeta.excerpt,
      body:
        Array.isArray(post.body) && post.body.length > 0
          ? post.body
          : createPortableText('इस लेख का विस्तृत हिंदी अनुवाद जल्द उपलब्ध होगा।'),
    },
  })
}

for (const patch of postPatches) {
  await client.patch(patch.id).set(patch.set).commit()
}

const draftsToPublish = await client.fetch(`
  *[
    (_type == "page" || _type == "post") &&
    _id in path("drafts.translation.**") &&
    coalesce(language->id, language, "en") == "hi"
  ]{
    ...
  }
`)

for (const draft of draftsToPublish) {
  const publishedId = getPublishedId(draft._id)
  const publishedDoc = {
    ...draft,
    _id: publishedId,
  }

  await client.transaction()
    .createOrReplace(publishedDoc)
    .delete(draft._id)
    .commit()
}

for (const patch of publishedPagePatches) {
  await client.patch(patch.id).set(patch.set).commit()
}

console.log(
  JSON.stringify(
    {
      patchedDraftPages: draftPagePatches.map((patch) => patch.id),
      patchedPublishedPages: publishedPagePatches.map((patch) => patch.id),
      patchedPosts: postPatches.map((patch) => patch.id),
      published: draftsToPublish.map((draft) => ({
        draftId: draft._id,
        publishedId: getPublishedId(draft._id),
      })),
    },
    null,
    2
  )
)
