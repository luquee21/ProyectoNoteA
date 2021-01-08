import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  public timeSince(timeCreated):string {
    var milliSeconds = Date.parse(timeCreated);
    var periods = {
      month: 30 * 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000
    };
      var diff = Date.now() - milliSeconds;
      if (diff > periods.month) {
        // it was at least a month ago
        return "hace " + Math.floor(diff / periods.month) + " meses";
      } else if (diff > periods.week) {
        return "hace " + Math.floor(diff / periods.week) + " semanas";
      } else if (diff > periods.day) {
        return "hace " + Math.floor(diff / periods.day) + " días";
      } else if (diff > periods.hour) {
        return "hace " + Math.floor(diff / periods.hour) + " horas";
      } else if (diff > periods.minute) {
        return "hace " + Math.floor(diff / periods.minute) + " minutos";
      }
      return "Ahora mismo";
    }
}
