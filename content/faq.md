+++
template = "misc.html"
weight = 100
+++

# FAQ

---


## Site

### Who is the target audience? Why don't you explain ...?

At the risk of being overly specific, the _persona_ the page is written for:

- 3+ years non-Rust programming experience (Java, Python, C, ...)
- 2+ weeks Rust experience (read a book or completed a tutorial)
- some familiarity with C-level concepts (memory, pointers)

We of course hope to provide value even if someone doesn't fall into that bucket, but not at the expense of a streamlined experience for our target audience.


### I sent a message earlier, why didn't you fix ... ?

Some of the _wontfix_ end up on Github with a brief comment why. The most common reason something didn't get fixed: The comment was too short or cryptic, and it was unclear what's actually broken.


### Why all the HTML graphics? Why don't you use images?

Images are easier to create, but harder to version. Between PNGs and SVGs, HTML had the nicest balance.


### I created X, can you link it?

Maybe. The current policy is not set in stone but is vaguely:

- To add items to an existing list the entry should be high quality and the list shouldn't grow too long.
- To add a specific link somewhere else it should be _the best of its kind_ for that purpose.


### Why the pentagram?

The pentagram has a few desirable properties:

- easier and safer to execute compared to heptagrams and tridecagrams,
- faster to draw,
- has excellent documentation spanning several centuries,
- and, most importantly, it requires less blood and is therefore more ergonomic.

In other words, the pentagram is the Rust of summoning circles.


### Are you a Satanist?

All inquiries in this matter should be directed to your bathroom mirror on a moonless night.


### Can you remove the pentagram?

The pentagram has spoken. The pentagram stays.



## Operations

### How can I build an offline copy?

On Linux & macOS the following command should work. For Windows you have to adapt `$PWD` accordingly:

```
zola build --base-url="$PWD/public/index.html" --output-dir="$PWD/public"
```


### How can I see what the deployed version is?

Click the date / subtitle line, it will give you the Git hash of the currently deployed version.



### I just formatted my drive, how do I run the deploy script?

On Windows:
- Install Git, add all Unix tools (esp. `bash`) to PATH
- In 'Environment Variables', bump Git PATH above Windows `C:\windows\system32` PATH
- Install Zola
- Install Node
- `npm install`



### How do I upgrade Prism?

- Visit [https://prismjs.com/download.html](https://prismjs.com/download.html)
- Select version: "Minified"
- Select theme: "Default"
- Select languages: "Rust" (and only Rust)
- Select plugins: "Keep Markup", "Highlight Keywords" (experimental)
- Save files and replace the ones in `static`
- In `git`, discard changes to CSS which now make the page look ugly (for example but not limited to: `font-style`, `background`, ...)


### Convert unwilling images to data URIs?

- https://ezgif.com/image-to-datauri
- Add to `postprocess.js`



## Legal

### Am I allowed to translate the page?

Yes, just go ahead. You do not need to ask for extra permission and there are no _special_ requirements. However, I would kindly ask you to [respect what is written here](/legal). The easiest way of doing that is

- Change the page footer to something like:
    ```
    Translated and hosted by [YOU], based on cheats.rs (Ralf Biedert)
    ```
- Remove my name from the "Operator" section.


### What does 'interference' mean?

Basically this work is about providing high quality content in a particular format. We respect all rights and reasonable positions (IP or otherwise) of 3<sup>rd</sup> parties. That said, if you use IP laws or similar, in a way that could be perceived as threatening, to influence content or design of our or similar works you will lose 'good standing'.

To be perfectly clear, if you are in good standing you can freely copy or re-host the work, or perform [almost any](/legal#copyright-information) change you like on your own copy, and you'd really only lose that status if you 'went around trying to enforce your will on others'.

{{ tablesep() }}
