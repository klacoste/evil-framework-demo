## Notes After Demos 1 and 2

The first two demos start pretty loose but from here will gradually tighten up. Flexibility itself isn't bad but *too much* flexibility hides problems. Demo 1 is about establishing the basics: state has a single owner, updates are explicit, selectors define how state is read, and rendering only reacts to what it subscribes to. Some shortcuts are allowed here. ie: UI components calling domain commands directly.

Demo 2 introduces time, failure, and external systems. Process state is split from entity state, async behavior is pushed into services, and side effects are forced behind clear boundaries. This is mostly about damage control. The more clearly we constrain where logic can live, the fewer “almost reasonable” interpretations the code allows, and the harder it becomes to accidentally do the wrong thing.

Future demos should exercise coordination, atomicity, and invalidation to see if our abstractions hold up.
