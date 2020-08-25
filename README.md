KeebBot
A discord bot that provides convenient and fast means of connecting to the r/mechmarket reddit while in discord.

This bot is currently unhosted, so if you would like to add it to your own server it will take quite a few steps.


1) Create an application at https://discord.com/developers/applications
2) Create a bot for that application, give it the scopes of reading messages, writing messages, and adding reactions, then visit the resulting url, where you will be prompted to add the bot to your server.
3) On your/a new reddit account, go to https://old.reddit.com/prefs/apps/, and create a new application (you don't really need to fill out anything in particular for each value; just remember what you put.)
4) Clone this repository with `git clone git https://github.com/louismeunier/keeb-bot`
5) Install the dependencies with `npm install`
6) Create two new files; `.env` and `botconfig.json`
  a) The `.env` should contain:
    -USERAGENT=[the name of your reddit application]
    -CLIENTID=[the id of your reddit application]
    -CLIENTSECRET=[the secret of your reddit application]
    -USERNAME=[your reddit username]
    -PASSWORD=[your reddit password]
    -BOTID=[your bots id/token, found at the homepage of your discord application]
    Alternatively, you can replace any mention of these values in the main js file with the intended values; this method is simply meant to be more secure.
   b) The `botconfig.json` should contain:
    {"prefix":"#anyprefixyouwanttocontrolyourbot"}
    This json file was really the easiest way I could figure out how to allow the bot to be given custom prefixes; once online, the server owner can change the prefix with the "setprefix" command at any time.
7) Launch the bot with `node keyboardUpdater.js`. If everything was set up correctly, the bot should now appear online in your server, and is ready to use.
