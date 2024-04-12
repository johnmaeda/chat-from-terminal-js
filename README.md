# OpenAI Chatting With Benefits In Terminal

This is a super stripped-down version of what you can do with LLMs and coding. If you're interested in doing more interesting things, then check out [Semantic Kernel](https://github.com/microsoft/semantic-kernel) to go many steps further!

If you're a beginner, then check out the [Cozy AI Kitchen](https://www.youtube.com/playlist?list=PLlrxD0HtieHjHoXHYSiSvpTp_sE5JhNEE) show where I'm sharing simple recipes for cooking with AI across a variety of topics that range from design all the way to dentistry. I'm not kidding ...

[![](assets/caik.jpg)](https://www.youtube.com/playlist?list=PLlrxD0HtieHjHoXHYSiSvpTp_sE5JhNEE)

## Getting Started

Have your OpenAI API key ready to input OR have it stored in your environment ahead of time with:

* `export OPENAI_API_KEY=sk-...` on MacOS/Linux
* `set VARIABLE_NAME=sk-...` on Windows

in your shell startup script or from your command line. OR, you can instead just enter your API key in the convenient dialog box that pops up when this app starts.

![](assets/apikeyask.png)

If you can get this app to run, it looks like this from within VS Code or from your regular terminal experience:

![](assets/quickdemo.gif)

## Installation

You'll need to have Node installed on your computer. That's pretty much all you need. At least I think so ...

1. Clone this repo
2. Run `npm install`
3. Run `npm start`
4. To exit hit `ctrl-c`

Enjoy!

## Todo

* I ran out of time to get streaming running. If someone out there wants to make such a PR be my guest :+).
* Wiring in Semantic Kernel by combining a backend service in .NET/C# to let me do way more with OAI etc.

## Credits

I was watching Matthew Bolaños do this and got jealous so wanted to learn how to do it myself.