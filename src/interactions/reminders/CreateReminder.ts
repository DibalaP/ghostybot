import * as DJS from "discord.js";
import ms from "ms";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";
import { v4 } from "uuid";

export default class CreateReminderCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "reminders",
      name: "create",
      description: "Create a new reminder",
      options: [
        {
          name: "time",
          description: "When the reminder should expire (eg: 1d, 10h, 20min, ..)",
          type: "STRING",
          required: true,
        },
        {
          name: "message",
          description: "The message you want the bot to remind you of",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  async execute(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ) {
    const time = interaction.options.getString("time", true);
    const msg = interaction.options.getString("message", true);

    const isValid = ms(time);
    if (!isValid) {
      return interaction.reply({ ephemeral: true, content: lang.REMINDER.INVALID_DATE });
    }

    const user = await this.bot.utils.getUserById(interaction.user.id, interaction.guildId!);
    if (!user) return;
    const reminders = typeof user.reminder.reminders === "object" ? user.reminder.reminders : [];

    await this.bot.utils.updateUserById(interaction.user.id, interaction.guildId!, {
      reminder: {
        hasReminder: true,
        reminders: [
          ...reminders,
          {
            ends_at: Date.now() + ms(time),
            msg,
            channel_id: interaction.channelId!,
            time,
            id: v4().slice(0, 8),
            _id: v4(),
          },
        ],
      },
    });

    await interaction.reply({
      ephemeral: true,
      content: lang.REMINDER.SUCCESS.replace("{time}", time),
    });
  }
}
