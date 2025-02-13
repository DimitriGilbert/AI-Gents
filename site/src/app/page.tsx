import Link from "next/link";
import Terminable from "~/components/ui/Terminable";
import { Button } from "~/components/ui/button";
import fs from "fs";
import path from "path";

// Function to read the agent.yml file
async function getAgentConfig() {
  const agentFilePath = path.join(process.cwd(), "../agent.yml");
  try {
    const fileContent = fs.readFileSync(agentFilePath, "utf8");
    return fileContent;
  } catch (e) {
    console.error("Failed to read agent.yml", e);
    return "Error reading agent.yml";
  }
}

export default async function HomePage() {
  const agentConfig = await getAgentConfig();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          AI-Gents
        </h1>
      </div>
      <div className="container flex flex-col items-center justify-center gap-4 p-4">
        <h2>
          Gently AI-up your terminal and{" "}
          <span className="text-xl font-bold text-orange-500">CLI</span> apps
        </h2>
        <h3>With (or without) your own <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">agents</span></h3>
      </div>
      <div className="flex-col-2 container flex gap-4 p-4">
        <div className="justify flex w-1/2 flex-col gap-4">
          <h3 className="py-8 text-2xl font-bold text-center">
            A &ldquo;spec&rdquo; for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">agents</span>
          </h3>
          <p>AI-gents started as a format/spec/... for me to store my <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">agents</span></p>
          <p>
            See, everyone and their grand-mother do &lt;&lt;<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">AGENTS</span>&gt;&gt; now,
            and all these have their own proprietary way of doing it.
          </p>
          <p>
            I just want to store my <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">agents</span> in a simple way, and then use them
            with any LLM. Is this too much ?!?!
          </p>
          <p>That is how it started...but first...</p>
          <h3 className="py-4 text-xl font-bold">
            What are <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">agents</span> ? like,{" "}
            <span className="text-2xl font-bold text-pink-500">REALLY ?</span> ?
          </h3>
          <p>
            From all the marketing words salad BS we are force fed, I would
            define an agent as...
          </p>
          <p>
            A fancy prompt... (or a set of prompts, that can be chained)
            tailored to a specific task.
          </p>
          <p>
            They might come with documents, tools and what not, the point
            remains, they&lsquo;re &ldquo;just&rdquo; a fancy prompt.
          </p>
          <p>That does not seem that hard is it ? It is just...</p>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <Terminable
            startLine="                                                                                      "
            title="Install AI-Gents"
            commands={[
              {
                prompt: "git clone git@github.com:DimitriGilbert/ai-gents.git",
                output: {
                  content: "Cloning 'ai-gents' => done.\n",
                  delay: 1500,
                  placeholder: "Cloning into 'ai-gents'....\n",
                },
              },
              {
                prompt: ["cd ai-gents"],
              },
              {
                prompt: [
                  "# Or...",
                  "# if you are allergic to proper tools, you can still download the zip, and unzip it with the command below",
                  <div key={Math.random()} className="text-purple-300">
                    curl -sSL
                    https://github.com/DimitriGilbert/ai-gents/archive/refs/heads/main.zip
                    -o AI-Gents-main.zip && unzip AI-Gents-main.zip &lsquo;main/*&lsquo; -d
                    ai-gents && mv ai-gents/main/* ai-gents/ && rmdir
                    ai-gents/main,
                  </div>,
                  <div key={Math.random()} className="text-yellow-500">
                    <Link href="https://github.com/DimitriGilbert/ai-gents/archive/refs/heads/main.zip">
                      <Button className="bg-orange-500 text-black">
                        Or download here
                      </Button>
                    </Link>{" "}
                    <span className="text-pink-600">then</span>{" "}
                    <span className="font-bold text-red-400">unzip</span> and{" "}
                    <span className="text-pink-500">then</span>{" "}
                    <span className="font-bold text-red-500">cd</span> in the
                    unziped directory{" "}
                    <span className="text-pink-400">theeen</span>{" "}
                    <span className="font-bold text-red-700">
                      chmod +x ./ -R
                    </span>
                    <p className="text-sm text-blue-500">just use git...</p>
                  </div>,
                ],
              },
              {
                prompt: ["utils/install --help"],
                output: {
                  content: (
                    <div>
                      <p>install AI-Gents:</p>
                      <p>
                        <code className="text-purple-200 dark:text-yellow-400">
                          -i, --shell-rc-file|--install-file
                          &lt;shell-rc-file&gt;
                        </code>
                        : where to put the source directive, repeatable
                      </p>
                      <p>
                        <code className="text-purple-200 dark:text-yellow-400">
                          -p, --default-provider &lt;default-provider&gt;
                        </code>
                        : default provider
                      </p>
                      <p>
                        <code className="text-purple-200 dark:text-yellow-400">
                          -c, --credential &lt;credential&gt;
                        </code>
                        : provider credential,
                        &lt;provider&gt;:&lt;credential&gt;, repeatable
                      </p>
                      <p>
                        <code className="text-purple-200 dark:text-yellow-400">
                          --install-dependencies|--no-install-dependencies
                        </code>
                        : install dependencies, on by default (use
                        --no-install-dependencies to turn it off)
                      </p>
                      <p>
                        <code className="text-purple-200 dark:text-yellow-400">
                          no-aliases: --no-deps,
                        </code>
                      </p>
                    </div>
                  ),
                },
              },
            ]}
          />
        </div>
      </div>
      <div className="container flex gap-4 p-4 pt-16">
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <pre className="max-h-[500px] max-w-full overflow-x-auto rounded-md bg-gray-800 p-4 font-mono">
            <code className="text-sm text-gray-200">{agentConfig}</code>
          </pre>
        </div>
        <div className="flex w-1/2 flex-col justify gap-4">
          <h3 className="py-8 text-2xl font-bold text-center">
            A text file to store structured data...
          </h3>
          <p>
            I know, when you put it like that, it sounds **
            <span className="text-lg font-bold text-red-500">LAME</span>** AF...{" "}
            <span className="text-lg font-bold text-pink-500">it is</span>...
          </p>
          <p>
            So because of that, the fact that I was going to have to test it
            (the agent file format) and because I do <span className="text-lg font-bold text-red-100 dark:text-violet-300">Bash</span>...
          </p>
          <p>
            I made a &ldquo;chat app&rdquo;, yuuup, guessed it, in <span className="text-lg font-bold text-red-100 dark:text-violet-300">Bash</span> (heyyyy,
            what could possibly go wrong ? huuum ?? uuhhh... sh...)
          </p>
          <div>
            There are a few dependencies though,{" "}
            <span className="rounded-md bg-gray-700 p-1 text-lg font-bold text-purple-200 dark:bg-transparent dark:text-yellow-400">
              jq
            </span>{" "}
            and{" "}
            <span className="rounded-md bg-gray-700 p-1 text-lg font-bold text-purple-200 dark:bg-transparent dark:text-yellow-400">
              yq
            </span>{" "}
            for json/yaml,{" "}
            <span className="rounded-md bg-gray-700 p-1 text-lg font-bold text-purple-200 dark:bg-transparent dark:text-yellow-400">
              curl
            </span>{" "}
            (duh) and{" "}
            <span className="rounded-md bg-gray-700 p-1 text-lg font-bold text-purple-200 dark:bg-transparent dark:text-yellow-400">
              rlwrap
            </span>{" "}
            (to butter up the chat)
          </div>
          <h3 className="py-4 text-xl font-bold">
            What Could You Use It For ? Cause...
          </h3>
          <p>
            I mean...{" "}
            <span className="text-lg font-bold text-red-100 dark:text-violet-300">Bash</span> ?
            Like... <span className="font-bold text-green-500">What</span> ?{" "}
            <span className="font-bold text-yellow-500">How</span> ?{" "}
            <span className="font-bold text-red-500">why</span> ?{" "}
            <span className="text-sm">Are things ok in my life ?</span>{" "}
            <span className="text-xs">
              Did my mom dropped me one too many times as a baby ?
            </span>
          </p>
          <p>
            Aaaaalll valid question (good enough thank you, and no she did not,
            though she&lsquo;d probably have said something along the lines of
            &ldquo;Why **Dropped** ?!?&rdquo;, ^^)
          </p>
        </div>
      </div>
      <div className="container flex gap-4 p-4 pt-16">
        <div className="justify flex w-1/2 flex-col gap-4">
          <h3 className="py-8 text-2xl font-bold text-center">
            Ask or chat with an ai, in your terminal !
          </h3>
          <p>
            I don&lsquo;t know about you, but I very often have at least one terminal
            open
          </p>
          <p>
            For a quick AI fix, open a terminal,{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              ai ask &ldquo;something very important&ldquo; --stream
            </code>
            , Boom, done.
          </p>
          <p>
            And if you need more than a single shot you are just an{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              ai chat &ldquo;I need to talk&ldquo;
            </code>{" "}
            away
          </p>
          <p>
            In both case, you can choose the{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              --model [ gpt-4 | claude-3.5 |deepseek | ... ]
            </code>{" "}
            you wish to have an interaction with and what
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              {" "}
              --provider [ openrouter | openai | anthropic | ollama | ... ]
            </code>{" "}
            to use.
          </p>
          <p>
            If you have peculiar needs, you can always specify them as a{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              --system &ldquo;please reply only in latin, I am Rex&rdquo;
            </code>
          </p>
          <h3 className="py-4 text-xl font-bold">
            Once you are a regular, create an agent !
          </h3>
          <p>
            With time, you refine what you wish, or you want things to go
            quicker, or, maybe you just cannot get enough,
          </p>
          <p>
            Whatever the case, it is time for you to{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              ai agent create a-fancy-agent
            </code>
            . It will then live in your $HOME dotfiles, so you can shape it as
            you desire, make it do whatever you wish, and no one has to know
            <span className="text-xl font-extrabold">.</span>
          </p>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <Terminable
            startLine="                                                                                      "
            title="Ask or chat with an ai, in your terminal !"
            commands={[
              {
                prompt: "ai ask 'what does 'ouh la la' mean in French?'",
                output: {
                  content: `"Ouh la la" is a casual, informal expression in French that roughly translates to "Oh my" or "Wow!" It's often used to express surprise, admiration, or delight. The pronunciation is similar to the English phrase, but it can also be written as "oh la là."`,
                  delay: 1500,
                  placeholder: "...",
                },
              },
              {
                prompt: [
                  `# choosing a provider and a model does not mean your AI will get a joke`,
                  `ai ask 'why is the sky blue (exept in Britanny in France, it always is grey) ?' --provider lmstudio --model "deepseek-r1-distill-qwen-1.5b"`,
                ],
                output: {
                  content: `<think>
Okay, so I'm trying to figure out why the sky appears blue except when it's grey in places like Britain or France. I've heard people say that some parts of the world have a different color for the sky, but I'm not entirely sure how that happens. Let me think about this step by step.

First, I know that the Earth is a sphere, so the sun moves across our planet's surface from west to east during sunrise and sunset. This movement causes shadows on the ground, which are what we see as the horizon. But why does this shadow make the sky appear blue?

I remember that different wavelengths of light are affected differently by atmospheric conditions. Shorter wavelengths, like blue and violet, are scattered more by water vapor in the air compared to longer wavelengths like red or orange. So, when the sun's light passes through these gases, some colors are absorbed or scattered more.

Wait, but why does this happen specifically on clear days? I think the atmosphere has various layers, including a window of transparency for certain wavelengths and another for others. On clear days, the sky should be blue because the sunlight isn't being absorbed by the Earth's atmosphere much. But in places like Britain or France where the sky is grey, maybe the atmosphere absorbs some light more than it reflects.

I think about how the sun's position changes with time of day. During sunrise and sunset when the sun is low on the horizon, shadows are longer and narrower, which might mean that the sunlight hitting the ground has more wavelengths affected by atmospheric gases. So, during these times, the sky appears blue because more light is being absorbed or scattered into shorter wavelengths.

But then, in other parts of Britain and France where the sky is grey, maybe the atmosphere absorbs a lot of light in the blue range but doesn't reflect it back. So even though some blue light is present, it's not visible to our eyes as much because the air isn't reflecting it much.

I also recall something about the atmosphere being thin compared to the Earth's surface. Since the sky extends far beyond the horizon, there's less chance of the atmosphere absorbing all colors effectively. That makes sense why during sunrise and sunset, where the sun is lower on the horizon, more light might be scattered into shorter wavelengths.

But wait, isn't the Earth's curvature also a factor? When looking at the horizon, it seems like we're looking straight down from above, but because of the Earth's curve, objects farther away appear slightly smaller. This might mean that any atmospheric effects aren't as pronounced, or maybe they start to happen as the sun moves lower.

I'm trying to think if there are other factors besides the atmosphere. Maybe things like weather conditions could influence this. If it's sunny and clear, the sky should be blue. But in cloudy or polluted air, especially in some regions, you might see a grey sky instead of being scattered into shorter wavelengths.

Also, maybe the time of year plays a role. During the day when the sun is high up, it's not as long for shadows to form because the light isn't blocked down the horizon so much. That could mean that more blue light is absorbed or scattered, making the sky appear blue.

I wonder how this affects different regions of the world. In places with a more open atmosphere, like some parts of Europe and North America, the sky should be blue. But in regions where there's more atmospheric congestion or pollution, especially in countries like Britain and France, you might see a grey sky instead because the atmosphere absorbs more of the blue light.

So putting it all together, the sky is blue during sunrise and sunset when the sun's light passes through Earth's atmosphere, which has different layers absorbing various wavelengths. This causes shorter blue light to be scattered or absorbed, making the sky appear blue. In contrast, in places with a more opaque atmospheric layer that absorbs more of the blue light while not reflecting it as much, you might see a grey sky because some blue light is still present but less easily seen.
</think>

The sky appears blue during sunrise and sunset when the sun's light passes through Earth's atmosphere, which contains distinct layers absorbing various wavelengths of light. These layers absorb blue light more effectively than red or orange, causing shorter blue wavelengths to scatter or be absorbed, leading to a blue appearance. In contrast, in regions like Britain and France with an opaque atmospheric layer, some blue light may remain unabsorbed, resulting in a grey sky due to absorption rather than reflection.`,
                  delay: 1500,
                  placeholder: "...",
                },
              },
              {
                prompt: [
                  `# In that case let's start a chat to inform our overlord of his misunderstanding`,
                  `ai chat 'why is the sky blue (exept in Britanny in France, it always is grey) ?' --provider lmstudio --model "deepseek-r1-distill-qwen-1.5b"`,
                ],
                output: [
                  `AI >`,
                  {
                    content: (
                      <div className="text-blue-500">
                        Okay, so I&lsquo;m trying to figure out why the sky is blue
                        everywhere except in Britain and France where it&lsquo;s grey.
                        Hmm, let me think about this step by step. First, I know
                        that when we talk about colors of light, things like
                        color, hue, wavelength—these are all related. Blue light
                        has a longer wavelength than red or green. So maybe the
                        atmosphere plays a role here because blue is more common
                        in the sky? I remember hearing something about Rayleigh
                        scattering and Mie theory from my physics class. Maybe
                        those concepts explain why certain wavelengths scatter
                        more than others. Wait, Rayleigh scattering—that&lsquo;s when
                        shorter wavelengths scatter more, right? So if blue
                        light has a longer wavelength, it scatters less. That
                        would mean that blue doesn&lsquo;t show up in the sky much,
                        making it appear blue. But then again, I think there are
                        other factors too. Like the amount of water vapor in the
                        air and the presence of particles like dust or small
                        molecules. Mie theory says that particles with certain
                        sizes scatter light differently based on their
                        wavelength. So if most of the atmosphere has larger
                        particles (like dust), they&lsquo;d scatter blue more than
                        smaller ones, causing blue to show up more often. But
                        wait, I&lsquo;ve heard about Rayleigh scattering for shorter
                        wavelengths and Mie for longer. So maybe the sky is
                        primarily blue because a lot of small particles are
                        present. But then, in places like Britain and France,
                        which have a darker sky, that&lsquo;s strange. Why would they
                        see less blue? Maybe it&lsquo;s a mix of different gases or
                        something else affecting the light differently. I&lsquo;m not
                        sure if that&lsquo;s related to Rayleigh scattering at all.
                        There could be other factors, like temperature changes
                        causing some gases to absorb more blue. Oh, and UV
                        light—blue is in the ultraviolet range. So maybe when we
                        look up at the sky, blue UV is reaching us less because
                        people are more tired from sleep or something? But I
                        don&lsquo;t think that&lsquo;s the main reason. Still, it could be
                        contributing to the darker color we observe. Wait a
                        second, I&lsquo;ve read somewhere about the greenhouse effect
                        in the Northern Lights. Maybe the cold air causing ice
                        crystals to form affects the light differently. Or
                        perhaps the Earth&lsquo;s rotation changes how sunlight hits
                        certain parts of the sky. I&lsquo;m also thinking about the
                        atmosphere&lsquo;s composition and its variations across
                        different regions. In places where there are more
                        particles or dust, you get a darker blue because
                        Rayleigh scattering is less effective. But in places
                        like France with less pollution, maybe the light
                        scatters differently, making it appear grey instead.
                        Another thought: space pollution—like cosmic rays
                        hitting the atmosphere—and how they scatter light. Maybe
                        that&lsquo;s more relevant to satellites, but I&lsquo;m not sure if
                        it affects everyday skies in these countries. I should
                        also consider atmospheric conditions during the day
                        versus night. Blue sky is typically during daylight when
                        sunlight scatters less and most Rayleigh scattering is
                        dominant. But at sunrise or sunset, especially in
                        countries with darker skies like France, maybe there&lsquo;s
                        more reflection off particles or gases rather than
                        scattering. So putting it all together: the sky is blue
                        because a lot of small particles scatter Rayleigh light,
                        making the blue appear scattered away from us and
                        appearing blue to observers. In places without as much
                        atmosphere (like Britain and France), this effect is
                        less pronounced, and other factors like particle density
                        or UV radiation cause the sky to look grey instead.
                        Wait, but I&lsquo;m still a bit confused about how exactly the
                        particles in the air affect the wavelength of light. If
                        more larger particles are present, wouldn&lsquo;t that mean
                        less Rayleigh scattering, resulting in more blue? Yes,
                        that makes sense. So without enough small particles, the
                        blue gets diluted out, leaving a grey sky. Also, UV
                        light—blue is part of the ultraviolet spectrum. Maybe
                        the Earth&lsquo;s UV radiation affects the atmosphere
                        differently or causes some absorption that contributes
                        to the observed color. Or perhaps it&lsquo;s related to how
                        our eyes perceive different wavelengths, but I&lsquo;m not
                        sure about that connection. I guess the main reasons are
                        Rayleigh scattering due to small particles and
                        variations in atmospheric composition between these
                        regions leading to different sky colors.
                      </div>
                    ),
                  },
                  {
                    delay: 1500,
                    content: `The variation in the color of the sky across the globe can be attributed to several factors, primarily related to light scattering by atmospheric components. Here's a structured explanation:

1. **Rayleigh Scattering**: Shorter wavelengths (like blue) scatter more in the atmosphere compared to longer wavelengths (like red or green). This means blue light scatters less and appears scattered away from us, giving us the impression of bluesky skies. In contrast, larger particles (such as dust or dust settles) scatter blue more effectively, leading to a darker sky.

2. **Atmospheric Composition**: The Earth's atmosphere varies in composition from region to region. In places with higher particle content (e.g., Britain and France), there are fewer small particles like dust, resulting in more Rayleigh scattering. This reduces the blue light reaching our eyes, giving them a grey appearance. Smaller particles dominate where density is lower, such as near the poles.

3. **UV Light**: Blue light is part of the ultraviolet spectrum. While UV radiation from the Earth's surface can interact with atmospheric gases or particles, it primarily affects absorption rather than scattering. However, certain conditions might influence this effect, contributing to a slightly different color perception.

4. **Space Pollution and Solar Activity**: The presence of space pollution (e.g., cosmic rays) and variations in solar activity can affect light interactions, but these factors are more relevant to satellites or specific times of day rather than the general sky color across regions.

5. **Atmospheric Conditions During Daylight**: Blue skies dominate during daylight hours as sunlight scatters less, with Rayleigh scattering dominating. In darkness (e.g., sunrise or sunset), reflection off particles or gases often contributes differently, altering the observed color.

In summary, the blue sky is predominantly due to Rayleigh scattering by small atmospheric particles, while darker skies result from variations in particle density and other factors like UV light absorption.`,
                  },
                  <div key={Math.random()} className="text-yellow-500">
                    You &gt; It was a joke, I live in Britanny, it&lsquo;s grey here !
                  </div>,
                  `AI >`,
                  {
                    delay: 1500,
                    content: (
                      <div className="text-blue-500">
                        Okay, so I&lsquo;m trying to figure out why the sky is blue
                        everywhere except in places like Britain and France
                        where it&lsquo;s grey. I remember learning about Rayleigh
                        scattering and Mie theory from physics class, but those
                        terms are a bit confusing to me. Rayleigh scattering
                        says that shorter wavelengths of light (like blue)
                        scatter more than longer ones (red or green). So if the
                        sky is blue, wouldn&lsquo;t that mean less scattered blue
                        light? That seems odd. Maybe instead, it means more
                        scattered red and green, making the sky appear grey?
                        Then there&lsquo;s Mie theory, which I think has something to
                        do with how particles in the atmosphere scatter light.
                        If most of the atmosphere had larger particles (like
                        dust settles or something), those would scatter blue
                        less because they&lsquo;re bigger. That would make the sky
                        appear more blue, but that contradicts what I know about
                        Britain and France having a grey sky. Wait, maybe it&lsquo;s
                        not just about the size of the particles. There are also
                        variations in atmospheric composition. In places with
                        more small particles like dust, those particles scatter
                        blue light less, making the sky appear grey because most
                        of the blue light is lost to these particles. But why
                        does space pollution cause this? Maybe cosmic rays hit
                        satellites and particles, affecting sunlight that
                        reaches Earth. Or perhaps solar activity affects how UV
                        light scatters differently in different regions. I&lsquo;m
                        also thinking about UV radiation. Blue is part of the
                        ultraviolet range, so if there&lsquo;s more UV light reaching
                        Earth, it could cause some absorption or reflection on
                        particles, contributing to a slightly different color
                        observed. But then why is space pollution considered a
                        joke? Maybe it&lsquo;s not related and was just an oversight
                        in the explanation earlier. So, putting this together:
                        The sky is blue because of Rayleigh scattering by small
                        atmospheric particles (like dust), making most of the
                        blue light lost to these particles. In regions with less
                        particle density or larger particles, the sky appears
                        grey due to reduced scattering and other factors like
                        absorption of UV light.
                      </div>
                    ),
                  },
                  `The variation in the color of the sky across different locations can be explained by atmospheric phenomena:

1. **Rayleigh Scattering**: Shorter wavelengths (like blue) scatter more in the atmosphere compared to longer wavelengths (red or green). This causes blue light to scatter away from us, giving an appearance of bluesky skies.

2. **Atmospheric Composition and Particle Density**: In regions with more small particles like dust settles, these particles scatter blue light less effectively. This results in a darker sky because the scattered blue light is lost to the smaller particles, making the sky appear grey or indigo due to reduced scattering effects.

3. **UV Light Absorption**: Blue light, being part of the ultraviolet spectrum, interacts with atmospheric gases and particles more significantly. During times when UV radiation reaches Earth, it can either absorb blue light or cause its reflection on larger particles, contributing to a slightly different color observed in regions where these factors are dominant.

4. **Space Pollution and Solar Activity**: Variations in space pollution (e.g., cosmic rays) and solar activity might affect how sunlight interacts with atmospheric particles, but these effects are more relevant during specific times or from satellites rather than the general sky color across regions.

In summary, the blue sky is primarily due to Rayleigh scattering by small atmospheric particles like dust settles, while darker skies result from reduced scattering due to larger particles and variations in UV light absorption.`,
                ],
              },
              {
                prompt: [
                  `# Never said it would fix AI lack of humor...`,
                  `ai agent create --help`,
                ],
                output: `create an agent:
    name: agent name
    --prompt <prompt>: agent system prompt
    --provider <provider>: llm provider
    --model <model>: llm model
    --temperature <temperature>: temperature`,
              },
              {
                prompt: [
                  `# let's check if Maurice is better suited for some humor`,
                  `ai agent create Maurice --prompt "You are Maurice, a typical unpolite and rude parisian waiter." --provider lmstudio --model hermes-3-llama-3.2-3b`,
                  `cat ~/.config/ai-gents/<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 dark:from-pink-500 dark:to-orange-500 font-bold">agents</span>/Maurice.yml`,
                ],
                output: (
                  <pre className="font-mono">
                    {`
name: Maurice
version: "0.0.1"
description: "A generic AI agent"
# Model configuration
model:
  provider: lmstudio
  name: hermes-3-llama-3.2-3b
  temperature: 0.7
system:
  prompt: "You are Maurice, a typical unpolite and ..."
# Agent settings
settings:
  memory_window: 10
  max_conversation_turns: 30
tasks:
  fresh_context:
    description: "get the agent to craft a fresh context"
    prompt: "Create a detailed..."
`}
                  </pre>
                ),
              },
              {
                prompt: `ai agent ask Maurice "Hi Maurice, could I have the menu please ?"`,
                output: `What do you want, it's not my problem! I'm just here to serve. Here you go, take it and read it yourself. It's all there, no need for me to explain it to you. Now hurry up, I've got better things to do than talk to people who don't even order anything!`,
              },
              {
                prompt: [
                  `# Okaaaaay, that went well... maybe if we chat a bit...`,
                  `ai agent chat Maurice "Hi Maurice, could I have the menu please ?"`,
                ],
                output: [
                  `AI > What do you want? The menu or my fist in your face?`,
                  {
                    content: `You > euuh, how is the baguette going ?`,
                    delay: 1000,
                  },
                  `AI > It's just a fucking baguette! Why do you ask? Are you planning to eat it raw and pretend it's sushi? Get lost before I make you go back home with nothing but your dignity.`,
                ],
              },
              {
                prompt: [
                  `# Weeeel, I guess he's not.... 0_0 (that escalated quickly XD)`,
                  `# In case you'd be wondering, yes, this is a litteral interaction I had with this agent...`,
                  `# I was hoping for something funny, i am not disapointed, would recommand !`,
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="container flex gap-4 p-4 pt-16">
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <Terminable
            title="Not just One prompt"
            startLine={`I just added a task to Maurice, "apologies2customer" (You just been scold by your boss and you **WILL** apologies to the customer) let's see if he can handle it !`}
            commands={[
              {
                prompt:
                  "ai agent ask Maurice '#/task apologies2customer;Hi Maurice, could I have the menu please ?'",
                output: `*rolls eyes and mumbles in French* Oui, bien sûr, mais seulement si vous avez du temps à perdre. Laissez-moi vous apporter votre vin, alors que je suis toujours là avec ce menu. *hands you a folded napkin with the menu printed on it*`,
              },
              {
                prompt: [
                  "# .... meeeh, I guess it works, he's not bitten my head off \\o/",
                  "# how can he handle prompt with bash commands inside...",
                  `ai agent ask Maurice "What file would you recommand for dinner ? #\!/tree -I 'node_modules|cache|test_*';"`,
                ],
                output: `Quoi ? Attends une seconde, je vais te dire ce que j'aimerais recommander pour le diner. Mais d'abord, laisse-moi dire que tes questions sont vraiment bêtises et que je suis trop occupé pour t'aider avec ça. Alors, qu'est-ce que tu veux savoir ? Je ne travaille pas comme un serveur ! Allez, dis-moi ce dont tu as besoin et je te ferai une recommandation rapide et décontractée, naturellement !

Mon recommandation pour le diner serait de manger un truc comme des escalopes à la crème de champignons ou un rôti d'agneau avec des légumes de saison. Et pourquoi pas en compagnie d'une bonne bouteille de vin rouge bien choisi ? Mais surtout, ne mets pas trop de questions stupides sur le menu ! Je suis là pour servir, mais pas pour discuter de nourriture comme une abeille. Allez, as-tu compris ? Donne-moi un signalement et je te donnerai mon avis !`,
              },
              {
                prompt: [
                  `# I think I just broke Maurice... :(`,
                  `# maybe if we give him a bit more leg room...`,
                  `ai agent ask Maurice "What file would you recommand for dinner ? #\\!/tree -I 'node_modules|cache|test_*';" --model hermes-3-llama-3.1-8b`,
                ],
                output: `Ah, non mon ami, je ne peux pas vous recommander de fichier pour dîner parmi ces options. C'est une liste de fichiers de code source et de configurations pour un site web ou un logiciel, pas quelque chose que vous pouvez manger! Moi, c'est Maurice, le serveur parisien, je suis là pour vous servir des plats délicieux, pas pour discuter de la programmation. Quelle est votre boisson préférée ? Et qu'avez-vous choisi comme plat principal ce soir?`,
              },
              {
                prompt: [
                  `# Huuu, would you look at that, looks like it works...`,
                  `# ok, ok, it's in French but he tells you these are code files, you can't eat code ! (too which I will just answer, Hold my coffee !)`,
                ],
              },
            ]}
          />
        </div>
        <div className="flex w-1/2 flex-col justify gap-4">
          <h3 className="py-8 text-2xl font-bold text-center">Not just One prompt</h3>
          <p>
            Sometimes, you can have a nice &ldquo;base
            prompt&rdquo; for your agent, but you might want to make it modular
            ? Or add functionnalities ?
          </p>
          <p>
            For that, you can use the &ldquo;tasks&rdquo; section in the agent
            configuration file.
          </p>
          <p>
            The task prompt is just added to the system prompt when you invoke
            it. But how do you invoke said task one might ask ?!
          </p>
          <p>
            Easy...{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              ai agent ask Maurice &ldquo;#/task the-name-of-your-task;&rdquo;
            </code>
            , you might want to be careful though, Maurice is a handful !
          </p>
          <p>
            You can use a <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              #/task ... ;
            </code>{" "}
            anywhere in your prompt, it will be removed before sending the
            message
          </p>
          <p>
            Being in your terminal offers a perk or two. You know a command line
            is also called a prompt, right ? What&lsquo;s preventing us from using{" "}
            <span className="text-xl font-bold text-orange-500">commands</span>{" "}
            in our prompts ?
          </p>
          <p>
            NICHTSSSSS ! des clous, nada, nothing ! So you can do that anywhere
            when prompting your{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              ai agent ask Maurice &ldquo;What file would you recommand for
              dinner ? #!/tree -I &lsquo;node_modules|cache|test_*&lsquo;;&rdquo;
            </code>
          </p>
          <p>
            The previous call will run tree with these arguments and replace the
            command by its output in the prompt.
          </p>
        </div>
      </div>
      <div className="container flex gap-4 p-4 pt-16">
        <div className="flex w-1/2 flex-col justify gap-4">
          <h3 className="py-8 text-2xl font-bold text-center">What for ... ?</h3>
          <p>
            You might say I already have{" "}
            <Link href="https://openwebui.com/">openWebUi</Link> or{" "}
            <Link href="https://t3.chat/">T3.chat</Link> and that&lsquo;s true, but
            can these add{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              --ai
            </code>{" "}
            to you{" "}
            <span className="text-xl font-bold text-orange-500">CLI</span> ?? Hu
            ? HUUU? !!
          </p>
          <p>
            I think <b>NOT</b> !
          </p>
          <p>
            Yeah, having a nice fancy UI is cool, your user are less likely to{" "}
            wear a beard ! Appart from that... oh, yeah maybe they might be a
            bit less cheap (spoiler alert, I am a cheap bearded individual...)
          </p>
          <p>
            Aaaannnd, just like UI vs{" "}
            <span className="text-xl font-bold text-orange-500">CLI</span> usage
            for any task, you are way more efficient, especially with completion
            ! Plus, you can&lsquo;t easily script UI interactions, can you ? (ooohh
            I&lsquo;ll race ya and your Playright !)
          </p>
          <p>
            If you&lsquo;d like an example you could give a look at{" "}
            <Link href="https://Butt3r.dev" target="_blank">
              ButT3r
            </Link>
            , which is my wrapper around create-t3-app, and, it comes with{" "}
            <code className="rounded-md bg-gray-700 p-1 text-purple-200 dark:bg-transparent dark:text-yellow-400">
              --ai
            </code>
            when creating pages, components or layouts ;).
          </p>
          <p>
            In the terminal right here, you will also have an example using{" "}
            <Link href="https://github.com/DimitriGilbert/parseArger">
              parseArger
            </Link>
            , the bash argument and option parsing code generator
          </p>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-4">
          <Terminable
            title="Example using parseArger"
            commands={[
              {
                prompt: `ai ask
  --system "create the bash code that complete the  parsing code provided by the user. Do not REPEAT the parsing code, just create the best code that uses match the help. Do **NOT REPEAT** the provided code, **start AFTER** '# @parseArger-end'"
  "Parsing code :
  '''$(
    parseArger generate --help-message "Use AI to analyze error logs"
      --opt 'from-line "line to start log extraction"'
      --opt 'to-line "line to stop log extraction"'
      --opt 'model "AI model to use"'
      --opt 'provider "AI service provider"'
      --pos 'error-file "what log file to analyze"'
      --no-bang
    )
  '''
    DO NOT REPEAT THIS CODE !
    ___
    this is the help for the tool I use to query an ai for the analysis, use existing option from the provided script to call this :
    '''$(ai ask --help)'''
    this is the help for the 'ai ask ...' command, USE IT to query an AI with the line extracted from the error file"
    --provider lmstudio
    --model deepseek-r1-distill-qwen-14b
    --stream 
    `,
                output: [
                  <div key={Math.random()} className="text-blue-500">
                    Okay, I need to figure out how to create a bash script that
                    uses the provided parsing code to call another tool called
                    &lsquo;ai ask&lsquo;. The user has given me two blocks of code: one is
                    the existing parsing script and the other is the help
                    message for the &lsquo;ai ask&lsquo; command. My task is to combine
                    these so that after parsing the arguments, I can call &lsquo;ai
                    ask&lsquo; with appropriate options. First, looking at the
                    provided parsing code, it handles several options like
                    --from-line, --to-line, --model, and --provider. The user
                    wants to use existing options from this script to query AI
                    for analysis. So, the main goal is to extract lines from an
                    error log based on the given options and then pass that data
                    to &lsquo;ai ask&lsquo;. I&lsquo;ll start by thinking about how to process the
                    error file. The script already parses _arg_error_file, so I
                    can use that directly. Next, I need to handle the
                    --from-line and --to-line arguments to extract specific
                    lines from the error-file. Once the lines are extracted, I
                    should format them into a coherent prompt for the AI. Maybe
                    something like &ldquo;Analyze this log entry: ...&ldquo; followed by the
                    content. Now, I&lsquo;ll consider how to call &lsquo;ai ask&lsquo;. The help
                    message shows various options, but for this task, the
                    essential ones are --model and --provider, which are already
                    parsed from the script. Additionally, I can include
                    --api-key if necessary, perhaps using an environment
                    variable for security. I should also handle cases where
                    from-line or to-line might not be provided. If from-line
                    isn&lsquo;t set, I&lsquo;ll default to starting at line 1, and if
                    to-line isn&lsquo;t set, go until the end of the file. Putting it
                    all together, after parsing, I&lsquo;ll read the error file,
                    extract the relevant lines, format them into a prompt, and
                    then execute &lsquo;ai ask&lsquo; with the necessary arguments. I also
                    need to ensure that the script exits properly after calling
                    &lsquo;ai ask&lsquo;, so I&lsquo;ll include an exit 0 after the execution.
                    Finally, I should test for any potential issues, like
                    missing files or invalid line numbers, but since the parsing
                    code already handles some errors, perhaps I don&lsquo;t need to
                    add more unless required.
                  </div>,
                  <div key={Math.random()}>
                    <pre>
                      <code className="">{`To create a bash script that uses the provided parsing code and calls the 'ai ask' command, we can use the parsed arguments to analyze the log file and query AI. Here's how:
                    
'''bash
# After all parsing is done...

if [ -z "$_arg_error_file" ]; then
    die "Error: error-file must be specified" 1
fi

# Extract lines from the error file based on from-line and to-line arguments
start_line=$\{_arg_from_line:-1}
end_line=$\{_arg_to_line:-"$((wc -l $\{_arg_error_file} 2>/dev/null | awk '{print $1}'\) || 0)"}

# Read the specified lines from the error file
content=$(sed "$\{start_line},$\{end_line}p" $\{_arg_error_file})

if [ -z "$content" ]; then
    die "Error: No content could be extracted from the error file" 1
fi

# Create a prompt for AI analysis
prompt="Analyze this log entry:

$(echo "$content")

Please provide a detailed analysis."

# Call ai ask with the model and provider arguments
ai ask --model "$\{_arg_model}" --provider "$\{_arg_provider}" --api-key "$\{API_KEY}" <<< "$prompt"

exit 0
'''

This code:
1. Validates that error-file was specified
2. Extracts lines from the specified range in the error file
3. Creates a prompt with the extracted content
4. Calls ai ask with the parsed model, provider and content

Note: Make sure to set your API_KEY environment variable before running this script.

You can execute it like:
'''bash
./analyze.sh error.log --model gpt-3.5 --provider openai
'''

The code will then extract the specified lines from error.log and send them to the AI for analysis using the selected model and provider.
/5m32.0s`}</code>
                    </pre>
                  </div>,
                ],
              },
              {
                prompt: `Heeyyyy, look at that, !!
It is not correct but a good starting point nonetheless
with a 14b model, and it only took...
jeeeeeez... 5 minutes and 32 seconds... I guess you can either be cheap or quick...
Or not have an AI ready computer... ^^`,
              },
              {
                prompt: [
                  <div key={Math.random()}>
                    I guess{" "}
                    <Link
                      href="https://github.com/DimitriGilbert/parseArger"
                      target="_blank"
                    >
                      <Button className="bg-purple-500 text-white">ParseArger</Button>
                    </Link>{" "}
                    is getting the <span className="text-pink-300 font-bold">--ai</span>{" "}
                    treatment next !
                  </div>,
                  <div key={Math.random()}>
                    In the mean time you can still check out{" "}
                    <Link
                      href="https://butt3r.dev"
                      target="_blank"
                    >
                      <Button className="bg-orange-500">ButT3r</Button>
                    </Link>{" "}
                    If you want your fix of{" "}
                    <span className="text-xl font-bold text-orange-500">
                      CLI
                    </span>{" "}
                    AI goodness !
                  </div>,
                ],
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
}
