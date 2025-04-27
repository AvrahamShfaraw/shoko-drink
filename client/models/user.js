
export class UpdateUser {

  constructor(email, displayName,phoneNumber) {
    this.email = email;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    

  }
}


export class RegisterDto {

  constructor(email, displayName, phoneNumber, image) {
    this.email = email;
    this.displayName = displayName;
    this.phoneNumber = phoneNumber;
    this.image = image;
    this.role = 1; //init this property 1 = Customer only the admin can update to seller 0

  }
}



export class LoginDto {

  constructor(phoneNumber) {

    this.phoneNumber = phoneNumber;

  }
}