import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'tiempoHM',
  standalone: true
})
export class TiempoHMPipe implements PipeTransform {

  transform(value: number): string {
    if (!value && value !== 0) return '';
    const duracion = moment.duration(value, 'minutes');
    const horas = Math.floor(duracion.asHours());
    const minutos = duracion.minutes();
    return `${horas}h ${minutos}m`;
  }

}
