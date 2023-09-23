import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
  contactForm: FormGroup = new FormGroup({});
  submittedSuccessful: boolean = false;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
    private http: HttpClient) {
    this.contactForm = this.fb.group({
      first_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      message: ["", Validators.required],
    });
  }

  onSubmit() {
    console.log(this.contactForm.value);
    this.loading = true;
    const userData = {
      email: this.contactForm.value.email,
      first_name: this.contactForm.value.first_name,
      message: this.contactForm.value.message,
    }
    if (this.contactForm.invalid) {
      console.log("invalid");
      return;
    }
    else {



      console.log(userData);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.http.post("https://backend.getlinked.ai/hackathon/contact-form", userData, { headers })
        .subscribe(
          response => {

            console.log('Response:', response);
            this.submittedSuccessful = true;
            this.contactForm.reset();
            this.loading = false;
            setTimeout(() => {
              this.submittedSuccessful = false;
            }, 3000);

          },
          error => {

            console.error('Error:', error);
            this.loading = false;
          }
        );
    }


  }

}
