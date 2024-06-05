require("dotenv").config({ path: "./config.env" });
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const cors = require("cors"); // Importieren Sie das cors-Paket
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Verwenden Sie cors für alle Routen
app.use(cors());

app.get("/members-with-role", async (req, res) => {
    try {
        const roleId = req.query.roleId; // Rollen-ID aus der Anfrage
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        await guild.members.fetch(); // Lade alle Mitglieder

        const membersWithRole = guild.members.cache
            .filter((member) => {
                return member.roles.cache.has(roleId);
            })
            .map((member) => {
                return {
                    id: member.id,
                    username: member.user.username,
                    roleId: roleId,
                };
            });

        res.json(membersWithRole);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

console.log(`DISCORD_TOKEN: `); // Überprüfen Sie den geladenen Token
client.login(process.env.DISCORD_TOKEN);

app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`);
});
