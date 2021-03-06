import { Activity, ActivityType } from './constants';

export default class Activities {
  private static instance?: Activities;

  private static getDefaultActivities(): Array<Activity> {
    return [
      { name: '🚨 | Meu servidor de suporte m!suporte', type: 'LISTENING' },
      { name: '🎇 | Já votou em mim hoje? m!votar', type: 'PLAYING' },
      { name: '🎮 | Caçe demônios com XANDÃO. m!caçar', type: 'PLAYING' },
      {
        name: '🔮 | Tem ideia de um comando interessante? Use m!sugerir',
        type: 'PLAYING',
      },
      {
        name: '💌 | Dificuldade com um comando? Use m!help comando',
        type: 'PLAYING',
      },
      { name: '🐛 | Encontrou um bug? Reporte com m!bug', type: 'PLAYING' },
      {
        name: '❓ | Duvidas? Entre em meu servidor de suporte m!suporte',
        type: 'PLAYING',
      },
      {
        name: '🔔 | Fique por dentro das minhas novidades em meu servidor de suporte',
        type: 'PLAYING',
      },
      { name: '🎲 | Sabia que eu tenho um rpg? m!help', type: 'PLAYING' },
      {
        name:
          '🎲 | Registre-se um aventureiro com m!register, e vá para aventuras na dungeon com m!dungeon',
        type: 'PLAYING',
      },
    ];
  }

  private activities: Array<Activity>;

  private constructor() {
    this.activities = Activities.getDefaultActivities();
  }

  public getAllActivities(): Array<Activity> {
    return this.activities;
  }

  public getRandomActivity(shardId: number): Activity {
    const randomActivity = this.activities[Math.floor(Math.random() * this.activities.length)];
    return { name: `${randomActivity.name} | Shard ${shardId}`, type: randomActivity.type };
  }

  public addActivity(name: string, type: ActivityType): void {
    this.activities.push({ name, type });
  }

  public clearActivities(): void {
    this.activities = [];
  }

  public resetActivities(): Activity[] {
    this.activities = Activities.getDefaultActivities();
    return this.activities;
  }

  static getInstance(): Activities {
    if (!this.instance) {
      this.instance = new Activities();
    }

    return this.instance;
  }
}
