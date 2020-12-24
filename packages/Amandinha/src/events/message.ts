/* eslint-disable consistent-return */
import { Message, MessageEmbed } from 'discord.js';
import WatchClient from '../client';
import Event from '../structures/event';

export default class MessageReceive extends Event {
  constructor(client: WatchClient) {
    super(client, 'message');
  }

  async run(message: Message): Promise<Message> {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return;

    if (!message.content.startsWith(process.env.PREFIX)) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const comando =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command));
    if (!comando) return;

    if (comando.config.OnlyDevs) {
      if (process.env.OWNER_ID !== message.author.id)
        return message.channel.send('Este comando está disponível somente no servidor da Menhera!');
    }

    const userPermission = comando.config.UserPermission;
    const clientPermission = comando.config.ClientPermissions;
    if (userPermission !== null) {
      if (!message.member.hasPermission(userPermission)) {
        const perm = userPermission.map(value => `\`${value}\``).join(', ');
        return message.channel.send(
          `Você precisa das permissões: ${perm} pra executar isso, ${message.author}`
        );
      }
    }
    if (clientPermission !== null) {
      if (
        !message.guild.me.hasPermission(clientPermission) ||
        !message.channel.permissionsFor(this.client.user.id).has(clientPermission)
      ) {
        const perm = clientPermission.map(value => `\`${value}\``).join(', ');
        return message.channel.send(`O cliente precisa das permissões: ${perm} pra executar isso`);
      }
    }

    try {
      new Promise(res => {
        message.channel.startTyping();
        res(comando.run(message, args));
      })
        .then(() => message.channel.stopTyping())
        .catch(err => {
          message.channel.stopTyping();
          const errorMessage =
            err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack;
          const embed = new MessageEmbed();
          embed.setColor('#ff0015');
          embed.setTitle(`Erro!`);
          embed.setDescription(`\`\`\`js\n${errorMessage}\`\`\``);

          message.channel.send(embed);
        });
    } catch (err) {
      message.channel.stopTyping();
      const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack;
      const embed = new MessageEmbed();
      embed.setColor('#ff0015');
      embed.setTitle(`Erro!`);
      embed.setDescription(`\`\`\`js\n${errorMessage}\`\`\``);

      message.channel.send(embed);
    }
  }
}