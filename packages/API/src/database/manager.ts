import { ensureCommand, addCommand } from './databaseUtils';

export default async function postCommand(
  authorId: string,
  guildId: string,
  commandName: string,
  data: number,
  args: string
): Promise<void> {
  const hasCommand = await ensureCommand(commandName);

  if (hasCommand) addCommand(authorId, guildId, hasCommand, data, args);
}
