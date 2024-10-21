import { PosicionTablero, posicionGanadora, SalaBackend, Tablero } from './../interfaces/sala';
import { inject, Injectable, signal } from '@angular/core';
import { EstadoJuego } from '../interfaces/sala';
import { Jugador } from '../interfaces/jugador';
import { ServerService } from './server.service';
import { CrearSalaArgs } from '../interfaces/crearSala';
import { UsuarioService } from './usuario.service';
import { UnirseASalaArgs } from '../interfaces/unirseASala';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  serverService = inject(ServerService);
  usuarioService = inject(UsuarioService);
  router = inject(Router);

  constructor() { 
    this.serverService.actualizacionDeSala$.subscribe((sala)=>{
      this.desestructurarSala(sala);
    });
  }

  jugador1 =  signal<Jugador>({
    nombre:"",
    vidas:0

  });
  jugador2 =  signal<Jugador>({
    nombre:"",
    vidas:0

  });
  estado = signal<EstadoJuego>("ESPERANDO_COMPAÑERO");
  numeroDeJugador = signal<1|2|undefined>(undefined);
  id = signal<number|undefined>(undefined);
  tablero = signal<Tablero>(["","","","","","","","",""]);
  publica = signal<boolean|undefined>(undefined);
  posicionGanadora = signal<posicionGanadora | undefined>(undefined);

  desestructurarSala(salaBack:SalaBackend){
    //console.log("Desestructurando ",salaBack);

    if(!salaBack){
      this.router.navigate(["/"]);
    }

    this.id.set(salaBack.id);
    this.estado.set(salaBack.estado);
    this.jugador1.set(salaBack.jugadores[0]);
    this.jugador2.set(salaBack.jugadores[1]);
    this.tablero.set(salaBack.tablero);
    this.publica.set(salaBack.publica);
    this.posicionGanadora.set(salaBack.posicionGanadora);
    

  }

  /** CREA UNA SALA DE JUEGOS, PÚBLICA O PRIVADA */
  crearSala(esPrivada:boolean = false){
    const args:CrearSalaArgs = {
      publica: !esPrivada,
      nombreJugador: this.usuarioService.nombre()
    }

    this.serverService.server.emitWithAck("crearSala",args).then(res =>{
      //console.log("crear sala", res);
      this.desestructurarSala(res.sala);
      this.numeroDeJugador.set(1);
    })
  }

   
  /** UNE AL CLIENTE A UNA SALA DE JUEGOS */
  unirseAsala(id:number){
    const args:UnirseASalaArgs = {
      id,
      nombreJugador: this.usuarioService.nombre()
    }

    this.serverService.server.emitWithAck("unirseASala",args).then(res =>{
      //console.log("Resultado de unión a sala", res);
      this.desestructurarSala(res.sala);
      this.numeroDeJugador.set(2);
    })
  }
  
  /**ENVIA AL SERVER LA PETICION DE UN JUGADOR DE HACER UNA JUGADA */
  jugar(posicion:PosicionTablero){
    //console.log("Emitiendo Jugada");
    this.serverService.server.emit("jugar",{
      salaId : this.id(),
      jugador: this.numeroDeJugador(),
      posicion
    })
  }

  /**ENVIA AL SERVER LA PETICION DE UN JUGADOR PARA SEGUIR CON LA RONDA */
  nuevaRonda(){
    this.serverService.server.emit("nuevaRonda",{salaId:this.id()});
  }

}