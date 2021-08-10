import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import fetch from "node-fetch";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";

export default class ClydeCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "image",
      name: "clyde",
      description: "Let clyde say something",
      options: [
        {
          name: "text",
          required: true,
          description: "The text that needs to be displayed",
          type: "STRING",
        },
      ],
    });
  }

  async validate(): Promise<ValidateReturn> {
    return { ok: true };
  }

  async execute(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ) {
    await interaction.deferReply();

    const text = interaction.options.getString("text", true);

    const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=clyde&text=${encodeURIComponent(text)}`,
    ).then((res) => res.json());

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setTitle(lang.IMAGE.CLYDE)
      .setImage(data.message)
      .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.message})`);

    await interaction.editReply({ embeds: [embed] });
  }
}
