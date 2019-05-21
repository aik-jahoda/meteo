declare module "suncalc2" {
  export const getTimes: (date: Date, lon: number, lan: number) => SunTimes;
  export const getMoonIllumination: (timeAndDate: Date) => MoonIllumination;

  interface SunTimes {
    sunrise: Date;
    sunriseEnd: Date;
    goldenHourEnd: Date;
    solarNoon: Date;
    goldenHour: Date;
    sunsetStart: Date;
    sunset: Date;
    dusk: Date;
    nauticalDusk: Date;
    night: Date;
    nadir: Date;
    nightEnd: Date;
    nauticalDawn: Date;
    daw: Date;
  }

  interface MoonIllumination {
    /**
     * illuminated fraction of the moon; varies from 0.0 (new moon) to 1.0 (full moon)
     */
    fraction: number;
    /** moon phase; varies from 0.0 to 1.0, described below */
    phase: number;
    /**
     * midpoint angle in radians of the illuminated limb of the moon reckoned eastward
     * from the north point of the disk; the moon is waxing if the angle is negative, and waning
     * if positive
     * */
    angle: number;
  }
}
