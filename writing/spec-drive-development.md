---
layout: layout.vto
title: Initial reactions to Spec Driven Development
date: 2025-12-10
tags:
  - AI 
  - post
---

Obviously SDD hasn't been around for very long, so understand that this is based on a single 
project I built using Github's [Spec-Kit](https://github.com/github/spec-kit). There are other SDD tools out there, and there seems 
to be a lot of variation in what many of the terms and concepts, and heck, even goals of SDD 
really are, so again, I offer this with a grain of salt. Also, note that I have been using direct LLM-driven development 
(prompting code) for months now, so I am using the pros and cons of that as a baseline against which to compare.

My goal was to build a simple offline-first personal finance tracker. Bank transactions could be 
submitted via CSV manually gathered from the user's bank. From there they could categorize, with 
some pattern matching to help suggest categories, and view different stats about their spending 
and cash flow. The whole thing would be saved to SQLite via the Origin Private File System API. 
A totally private, unplatformed experience. My favorite.

So anyway, here are my takeaways from this experiment.

### Is this supposed to be less work for me? 

Remember when you had to review roughly 10M LOC while prompting an LLM directly? Well as far as I can tell, SDD means
adding another 10M lines of markdown documentation to your plate, because Claude had a blast spitting out lengthy documentation while defining the functional specs.
I tried to give it explicit prompts for things like `/speckit.specify` calls and such, but the LLM always managed to churn out more than I expected.

It left me wondering: do I read and focus on understanding the specs while counting on the code to be fine as long as the spec-driven tests pass?
Or am I just using this to gather all of my ad hoc prompting into one process that is better documented for posterity and that means that I need to keep reviewing all of the output code?

Honestly, perhaps I am not working on the right size projects, but neither of those possibilities seems to save me effort or eye moisture.

### How much is this going to cost me exactly?

Holy smokes did this chew through tokens. If you thought an LLM could get into the weeds when you gave it bite-sized, focused prompts, just wait until you ask it 
to manage these open-ended, multi-step queries. I appreciate that this is probably a Claude issue (or a me issue) but when I 
am prompting as part of my normal development flow I *never* see it spend 10 minutes querying the web over and over for an 
answer that appears immediately when I Google it manually. Anyway, it produces a ton of text, does a 
lot of research seemingly prompted by its own thinking, and the token count goes up faster than I could ever manage with old-school ad hoc prompting.

### What is this solving?

The experience left me wondering about the point of SDD. I am familiar with the difficulty of finessing the finite context window as 
projects grow larger and larger. So perhaps this is intended to solve for that? In which case, I can't help but think that focusing on
behind the scenes contextualization strategies would be a better fix than totally reworking the DX to move us another step away from the output.

Perhaps the goal is to elevate us to a higher abstraction level, turning the specs into the new programming language which gets
compiled by LLM into what we used to think of as the human-level languages like Javascript. 

That would be cool, except:

1. Who the heck wants a stochastic compiler? Who trusts that output?
2. Natural language isn't a great choice for specifying. Oh, that's OK, you say, because a clever LLM
    can grok the subtleties of the English language and interpret meaning as if you wrote it with an actual programming language? *Please reread 1.*

### Conclusion: Playing "telephone" with bots

I came away from this experiment feeling like something didn't *feel* right. LLMs are a powerful tool, but given their non-determinism, we can't really trust them.
So the idea that we can improve a process by chaining LLM calls together is akin to improving the accuracy of the 
children's game "telephone" by adding another child into the chain. It just increases your risk and misunderstanding surface area.

Of course, to reiterate, I know that it is early days both for the concept of SDD and my understanding of it. Consider these opinions
to be a relatively hot take — I certainly do hope things develop in a direction that makes the utility more clear.
