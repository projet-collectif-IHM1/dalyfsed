import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PayeService } from '../Services/paye.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paye-form',
  templateUrl: './paye-form.component.html',
  styleUrls: ['./paye-form.component.css']
})
export class PayeFormComponent implements OnInit {
  payeForm: FormGroup; // Changed from 'form' to 'payeForm' for consistency
  isEditMode = false;
  currentId: string | null = null;

  constructor(
    private payeService: PayeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize form with proper controls
    this.payeForm = new FormGroup({
      nompaye: new FormControl('', Validators.required),
      imagepaye: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.currentId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.currentId;

    if (this.isEditMode) {
      this.loadPayeForEdit();
    }
  }

  private loadPayeForEdit(): void {
    this.payeService.getPayeById(this.currentId!).subscribe({
      next: (response) => {
        // Handle both direct object and nested 'paye' property responses
        const payeData = response.paye || response;
        if (payeData) {
          this.payeForm.patchValue({
            nompaye: payeData.nompaye,
            imagepaye: payeData.imagepaye
          });
        } else {
          console.error('Invalid paye data:', response);
          this.router.navigate(['Paye']);
        }
      },
      error: (err) => {
        console.error('Error loading paye:', err);
        this.router.navigate(['Paye']);
      }
    });
  }

  onSubmit(): void {
    if (this.payeForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = this.payeForm.value;

    if (this.isEditMode) {
      this.updatePaye(formData);
    } else {
      this.createPaye(formData);
    }
  }

  private updatePaye(formData: any): void {
    this.payeService.updatePaye(this.currentId!, formData).subscribe({
      next: () => {
        this.router.navigate(['Paye']); // Redirect to paye list after update
      },
      error: (err) => {
        console.error('Error updating paye:', err);
      }
    });
  }

  private createPaye(formData: any): void {
    this.payeService.addPaye(formData).subscribe({
      next: () => {
        this.router.navigate(['Paye']); // Redirect to paye list after creation
      },
      error: (err) => {
        console.error('Error creating paye:', err);
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.payeForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['Paye']);
  }
}