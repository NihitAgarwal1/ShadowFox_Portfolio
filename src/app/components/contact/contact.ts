import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = signal(false);
  success = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    this.error.set(null);
    if (this.contactForm.valid) {
      this.loading.set(true);
      const formData = this.contactForm.value;

      emailjs
        .send(
          'service_u44lc2n', // Service ID
          'template_pm54coa', // Template ID
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
          },
          'n3z65XxI_VrpO_Bn5' // Public Key
        )
        .then(
          (response) => {
            console.log('Email sent successfully:', response);
            this.success.set(true);
            this.contactForm.reset();
            this.submitted.set(false);
            this.loading.set(false);
            // Reset success message after 3 seconds
            setTimeout(() => this.success.set(false), 3000);
          },
          (error) => {
            console.error('Email send failed:', error);
            this.error.set('Failed to send message. Please try again.');
            this.loading.set(false);
          }
        );
    }
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
