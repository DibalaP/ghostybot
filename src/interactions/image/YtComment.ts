import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";

export default class YtCommentCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "image",
      name: "yt-comment",
      description: "Returns an image with your YouTube comment",
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

    const username = interaction.user.username;
    const avatar = interaction.user.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    const url = `https://some-random-api.ml/canvas/youtube-comment?username=${encodeURIComponent(
      username,
    )}&comment=${encodeURIComponent(text)}&avatar=${encodeURIComponent(avatar)}`;

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${url})`)
      .setImage(url);

    await interaction.editReply({ embeds: [embed] });
  }
}
