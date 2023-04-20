const Discord = require('discord.js');
const eco = require('../interactions/eco.js')

module.exports = async (interaction, client, state, msg) => {
  if (interaction.commandName == "init") {
    if (!state.initialised) {
      state.initialised = true;
      state.session = interaction.member.user.id;
    }
    else if (state.initialised) {
      if (state.session == interaction.member.user.id) {
        await interaction.reply("You have already initialised an eco session ? just do `/reset` to reset it.");
        return;
      }
      else if (state.session !== interaction.member.user.id) {
        await interaction.reply(`${client.users.cache.get(state.session).username} has already initialised an eco session.`);
        return;
      }
    }
    const options = [
      {
        label: `Normal`,
        value: `normal`,
        description: `Normal territory [ 3k6 / 9k ]`,
      },
      {
        label: `City`,
        value: `city`,
        description: `Double the emerald [ 3k6 / 18k ]`,
      },
      {
        label: `Resource`,
        value: `res`,
        description: `Double the resource [ 7k2 / 9k ]`,
      },
      {
        label: `Rainbow`,
        value: `all`,
        description: `Gay territory [ 900 (4) / 1k8 ]`,
      }
    ];

    var productions = `
┣**─ Emerald** : \`<nil>\`
┗**─ Resource** : \`<nil>\`
`;

    var usage = `
┣**─ Emerald** : \`<nil>\`
┣**─ Ore** : \`<nil>\`
┣**─ Crop** : \`<nil>\`
┣**─ Wood** : \`<nil>\`
┗**─ Fish** : \`<nil>\`
`;

    var upgradesString = `
┣**─ :pick: Damage** : \`<nil>\`
┣**─ :ear_of_rice: Attack** : \`<nil>\`
┣**─ :wood: Health** : \`<nil>\`
┗**─ :fish: Defence** : \`<nil>\`
`;

    var bonusString = `
┣**─ :wood: Stronger Minions** : \`<nil>\`
┣**─ :fish: Tower Multi-Attack** : \`<nil>\`
┣**─ :ear_of_rice: Tower Aura** : \`<nil>\`
┣**─ :pick: Tower Volley** : \`<nil>\`
┃
┣**─ :money_with_wings: Larger Resource Storage** : \`<nil>\`
┣**─ :wood: Larger Emerald Storage** : \`<nil>\`
┣**─ :money_with_wings: Efficient Resources** : \`<nil>\`
┣**─ :pick: Efficient Emeralds** : \`<nil>\`
┣**─ :money_with_wings: Resource Rate** : \`<nil>\`
┗**─ :ear_of_rice: Emerald Rate** : \`<nil>\`
`;

    var towerStats = `
┣**─ Damage** : \`<nil>\` - \`<nil>\`
┣**─ Attack** : \`<nil>\`x
┣**─ Health** : \`<nil>\` - \`<nil>\`
┗**─ Defence** : \`<nil>\`%
`;

    var otherProperties = `
┣**─ Treasury** : +\`<nil>\`
┗**─ Connection(s)** : \`<nil>\`
`;

    const embed = new Discord.EmbedBuilder()
      .setTitle("Eco Workspace")
      .setDescription("Select territory type to begin your drain journey.")
      .addFields(
        { name: "Usage /hr", value: usage, inline: true },
        { name: "Production /hr", value: productions, inline: true },
      )
      .addFields(
        { name: "Upgrades", value: upgradesString },
        { name: "Bonuses", value: bonusString, inline: true }
      )
      .addFields(
        { name: "Tower", value: towerStats },
        { name: "Other properties", value: otherProperties }
      )
      .setFooter({ text: "Liz has yet to buy me CRATES" })

    const actionRow = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId("type")
          .setPlaceholder("Select a territory type")
          .addOptions(options)
      )

    console.log(embed);
    msg = await interaction.reply({ embeds: [embed], components: [actionRow] })
    eco(interaction, client);
    return msg;
  }
  else if (interaction.commandName == "reset") {
    state = {
      initialised: false,
      session: null,
      territory: null,
      production: {
        emerald: 0,
        ore: 0,
        crop: 0,
        wood: 0,
        fish: 0
      },
      usage: {
        emerald: 0,
        ore: 0,
        crop: 0,
        wood: 0,
        fish: 0
      },
      maxStorage: {
        emerald: 3000,
        ore: 300,
        crop: 300,
        wood: 300,
        fish: 300
      }
    }
    await interaction.reply("resetted").then(function (m) {
    });
  }
}
