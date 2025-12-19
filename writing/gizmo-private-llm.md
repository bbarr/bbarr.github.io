---
layout: layout.vto
title: Kicking the tires on WebLLM
date: 2025-12-18
tags:
  - AI 
  - post
---

I have always been fascinated by projects like [Wealthfolio](https://wealthfolio.app) that offer old-world goodies like privacy, no subscriptions, and full control of your own data.

When I ran into [WebLLM](https://github.com/mlc-ai/web-llm) I wondered if it would open up new potential for building powerful but private and offline-ready experiences for the web.
So I went ahead and built a little personal finance tracking app that would allow me to interact with my banking transaction history via natural language. So did it work? Did WebLLM live up to its promise?

**I think the answer is a qualified yes.**

Let's start with a basic premise. I have some bank account transactions in CSV format. I don't want to share this with a 3rd party becuase, well, its mine. And I definitely want 
to keep the model size to a minimum as even with caching it is a noticeable wait to load the LLM into memory. No one likes to wait.

### The naive first effort

So I started by simply passing the CSV content along with the user's prompt (such as, "What was my biggest expense?") to the model for answering.
Well that didn't work so well. Smaller models come with smaller context windows and even a small list of transactions will cause it to explode and throw a "context overflow" error.
*We will have to be cleverer than this.*

### Use the code, Luke

This got me going down the promising path of multi-stage prompting. The app would:

1. Parse the CSV into JSON in memory.
2. Send the header columns along with the prompt into LLM, asking for a Javascript function that would take transactions and return the relevant data needed to answer the prompt.
3. Evaluate the generated function, passing the result along with the original prompt back into the WebLLM. This is the response I would show to the user

Closer! I defeated the context window problem but was surprised at the inconsistent quality of the small model's generated Javascript.

### SQL to the rescue

SQLite is another amazing technology that can run in the browser and offers persistent storage with a well-known query language. Perhaps the little LLM that couldn't *could* with SQL.

So I updated the above process to request SQL rather than a Javascript function, and the results were noticeably better and more consistent. Plus, the database could be saved on the local 
file system via the [Origin Private File System](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) so any preprocessing of data could be done once.

### *Pretty* good now...

So far so good. I am able to ask simple questions and get simple answers. The small LLM is still not the greatest at building complex SQL queries. I found two improvement paths that both came with trade-offs:

1. **Use a high-powered hosted LLM to handle the SQL generating step.** Since the prompt wouldn't include any of the banking data itself it would still be fairly private. The downsides being that you have to 
use the big, hosted, costly, not private models you were trying to avoid before, and there is still a chance that some private data could get through if the user included it in their prompt. One could try to 
pre-process the prompt and replace sensistive information with random tokens, then plug in the real data when the SQL comes back, but that is obviously not a perfect fix.
2. **Send the small model some "tools" by baking them into the context window and asking it to request a tool call with arguments.** This can be done in a loop, giving it each successive tool response until 
it thinks it has enough data to answer the original prompt. I set this up so that the tools generate SQL query templates with variables for the model to fill in as needed 
It works pretty well and is even more consistent in getting the right SQL for a given prompt. There are still context window size issues to be fought with here, but it is mostly doable if you can convince the model
to break issues down into smaller steps.

### Conclusion

This experiment was eye-opening to me because I had never considered the idea of asking a web page to run its own LLM before. WebLLM is really well done and has so far worked right out of the box for me.
I wouldn't say it isn't production ready, but you won't be solving just any old problem with an embedded LLM. The problem either needs to require its unique properties (privacy, offline-friendly, free as in pizza), or else 
the complexity of the prompts need to be simple enough to work with a small model. If you want to load a larger model, of course, you can, but the user experience will be unconventional (think 10 minutes waiting for the model to load the first time, and a minute each subsequent load from cache).

But this will probably only get better over time. I think WebLLM, and embedded open-source LLMs in general, already have a place in the right context, and I expect to see that context grow over time. Staying free of paid platforms is also a great way to 
stay clear of any shenanigans pulled by the big co's when they decide to try and make a profit on all this, so, it would be wise to get used to being independent early and often.
