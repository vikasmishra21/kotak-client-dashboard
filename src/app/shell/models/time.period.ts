export class TimePeriod {
  static Variable: string;
  static CurrentPeriod: number;
  static PreviousPeriod: number;

  static getTimeComparisonChoices(): number[] {
    const choices = [];
    if (TimePeriod.PreviousPeriod > 0) {
      choices.push(TimePeriod.PreviousPeriod);
    }
    choices.push(TimePeriod.CurrentPeriod);
    return choices;
  }
}
