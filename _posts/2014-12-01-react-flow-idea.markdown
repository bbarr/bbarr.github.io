---
layout: default
title: Structuring non-trivial React applications
tags: 
- javascript
category: code
---

I love React. And finally, I think I am happy with a pattern for organizing non-trivial React applications. This has been a work in progress for me since I started developing with React, about 6 months ago, and it has required a pretty large shift in thinking for my averagely-capable mind. But just like learning React the first time, it was absolutely worth it.

One of the early problems I had with React was with state management. As an avid backbone.js developer, the example Facebook gave with their buggy chat system hit pretty close to home. But when I saw the initial demos, with their small pockets of component state throughout the system, I decided it wasn't likely to make reasoning about the UI that much better and moved on. Then, I found Om. A Clojurescript wrapper around React, Om took React to the next logical step, and basically turned the UI into the result of one pure function. Treat all of your state as immutable and keep it as one object at the top of the system, then whenever you need to update it, simply swap it for a new state and rerender the entire UI. The immutable state allows for dirt-cheap shouldComponentUpdate calls, and React is left to do just what it was made for: really fast rendering.

So this solved my state handling issues, but then I was stuck in Clojurescript (which is great, by the way, but I can't always count on using it). I also couldn't quite find peace with fitting persistence into the picture. There are many different server calls that may need to happen during an application's life-cycle, but requiring my components to deal with more than just rendering and responding to UI events seems like a distraction for them. Plus, I had all my state in one place, so why should I allow manipulating it to be spread around all the UI components?

The answer, for now at least since no idea is good enough to last forever, is to create separate service modules. These services will receive data cursors during application rendering, just like components, so they can read and write to their proper place in the application state. They will also listen for events that are fired from our components. An event like this might look something like "CREATE\_ITEM", and pass along the raw item data from the UI. The service can catch this event, serialize, save, and use its cursor to swap out the old list of "items" with a list containing our new item. Services hide away any complexities involved in persistence and error-handling, and our components can emit events that speak clearly about the application action they need to perform without having to actually perform it. In fact, the only way they will even know that it was successful is if they are rerendered with a new set of immutable properties.

I am currently building a few apps using Firebase, and this setup is working really well. I have the services hook onto streams from Firebase with callbacks that push any synced data right into my application state. It makes for a flow of data that is incredibly easy to reason about, and I really don't see much in the way of UI state bugs anymore. If one does pop up, it is so simple to hunt down that I have started thinking of that entire class of bug as trivial. And that is a nice feeling.
