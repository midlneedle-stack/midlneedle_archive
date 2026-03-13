This was a test assignment for [Yandex Tovary](https://merchants.yandex.ru/) that I worked on late last year. There were three tasks in total. You can see the first two [in Figma](https://www.figma.com/design/5w2pVlDcVKltrrXikfAiSZ/Yandex_Internship_New?node-id=86-675&t=GCM9FnVKTUU9hoL9-1), and the third one - the one this case is about - was to think through and design an onboarding system for the product's users.

# Getting into the problem

At a kind of proto-discovery stage, I tried to understand what Yandex Tovary actually is - watched training videos, read help-center articles, asked an LLM a bunch of questions, signed up for the service (not exactly painless), and finally used it myself.

That stage helped me understand how Tovary works, what value it creates for clients, and generally grounded me before framing the problem.

# Why onboarding matters in Yandex Tovary

- Onboarding helps make the first steps easier. The service is fairly complex, with lots of terminology and requirements. If you don't explain what to do on each screen, users start getting lost. And if they really don't understand what's going on, some of them will just drop off.

- It also helps existing users learn how new features and changes work, or simply reminds them how a specific function works if they've forgotten.

- It reduces pressure on support and saves users time.

- And finally, it helps with engagement and retention.

# The business goal

From what I understood, Yandex Tovary currently works as a free tool, and the main business goal at this stage is growing the client base. Later on, those users can be offered paid features or adjacent Yandex services like Split, Direct, and Market.

For onboarding specifically, the business goal is to reduce the entry barrier for new users as much as possible and speed up growth in the number of active users.

Another important goal, in my view, is growing the segment of small and mid-sized business owners who don't have the budget to hire specialists.

# Mission for the user

Make the service easier to understand and more accessible at every step of the experience.

Getting started with a new tool is always hard. People need help taking those first few steps. And if someone comes back to Tovary after a long break, the onboarding should remind them about forgotten features and introduce any new ones.

# Audience segments

| **Segment** | **Who are they?** | **Description** | **Why do they use the service?** | **How do they use it?** | **How often?** | **What matters to them?** |
|---|---|---|---|---|---|---|
| **Small business owners (non-experts)** | Entrepreneurs and people from small companies - usually not experts in digital or e-commerce, and often without the budget to hire a specialist. | They're trying to set up sales through Yandex Tovary for the first time and come in only lightly prepared. | It helps them open a new sales channel and grow organic traffic. | They go through onboarding, upload a feed, occasionally update their assortment, check stats, and go to the help center if something breaks. | Frequently at the start, then about once a month after setup. | Everything should feel as simple as possible: minimal extra steps, visual guidance and not just text, plus support on every screen. |
| **Experienced specialists** | Marketers, SEO specialists, and other experts. | They already understand feeds, categories, analytics, and mostly want to get in, set things up, and move on. | Process optimization, quick setup, integration with other services. | They read docs, automate what they can, and fix issues quickly without needing onboarding. | Depends on the project - sometimes infrequently, but in intense bursts. | Detailed documentation, automation, shortcuts, and speed when dealing with complex cases. |
| **Returning users** | Users coming back after a break. | They know the service, but new features have appeared and the UX has changed. | They want to check analytics or upload an updated product feed. | They update their assortment and make adjustments. | Once every couple of months. | A guide to what's changed, support when coming back, and shortcuts. |
| **Analysts** | Data specialists. | They audit performance and try to understand market or channel dynamics. | They compare metrics and draw business conclusions. | They read reports, export stats, and connect them with other metrics. | Depends on the project or reporting cycle. | Data availability, breadth of analysis, and clear visualization. |

# User interviews

I talked to friends who work in marketing and adjacent fields. I wanted to understand how they use familiar and unfamiliar services, how they go through onboarding, and how they deal with difficult tasks.

<SquareImage src="/cases/yandex-tovary/screenshot_interviews.webp" alt="Interview screenshot" />

<InterviewHeading title="Diana, marketing specialist" src="/cases/yandex-tovary/diana_cut.m4a" />

### Pain points

- Long and overly detailed instructions ("I hate long instructions", "huge walls of text are always awful")

- Too much professional terminology ("there's way too much niche terminology", "for a beginner it's hard" - she was talking about Yandex Direct)

- Built-in onboarding flows are annoying and get skipped right away ("I always skip them", "they get in the way of the interface", "that onboarding system is really bad")

- Help-center search feels unintuitive, so finding the answer takes longer than solving the issue ("I spend more time searching for my problem than reading the instructions")

- It's hard to remember where things are when you use a service rarely ("my memory is bad", "for three or four months in a row I keep reopening those videos")

### How does she deal with that?

- She asks people she knows right away ("I just messaged people who had already worked with those tools and they explained everything to me")

- She first tries to figure it out on her own, and only then looks for instructions ("I go to instructions only after intuition stops working")

- She rewatches recordings where a colleague explained things ("I keep rewatching the videos I record during our calls with Artur")

- She doesn't use AI or LLMs for this ("I never go there", "there isn't a good enough model that would actually help")

### What matters to her in onboarding?

- Brevity - only what's necessary ("it really has to be brief")

- Access to guidance exactly when she needs it ("it should be easy to access whenever I don't understand something")

- Simple, understandable labels without extra jargon ("it should be something simple and clear, not 'help' or anything like that")

- Video explanations from an expert ("the most effective onboarding is when Artur joins a call and literally shows me the navigation")

### Interview takeaways

- Even experienced users get lost in terminology, so the product needs simpler language and more human explanations.

- Product education should be on demand, not forced or intrusive.

- Short, task-specific instructions and videos are much more useful than generic guides.

- If people use the service rarely, they need reminders about past actions and quick access to the right next step.

- Formal "help" language and overloaded content are irritating; people respond better to natural language, friendliness, and step-by-step guidance.

<InterviewHeading title="Egor, communication designer" />

### Pain points

- The need to find a solution to a specific task quickly, without digging into the whole product

- Long, dragged-out tutorial intros and too much irrelevant information ("they spend too much time explaining things that aren't practical")

- Pushy or mandatory onboarding that can't be skipped ("if I can't skip it, it's annoying")

- Getting lost after a break and having to remember where everything lives

- Frustration with learning experiences that aren't interactive or game-like at all

### How does he deal with that?

- If he needs to understand the basics of a complex product, he looks for a course or a YouTube video

- For a concrete task, he turns to an LLM ("ChatGPT") to get step-by-step instructions quickly

- If he's coming back after a break, he either Googles it or asks an LLM again

- He reacts positively to interactive onboarding, like tutorials in games, where the product guides you through small actions

### What matters to him in onboarding?

- The ability to skip onboarding or move through it quickly if he already knows the product

- Gamified, contextual tutorials - patterns from apps and games where you immediately start doing things instead of just reading

- Mini videos or hints right on the interface element itself ("hover and it shows you how it works")

- Onboarding built around tasks, not around the whole service

- Fewer entry barriers so users can move from learning to doing fast

### Interview takeaways

- Interactive hints and mini videos work better than long text-based guidelines

- Users need a choice: skip onboarding entirely or take a short guided path if they want one

- Focus on pain points and frequent scenarios - onboarding shouldn't try to be universal for everyone, it should follow the user's actual task

- After a long absence, the product should offer a quick memory refresh and a one-click way to replay the tutorial

- The less intrusive and the more personalized onboarding is, the higher the chance users won't get annoyed and will actually get to the outcome

<InterviewHeading title="Dasha, PR manager and former marketer" src="/cases/yandex-tovary/dasha_cut.m4a" />

### Pain points

- There's no real introduction to a new service, so she has to experiment and figure things out on her own ("first I try to understand how the service works by myself")

- Colleagues don't really walk her through things in detail, so she's left to sort it out alone ("they give me the task in two sentences and that's it")

- When a real question or difficulty comes up, it's hard to find a simple explanation - she ends up looking for tutorials, articles, or asking people who know more

### How does she deal with that?

- She first tries to understand the product on her own by following the logic of the interface

- If she gets stuck, she looks for tutorials, guides, or videos; if that doesn't help, she asks knowledgeable colleagues

- She uses AI for routine work, but not for learning interfaces ("AI for emails, for speeding up routine tasks")

### What matters to her?

- The ability to learn a service without mandatory flows and move at her own pace

- Learning about new capabilities only when the need actually appears ("local communication about a feature right in the interface")

- Short, clear explanations and help with a specific new task - ideally grounded in real-life cases

- Adapting to the service through practice, not through long onboarding sequences

- Not wasting time on long generic tutorials or help windows

### Interview takeaways

- Universal and mandatory onboarding doesn't work; what works is local, contextual guidance

- Short built-in walkthroughs with real value are much more engaging

- Guidance matters only when the task is genuinely new to the user

- Core actions and flows should feel simple and intuitive - people prefer trying to figure things out themselves first

- New features should be explained exactly where users encounter them, not somewhere far away in a centralized help area

# Benchmarking

I wanted to analyze how learning and onboarding features are handled in larger products. So I used Mobbin and went through quite a large pool of screenshots. I mainly looked at how learning systems are structured inside interfaces, what products show users at the start, and how they solve support needs later on.

<SquareImage src="/cases/yandex-tovary/screenshot_mobbin.webp" alt="Mobbin screenshot" />

**Broadly, the solutions fall into three buckets** - checklists, contextual cards, and full-screen onboarding[^1], plus windows that are triggered either by a dedicated button (say, a question mark icon) or embedded directly into interface elements to explain what changed or how a specific feature works.

<SquareImage src="/cases/yandex-tovary/image.webp" alt="Onboarding pattern references" />

<SquareImage src="/cases/yandex-tovary/image_1.webp" alt="Contextual card references" />

<SquareImage src="/cases/yandex-tovary/image_2.webp" alt="Checklist references" />

These approaches are often combined, and to me that combination is actually the most effective way to introduce something new to a user.

But before turning any of that into product hypotheses, I wanted to look for existing onboarding research online. That gives a bit more confidence about which ideas are worth building, which ones should wait, and which ones probably shouldn't make it into the solution at all.

# Existing research

- First, I read [an article by Nielsen Norman Group](https://www.nngroup.com/articles/onboarding-tutorials/). Their onboarding research argues that contextual hints and in-place learning work much better than generic help and long tutorials. If a hint shows up right next to the relevant interface element, users understand the task faster and solve it sooner.

- I also looked at [a case study on Grammarly's onboarding](https://growth.design/case-studies/grammarly-onboarding-survey) on Growth.Design, a UX resource that publishes case studies in comic format. It reinforces the same point from Nielsen Norman Group: mini-cards embedded right into the interface help users get comfortable faster and with less friction.

- When I was thinking about the feature's tone of voice, I remembered [a talk by Yulia Vorontsova](https://www.youtube.com/watch?v=83yU0J57KKU), the head of product design for one of T-Bank's B2B services. She showed how they moved away from complicated terms like "lookalike audience" on a task-selection screen and shifted to question-based phrasing that makes sense not only to analysts, but to other user segments too.

- I also found [a checklist onboarding case from a Mural test on Mobbin](https://abtest.design/tests/onboarding-checklist): switching from popups to a step-by-step checklist led to a 10% lift in weekly user retention.

# Discovery outcome

<HypothesisCard title="If onboarding is built around the user's task and level of experience, it will be more effective and less likely to overwhelm or annoy different user segments" body="Onboarding should start from the user's current task and experience level, not from an attempt to explain the whole service at once. If someone is solving a typical task and already has experience, the guidance should be shorter. If they're new, it should be fuller. Mini-video cards, explanatory windows, shortcuts, and options to replay a tutorial only work when they adapt to the scenario instead of constantly sending people off to documentation. At critical moments, like when an error appears, contextual help should kick in. And when the task is unusual, the product should offer an easy way to get an answer without forcing the user to search through the entire help center." />

<HypothesisCard title="If onboarding uses plain language instead of professional jargon, the product becomes accessible to a wider range of users" body="Onboarding should move away from specialist wording and toward simple, understandable language. Diana pointed out that too much jargon is intimidating, and Yulia Vorontsova's case reinforced that again. Realistically, it probably won't be possible to get rid of every term entirely, but the goal should be to reduce them as much as possible and explain the unavoidable ones either in brackets or behind a button." />

<HypothesisCard title="If users can choose whether to skip or close onboarding, stress and frustration go down and retention goes up" body="Users need a way to skip or dismiss onboarding cards, while still making it clear where to find them later. If mandatory onboarding can't be skipped or closed, it adds unnecessary stress and gets in the way of actually using the product." />

<HypothesisCard title="If users can leave feedback on onboarding, the learning system becomes more adaptive and relevant across more scenarios" body="There should be a simple way to rate the usefulness of each hint or card - something like 'Was this helpful?' or 'What else would you like to see?' - so the learning system can keep improving over time." />

<HypothesisCard title="If guidance about changes and new features appears locally, right when users encounter them, they'll learn those updates faster" body="Hints and learning windows about new capabilities should appear exactly where the user first runs into a new feature, not in advance and not in some centralized place disconnected from the task." />

<HypothesisCard title="A step-by-step task checklist helps users learn the service faster and engage with its key scenarios" body="This format doesn't overload the user, makes the experience feel a bit more game-like, and gives the flow room for an aha moment at the end." />

# Mockups

<VideoPlayer src="/cases/yandex-tovary/onboard_stats.mp4" />

<SquareImage src="/cases/yandex-tovary/first_one.webp" alt="First mockup" />

<VideoPlayer src="/cases/yandex-tovary/helper_closed.mp4" />

<SquareImage src="/cases/yandex-tovary/2second.webp" alt="Second mockup" />

<SquareImage src="/cases/yandex-tovary/sdsfff.webp" alt="Fourth mockup" />

<SquareImage src="/cases/yandex-tovary/djjjfkkds.webp" alt="Fifth mockup" />

# What I'd still like to do

- For each key feature, I'd create several mockup variations and run unmoderated UX tests through Pathway to figure out which version feels clearest and would likely perform best.

- Once the mockups were locked, I'd move on to micro-animations for key transitions and states to make the interface feel more polished and alive. I'd choose the animation approach together with engineering based on what is easier to integrate and support long term.

- I'd build a hi-fi prototype in code so engineering could see all states and interactions more clearly, and so hallway testing would feel closer to a real product.

- I'd roll the feature out iteratively in close collaboration with product, stakeholders, and engineering.

- The next step after that would be adding an AI assistant.

[^1]: I intentionally didn't include examples of full-screen onboarding. I think it's a weak pattern the industry is gradually moving away from. If users can skip it, they do. If they can't, they click through it without thinking. My interviews confirmed that again.
