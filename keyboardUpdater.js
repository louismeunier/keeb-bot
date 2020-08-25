const Discord = require('discord.js');
const PaginationEmbeds = require('discord-paginationembed')

const Snoowrap = require('snoowrap');

const { create } = require('domain');
const { Embeds } = require('discord-paginationembed');

require('dotenv').config();
const botconfig = require('./botconfig.json');
const bot = new Discord.Client();

const r = new Snoowrap({
    userAgent: process.env.USERAGENT,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
});

bot.on('ready', ()=>{
    console.log('Bot is online');
    bot.user.setActivity(`${botconfig.prefix}`,{ type: 'LISTENING' })
 });

bot.on('message', async msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(botconfig.prefix)) return;

    const message = msg.content.slice(botconfig.prefix.length).split(' ');
    const command = message[0];
    const args = message.slice(1,message.length).join(' ');

    if (command=='mm') {
        var limit = parseInt(message.slice(1,message.length)[0]);
        var rawFlair = message.slice(2).join(" ").toLowerCase();
        console.log(rawFlair);
        
        var flair = rawFlair.indexOf(" ")===-1? rawFlair.charAt(0).toUpperCase()+rawFlair.slice(1) : rawFlair.charAt(0).toUpperCase()+rawFlair.slice(1,rawFlair.indexOf(" "))+" "+rawFlair.charAt(rawFlair.indexOf(" ")+1).toUpperCase()+rawFlair.slice(rawFlair.indexOf(" ")+2);
        console.log(flair)
        const flairs = ["Selling","Trading","Artisan","Interest Check","Group Buy","Meta","Buying"]
        if (flairs.indexOf(flair)===-1) {
            msg.channel.send(`Invalid flair parameter. Use \`${botconfig.prefix}help\` for help`)
            return;
        }
        
        if (isNaN(limit) || limit>20) {
            msg.channel.send(`Invalid limit- must be an integer, less than or equal to 20. Use \`${botconfig.prefix}help\` for help`);
            return;
        }
        var embeds = [];
        r.getNew('mechmarket',{limit:limit})
            .map((post,index)=> 
            {if (post.link_flair_text == flair) return new Discord.MessageEmbed()
                                                        .setTitle(post.title.slice(0,255)||null)
                                                        .setAuthor('u/'+post.author.name||null)
                                                        .setTimestamp(new Date(0).setUTCSeconds(post.created_utc))
                                                        .setDescription(post.selftext.replace("&#x200B;","\n").slice(0,2000)+`\n\n***${post.link_flair_text||'unknown'}***`)
                                                        .setURL(post.url||null)
                                                        .addFields(
                                                            { name: 'PM',value: `[${'u/'+post.author.name}](https://www.reddit.com/message/compose/?to=${post.author.name}/)`, inline:true},
                                                            { name: 'Upvotes', value: post.ups||0, inline:true},
                                                            { name: 'Downvotes', value: post.downs||0, inline:true},
                                                            { name: 'Comments', value: post.num_comments||0, inline:true}
                            )
                        }
            )
            .then(item=>embeds=item.filter((element)=>{return element!==undefined}))
            .then(()=>createPages())

        const createPages = () => {
            if (embeds.length==0) msg.channel.send("No results for that flair!")
            else {
                const Embeds = new PaginationEmbeds.Embeds()
                    .setArray(embeds)
                    .setChannel(msg.channel)
                    .setColor(0xFF00AE)
                    .setAuthorizedUsers([msg.author.id])
                    .setDisabledNavigationEmojis(['delete'])
                    .setDeleteOnTimeout(true)
                    .setPageIndicator(true)
                    .setTimeout(30000)
                    .setFooter(`Use ${botconfig.prefix}github to learn more.`)
                Embeds.build();
            }
        }
    }
    
    else if (command=='setprefix') {
        if (!msg.guild.ownerID===msg.author.id) {
            msg.channel.send("Sorry, only the server owner has access to that command!");
        } else {
            if (!args.search(/^[a-z0-9]+$/i)) {
                msg.channel.send("Sorry, prefixes can only be non-alphanumeric characters!")
            } else {
                botconfig.prefix = args;
                msg.channel.send(`Prefix changed to **${args}**`);
                bot.user.setActivity(`${botconfig.prefix}`,{ type: 'LISTENING' });

            }
        }
    }

    else if (command=='help') {
        msg.channel.send(new Discord.MessageEmbed()
                            .setTitle("Help")
                            .addFields(
                                {name:`\`${botconfig.prefix}mm [x] [flair]\``,value:"Search through the x most recent posts from r/mechmarket in a valid category (selling,buying,trading,group buy, interest check, meta)"},
                                {name:`\`${botconfig.prefix}setprefix [NEW PREFIX]\``,value:"Change the prefix used to call this bot (default:&)"},
                                {name:`\`${botconfig.prefix}github\``,value:"View the source code of this project"},
                                {name:`\`${botconfig.prefix}help\``,value:"View this message"}
                            )
                            .setFooter("All messages delete after 30 seconds.")
                            .setColor(0xFF00AE)
        )
                                .then(message=>message.delete({timeout:30000}))
    }
    else if (command=='github') {
        msg.reply("https://github.com/louismeunier/keeb-bot")
            .then(msg=>msg.delete({timeout:30000}))
    }
    
    else {
        await msg.channel.send(`Unknown command, use \`${botconfig.prefix}help\` to view all available commands.`)
    }
})


bot.login(process.env.BOTID)