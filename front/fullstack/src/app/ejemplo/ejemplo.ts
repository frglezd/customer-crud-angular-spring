import { Component } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  standalone: false,
  templateUrl: './ejemplo.html',
  styleUrl: './ejemplo.css',
})
export class Ejemplo {
  nombre: string = 'usuario';
}
