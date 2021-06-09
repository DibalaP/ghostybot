import { Message } from "discord.js";
import fetch from "node-fetch";
import Command from "structures/Command";
import Bot from "structures/Bot";

export default class CatCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "racoon",
      description: "Shows an image of a raccoon",
      category: "animal",
    });
  }

  async execute(message: Message) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);
    try {
      const data = await fetch("https://some-random-api.ml/img/racoon").then((res) => res.json());

      const embed = this.bot.utils
        .baseEmbed(message)
        .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.link})`)
        .setImage(data.link);

      message.channel.send({ embed });
    } catch (err) {
      this.bot.utils.sendErrorLog(err, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }
}
