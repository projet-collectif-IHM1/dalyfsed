import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  showAlert: boolean = false; // Contrôle l'affichage de l'alerte
  alertMessage: string = ''; // Message de l'alerte
  alertType: 'success' | 'error' = 'success'; // Type d'alerte (succès ou erreur)

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Champ obligatoire
      email: ['', [Validators.required, Validators.email]], // Champ obligatoire avec validation d'email
      message: ['', Validators.required] // Champ obligatoire
    });
  }

  submitForm(): void {
    if (this.contactForm.valid) {
      // Si le formulaire est valide
      console.log('Formulaire soumis :', this.contactForm.value);

      // Simuler l'envoi du formulaire
      this.alertMessage = 'Message envoyé avec succès!';
      this.alertType = 'success';
      this.showAlert = true;

      // Réinitialiser le formulaire après soumission
      this.contactForm.reset();
    } else {
      // Si le formulaire est invalide
      this.alertMessage = 'Veuillez remplir tous les champs correctement.';
      this.alertType = 'error';
      this.showAlert = true;
    }

    // Masquer l'alerte après 5 secondes
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}