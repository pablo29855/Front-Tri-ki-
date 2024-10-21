import { ServerService } from './../../services/server.service';
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { TableroComponent } from '../../components/tablero/tablero.component';
import { DetallePartidaComponent } from '../../components/detalle-partida/detalle-partida.component';
import { SalaService } from '../../services/sala.service';
import { ModalFullscreenComponent } from "../../components/modal-fullscreen/modal-fullscreen.component";
import { EstadoJuego } from '../../interfaces/sala';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-jugar',
  standalone: true,
  imports: [RouterModule, TableroComponent, DetallePartidaComponent, ModalFullscreenComponent],
  templateUrl: './jugar.component.html',
  styleUrl: './jugar.component.scss'
})
export class JugarComponent implements OnInit{

  serverServices = inject(ServerService);
  usuarioService = inject(UsuarioService);
  salaService = inject(SalaService);
  location = inject(Location);
  esPrivada = input();
  id = input<string>();
  estadosConModal:EstadoJuego[] = 
  [
    "ABANDONADO",
    'EMPATE',
    'ESPERANDO_COMPAÑERO',
    'VICTORIA_FINAL_P1',
    'VICTORIA_FINAL_P2',
    'VICTORIA_P1',
    'VICTORIA_P2'
  ]
  mostrarModal = computed(()=> this.estadosConModal.includes(this.salaService.estado()));
  estadoAnterior = signal<EstadoJuego>("ESPERANDO_COMPAÑERO");
  cambiarEstadoAnterior = effect(()=>{ 
    //SE EJECUTA UN CODIGO PARA QUE EL EFFECT SEPA QUE SEÑAL CAMBIO Y EJECUTE LA ANIMACION
    if(this.salaService.estado()){
      setTimeout(() => this.estadoAnterior.set(this.salaService.estado()),300),{allowSignalWrites:true}
    }
   }
  );
  linkCopiado = signal<boolean>(false);

  ngOnInit(): void {
    this.location.replaceState("Jugar");
   if(!this.esPrivada() && !this.id()){
      this.salaService.crearSala();
   }else if(this.id()){
      //console.log("Intentando unirse a la sala ",this.id());
      this.salaService.unirseAsala(parseInt(this.id()!));
   }else{
    this.salaService.crearSala(true);
   }

  }
  nuevaRonda(){
    this.salaService.nuevaRonda();
  }

  copiarLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(environment.CLIENT_URL+"/jugar/" + this.salaService.id())
        .then(() => {
          this.linkCopiado.set(true);
          setTimeout(() => this.linkCopiado.set(false), 2000);
        })
        .catch(err => console.error('Error al copiar el enlace: ', err));
    } else {
      console.error('La API del portapapeles no está disponible.');
    }
  }
  
}
