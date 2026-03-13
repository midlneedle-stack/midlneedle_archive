This is a story about launching a small product for a niche device. But everyone has to start somewhere, right?

<SquareImage src="/cases/pebble_case/coverr.webp" alt="Case cover" />

# Why Pebble

I've always liked [Pebble](https://en.wikipedia.org/wiki/Pebble_(watch)) – they went against the grain and had their own take on wearables. E-paper screen instead of OLED, week-long battery instead of daily charging, their own OS instead of something off-the-shelf from Google. Plus they were one of the few [Kickstarter](https://en.wikipedia.org/wiki/Kickstarter) projects that actually made it.

So when I spotted a [Pebble Time](https://en.wikipedia.org/wiki/Pebble_Time) on a local marketplace, it was an instant buy. No second thoughts.

I've been wearing it for about eight years now. The company went bankrupt and changed hands a few times, but turns out that wasn't the end.

# How I started making watchfaces

YouTube's algorithm recently served me a video from [Eric Migicovsky](https://en.wikipedia.org/wiki/Eric_Migicovsky) – Pebble's founder. He's reviving the company and releasing a new model, nine years after the last one.

That whole comeback energy and the excitement in the community got me wanting to build something for the platform. I'd also been meaning to try vibe coding.

While figuring out how everything worked, I ended up making a few watchfaces. With each one, I got a better feel for the workflow – figured out my stack, got comfortable with the emulator, and finally started using GitHub properly. With all that behind me, I took on my latest watchface.

<IphoneVideo src="/cases/pebble_case/first_watchface.mp4" />
<IphoneVideo src="/cases/pebble_case/first_watchface_2.mp4" />
<IphoneVideo src="/cases/pebble_case/first_watchface_3.mp4" />

# Details

The visual design was the easy part – I already had a mockup in Figma and knew how to use AI to speed up getting from design to code.

<SquareImage src="/cases/pebble_case/general_watchface_view.webp" alt="General watchface view" />

But just porting the design over would've been boring. I wanted to make something that felt like Pebble, so I started adding details.

# Launch animation

I wanted pixels to randomly light up across the grid when the watchface launches, and for the digits to gradually emerge from the noise. After a lot of iterations, it finally came together – worth noting that most of my time went into optimizing and polishing this animation.

<IphoneVideo src="/cases/pebble_case/launch_animation.mp4" />

# Vibration pattern

I wanted the animation to have some physical feedback, like Apple's Haptics. I took one of the original Pebble OS vibration patterns[^1] as a starting point and heavily customized it. The result is a pattern of barely-there taps that lines up with the animation's timing and pace.

# Settings

Pebble SDK lets you customize pretty much any element of a watchface if you build it in. I added a few must-haves: 24/12-hour time format, toggles for vibration and animation, and theme selection.

After some research, I noticed users were missing hourly chime vibrations – a classic digital watch thing. Added that too – now there's a short, subtle buzz when the hour changes.

I also put some work into the settings page itself. Instead of the bare HTML you usually see in watchface configs, I tried to make it feel more like a modern interface.

<VideoPlayer src="/cases/pebble_case/settings.mp4" />

# Shipping it

I was happy with the result and decided to share the watchface with the community and [put it on the store](https://apps.repebble.com/en_US/application/6914dc39a0d99d0009ff09f2?section=watchfaces)[^2].

To get some reach and catch any bugs[^3], I posted in the Pebble owners' Discord. A few people even shared photos of their watches with my watchface running.

<SquareImage src="/cases/pebble_case/discord.webp" alt="Discord" />

The response was positive, so I figured why not tweet about it. Right before bed, I put together a quick post, tagged Eric Migicovsky, and hit publish.

<SquareImage src="/cases/pebble_case/twitter_post.webp" alt="Twitter post" />

Next morning, the tweet had way more engagement than I expected – especially for an account with zero followers. Turns out Eric Migicovsky [had retweeted it](https://x.com/ericmigi/status/1988761152256655776). Getting a nod from Pebble's founder was a nice feeling :)

# What's next

I'm thinking about building a few more watchfaces from my Figma backlog. I also have an idea for a watchface configurator template built with [Astro](https://astro.build/), so anyone could quickly put together a clean settings interface for their watchface.

[^1]: This was possible because they [open-sourced the system](https://github.com/google/pebble) earlier this year, so I could find the exact vibration pattern code.
[^2]: I'll admit, the watchface name – General Magic – I borrowed from a now-defunct company that tried to create what would later become smartphones back in the early 1990s. It was founded by early Apple people – Andy Hertzfeld, Bill Atkinson, Joanna Hoffman, and Susan Kare. Felt like a good reference that might remind people of this interesting project from the past. Highly recommend [the documentary about them](https://www.youtube.com/watch?v=uTdyb-RWNKo), by the way.
[^3]: One bug did get through – on the older 2014 models, the animation played way slower than intended. A [user reported it on GitHub](https://github.com/midlneedle/General_Magic_pebble_watchface/issues/1). I had to simplify it for the Classic since its specs were much weaker than Pebble Time and it just couldn't handle the full animation.
