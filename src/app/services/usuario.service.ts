import { effect, Injectable, signal } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { 
    const nombreLocalStorage = localStorage.getItem("nombre");
    if(nombreLocalStorage) this.nombre.set(nombreLocalStorage);
  }

  nombre = signal<string>("");

  guardarNombreEnLocalStorage = effect(()=> localStorage.setItem("nombre",this.nombre()));
}
