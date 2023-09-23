import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submittedSuccessful: boolean = true;
  showPopUp: boolean = false;
  categories: any;
  formSubmitted: boolean = false;
  loading: boolean = false;
  registerForm: FormGroup = new FormGroup({});


  groupSizes: { value: string, label: string }[] = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: 'custom', label: 'Custom' },

  ];

  acceptTermsChecked: boolean = false;

  onAcceptTermsChange() {
    this.acceptTermsChecked = !this.acceptTermsChecked;
    this.registerForm.get('acceptTerms')?.setValue(this.acceptTermsChecked);
    console.log(this.registerForm.value);
  }



  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValid = emailPattern.test(control.value);
      return isValid ? null : { customEmail: true };
    };
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      team_name: ['', Validators.required],
      pNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, this.customEmailValidator()]],
      pTopic: ['', Validators.required],
      category: ['', Validators.required],
      gSize: ['', Validators.required],
      customGSize: [''],
      acceptTerms: [false, Validators.requiredTrue]

    });

  };

  ngOnInit(): void {
    this.showRegistrationSuccessPopup();

    this.http.get("https://backend.getlinked.ai/hackathon/categories-list")
    this.http.get<any>('https://backend.getlinked.ai/hackathon/categories-list')
      .subscribe(response => {
        this.categories = response;

      });

  }


  showRegistrationSuccessPopup() {
    this.submittedSuccessful = true;

    console.log("pop up active")
    const registerSection = document.querySelector('.register-section');
    if (registerSection) {
      registerSection.classList.add('overflow-hidden');
    }
  }





  onSubmit() {
    this.formSubmitted = true;
    this.loading = true;
    console.log(this.registerForm.value);
    const userData = {
      email: this.registerForm.get('email')?.value,
      phone_number: this.registerForm.get('pNumber')?.value,
      team_name: this.registerForm.get('team_name')?.value,
      group_size: this.registerForm.get('gSize')?.value === 'custom'
        ? this.registerForm.get('customGSize')?.value
        : this.registerForm.get('gSize')?.value,
      project_topic: this.registerForm.get('pTopic')?.value,
      category: this.registerForm.get('category')?.value,
      privacy_policy_accepted: this.registerForm.get('acceptTerms')?.value
    };

    console.log(userData);


    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('https://backend.getlinked.ai/hackathon/registration', userData, { headers })
      .subscribe(
        (response) => {
          this.loading = false;
          this.submittedSuccessful = true;
          this.togglePopUp();
          console.log('Registration successful:', response);
          this.registerForm.reset();


        },
        (error) => {
          console.error('Registration failed:', error);
          this.loading = false;
        }
      );

  }

  togglePopUp() {
    this.showPopUp = true;
    if (this.showPopUp) {
      document.body.classList.add('unscrollable');
    } else {
      document.body.classList.remove('unscrollable');
    }
  }

  closePopUp() {
    this.showPopUp = false;
  }
}
