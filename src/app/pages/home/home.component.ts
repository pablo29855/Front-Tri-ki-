import { UsuarioService } from './../../services/usuario.service';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ServerService } from '../../services/server.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  usuarioService = inject(UsuarioService);
  serveService = inject(ServerService);
  router = inject(Router);
  
  /** PREGUNTA AL SERVIDOR SI HAY UNA SALA PUBLICA DISPONIBLE */
  buscarSalaPublica(){
    this.serveService.server.emitWithAck("encontrarSala").then(res => {
      //console.log(res)
      if(res === null) return this.router.navigate(["/jugar"]);
      return this.router.navigate(["/jugar",res]);
    })
  }


}
