import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'fechas',
  standalone: true
})
export class FechasPipe implements PipeTransform {

  transform(fecha: any): unknown {
    return fecha = moment(fecha).format('DD-MM-YYYY');
  }

}
