Evil Martians tech interview question

Answer format: Please create a private Gist with your answer (don’t forget to add the .md to the end of the file name).

There are two goals of this interview:

- To check how well you understand the modern web stack from a technical perspective.
- To check how well you can present your solution and explain why you chose this approach over the others.

To do so, we ask you to use the following format:

Please start by describing the problem you want to solve and why it matters. Then walk us through your proposed solution. This format: Problem -> Solution makes it a lot easier for us to check and evaluate it.

Be as detailed as possible. Since this is an asynchronous interview, we expect you to provide more detail than you would in a Zoom interview.

The question: How would you write your own front-end framework and state manager right now, using your existing knowledge and experience? A framework is understood in the broad sense here—anything that helps organize the JavaScript code of a large web application.

This doesn’t have to be a single project; it could be an ecosystem of individual libraries.

You don’t need to invent something entirely new. It’s perfectly fine to draw inspiration from existing frameworks or approaches, but we need to understand that you know how to implement them. So, e.g., saying that your framework will use Virtual DOM is not enough; we are interested in how you will make this Virtual DOM work under the hood, at least in general details.

Pseudo-code examples are a good way to explain your API vision.

When describing the framework, at a minimum, address the following questions:

1. Which parts of the application can communicate with which? Who updates the data? How will the framework determine which parts need to be re-rendered when some data changes?
2. How will it break down complex business logic into building blocks that can be transferred from project to project? For example, the project has a search bar and search results. As the user types, the framework needs to make requests to the server with a single debouncer, handle caching and error handling separately, and send analytics to Google Analytics with another debouncer. Or, for example, how do you create a universal router or data storage logic with `localStorage` in this framework?
3. How do you organize the architecture (not the communication protocols, but the application itself) for the automatic data updates, offline operations, and automatic resolving of editing conflicts when offline work is required?
