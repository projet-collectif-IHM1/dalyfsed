import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isLogged: boolean = false;



  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    this.isLogged = !!localStorage.getItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
  
  logout() {
    localStorage.removeItem('user');
    // facultatif : forcer une navigation ou recharger le composant
    location.reload();
  }
  
  login() {
    this.router.navigate(['/Login']);
  }
}
