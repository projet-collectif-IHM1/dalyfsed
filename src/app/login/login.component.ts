import { Component } from '@angular/core';
import { AuthoService } from '../Services/autho.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private Auth: AuthoService, private router: Router) { }

  sub(): void {
    console.log("Email:", this.email);
    console.log("Password:", this.password);

    // Vérification des champs
    if (!this.email || !this.password) {
      console.error("Veuillez entrer un email et un mot de passe.");
      return;
    }

    // Envoi de la requête d'authentification
    this.Auth.signInWithEmailAndPassword(this.email, this.password)
    .subscribe({
      next: (res) => {
        console.log("Connexion réussie", res);
        localStorage.setItem("token", res.token); // Stocker le token
        localStorage.setItem("user", res); 
        if (res.role === "admin") {
          this.router.navigate(['/Hotel']);
        } else {
          this.router.navigate(['']);
        }
      },
      error: (err) => {
        console.error("Erreur lors de la connexion :", err.message);
      }
    });
  }}
