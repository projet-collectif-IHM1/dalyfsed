import { Component } from '@angular/core';
import { AuthoService } from '../Services/autho.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent {

    email: string = '';
    password: string = '';
    name: string = '';
  
    constructor(private Auth: AuthoService, private router: Router) { }
  
    sub(): void {
      console.log("Email:", this.email);
      console.log("Password:", this.password);
      console.log("name:", this.name);
  
      // Vérification des champs
      if (!this.email || !this.password || !this.name) {
        console.error("Veuillez entrer un email et un mot de passe.");
        return;
      }
  
      // Envoi de la requête d'authentification
      this.Auth.signUp(this.email, this.password , this.name)
        .subscribe({
          next: (res) => {
            console.log("register réussie", res);
            this.router.navigate(['/Login']);
          },
          error: (err) => {
            console.error("Erreur lors de la connexion :", err.message);
          }
        });
    }
    

}
