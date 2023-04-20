const Discord = require('discord.js');
const fs = require('fs');
const costTable = require('./properties.json');

const cmds = require('./commands/commands.js');
const ss = require('./commands/stringSelect.js');

const client = new Discord.Client({ intents: Discord.IntentsBitField.Flags.Guilds | Discord.IntentsBitField.Flags.GuildMessages });


const CLIENT_ID = "1089843821048774676"
const TOKEN = fs.readFileSync("./token.txt", "utf8");

client.login(TOKEN);

const commands = [
  new Discord.SlashCommandBuilder().setName("init").setDescription("Initialize guild eco workspace"),
  new Discord.SlashCommandBuilder().setName("reset").setDescription("Reset and close current workspace")
];

const rest = new Discord.REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Discord.Routes.applicationCommands(CLIENT_ID), { body: commands });

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

var msg;

var state = {
		update : function update() {
			// first update the production
			let effEmLevel = this.property.bonuses.emeraldAmp;
			let rateEmLevel = this.property.bonuses.emeraldRate;
			this.production.emerald = (this.production.emerald * costTable.efficientEmeralds.value[effEmLevel]) * costTable.emeraldsRate.value[rateEmLevel];

			// then cost of production upgrade
			// effEmerald costs ore while em rate costs crop
			this.usage.ore += costTable.efficientEmeralds.cost[effEmLevel];
			this.usage.crop += costTable.emeraldsRate.cost[rateEmLevel];

			// then resources production
			let effResLevel = this.property.bonuses.resourceAmp;
			let rateResLevel = this.property.bonuses.resourceRate;
			this.production.resource = (this.production.resource * costTable.efficientResources.value[effResLevel]) * costTable.resourcesRate.value[rateResLevel];

			// then cost of production upgrade
			// eff res and res rate both cost emerald
			this.usage.emerald += costTable.efficientResources.cost[effResLevel];
			this.usage.emerald += costTable.resourcesRate.cost[rateResLevel];

			// minion multi aura and volley
			let multiLevel = this.property.bonuses.multiAttack;
			let auraLevel = this.property.bonuses.aura;
			let volleyLevel = this.property.bonuses.volley;
			let minionDamageLevel = this.property.bonuses.minionDamage;

			// minion, multi, aura, volley costs wood, fish, crop, ore
			// TODO: add minion damage cost and everything else to cost table
			this.usage.wood += costTable.minionDamage.cost[minionDamageLevel];
			this.usage.fish += costTable.multiAttack.cost[multiLevel];
			this.usage.crop += costTable.aura.cost[auraLevel];
			this.usage.ore += costTable.volley.cost[volleyLevel];

			// now update upgrade cost and tower stats
			let damageLevel = this.property.upgrades.damage;
			let attackLevel = this.property.upgrades.attack;
			let healthLevel = this.property.upgrades.health;
			let defenceLevel = this.property.upgrades.defence;

			// damage, attack, health, defence costs ore, crop, wood, fish
			this.usage.ore += costTable.damage.cost[damageLevel];
			this.usage.crop += costTable.attack.cost[attackLevel];
			this.usage.wood += costTable.health.cost[healthLevel];
			this.usage.fish += costTable.defence.cost[defenceLevel];

			// now update tower stats
			

		},
		session : '',
		type : '',
		production : {
			emerald : 0,
			resource : 0
		},
		base : {
			emerald : 0,
			ore : 0,
		},
		usage : {
			emerald : 0,
			ore : 0,
			crop : 0,
			wood : 0,
			fish : 0
		},
		maxStorage : {
			emerald : 3000,
			ore : 300,
			crop : 300,
			wood : 300,
			fish : 300
		},
		usage : {
			emerald : 0,
			ore : 0,
			crop : 0,
			wood : 0,
			fish : 0
		},
		property : {
			upgrades : {
				damage : 0,
				attack : 0,
				health : 0,
				defence: 0
			},
			bonuses : {
				minionDamage : 0,
				multiAttack : 0,
				aura : 0,
				volley : 0,
				resourceStorage : 0,
				emeraldStorage : 0,
				resourceAmp : 0,
				emeraldAmp : 0,
				resourceRate : 0,
				emeraldRate : 0
			},
			tower : {
				damage : {
					min  : 1000,
					max : 1500
				},
				attack : 0.5,
				health : 300000,
				defence : 10
			},
			treasury : 0
	}
}

client.on(Discord.Events.InteractionCreate, async function (interaction) {
	console.log('called')
  if (interaction.isCommand()) {
    msg = await cmds(interaction, client, state);
  }
	else if (interaction.isStringSelectMenu()) {
		console.log(msg.id)
		msg = ss(interaction, client, state, msg)
	}
});

process.on('uncaughtException', function (err) {
	const errEmbed = new Discord.EmbedBuilder()
	.setTitle('uncaughtException')
	.setDescription(`\`\`\`js\n${err.stack}\n\`\`\``)
	.setColor('#ff0000')
	.setTimestamp();

	client.channels.cache.get('1023560049521598464').send({ embeds : [ errEmbed ] });
});