const Discord = require('discord.js');
const eco = require('../interactions/eco.js')
const u = require('../properties.json');

module.exports = async (interaction, client, state, msg) => {

  if (interaction.customId == "type") {
    let type = interaction.customId;
    console.log(msg.id)
    console.log('called with data ' + interaction.values[0])
    state.type = interaction.values[0].replace(' ', '');
    if (type === 'normal') {
      state.production.emerald = 9000;
      state.production.resource = 3600
    }
    else if (type === 'city') {
      state.production.emerald = 18000;
      state.production.resource = 3600;
    }
    else if (type === 'res') {
      state.production.emerald = 9000;
      state.production.resource = 7200;
    }
    else {
      state.production.emerald = 1800;
      state.production.resource = 900;
    }

    // set max storage
    state.maxStorage.emerald = state.property.bonuses.emeraldStorage * u.largerEmeraldsStorage.value[state.property.bonuses.emeraldStorage]
    // and the cost for the storage
    state.usage[u.largerEmeraldsStorage.resourceType] = u.largerEmeraldsStorage.cost[state.property.bonuses.emeraldStorage]

    var productions = `
    ┣**─ Emerald** : ${state.production.emerald}
    ┗**─ Resource** : ${state.production.resource}
    `;
    
    var usage = `
    ┣**─ Emerald** : ${state.usage.emerald}
    ┣**─ Ore** : ${state.usage.ore}
    ┣**─ Crop** : ${state.usage.crop}
    ┣**─ Wood** : ${state.usage.wood}
    ┗**─ Fish** : ${state.usage.fish}
    `;
    
    var upgradesString = `
    ┣**─ :pick: Damage** : ${state.property.upgrades.damage}
    ┣**─ :ear_of_rice: Attack** : ${state.property.upgrades.attack}
    ┣**─ :wood: Health** :  ${state.property.upgrades.health}
    ┗**─ :fish: Defence** : ${state.property.upgrades.defence}
    `;
    
    var bonusString = `
    ┣**─ :wood: Stronger Minions** : ${state.property.bonuses.minionDamage}
    ┣**─ :fish: Tower Multi-Attack** : ${state.property.bonuses.multiAttack}
    ┣**─ :ear_of_rice: Tower Aura** : ${state.property.bonuses.aura}
    ┣**─ :pick: Tower Volley** : ${state.property.bonuses.volley}
    ┃
    ┣**─ :money_with_wings: Larger Resource Storage** : ${state.property.bonuses.resourceStorage}
    ┣**─ :wood: Larger Emerald Storage** : ${state.property.bonuses.emeraldStorage}
    ┣**─ :money_with_wings: Efficient Resources** : ${state.property.bonuses.resourceAmp}
    ┣**─ :pick: Efficient Emeralds** : ${state.property.bonuses.emeraldAmp}
    ┣**─ :money_with_wings: Resource Rate** : ${state.property.bonuses.resourceRate}
    ┗**─ :ear_of_rice: Emerald Rate** : ${state.property.bonuses.emeraldRate}
    `;
    
    var towerStats = `
    ┣**─ Damage** : ${state.property.tower.damage.min} - ${state.property.tower.damage.max}
    ┣**─ Attack** : ${state.property.tower.attack}x
    ┣**─ Health** : ${state.property.tower.health.min} - ${state.property.tower.health.max}
    ┗**─ Defence** : ${state.property.tower.defence}%
    `;
    
    var otherProperties = `
    ┣**─ Treasury** : +
    ┗**─ Connection(s)** :
    `;

    console.log(interaction.values[0])
    const embed = new Discord.EmbedBuilder()
    .setTitle("Eco Workspace")
    .addFields(
      { name: "Usage /hr", value: usage, inline: true },
      { name: "Production /hr", value: productions, inline: true },
    )
    .addFields(
      { name : "Upgrades", value : upgradesString },
      { name : "Bonuses", value : bonusString, inline : true }
    )
    .addFields(
      { name : "Tower", value : towerStats },
      { name : "Other properties", value : otherProperties }
    )

    msg.edit({ embeds : [ embed ], components : [  ] });
    await interaction.reply({ content: "Type set to " + interaction.values[0], ephemeral: true });
    }
}