export class UserInformation{
    Currentuser!:string;
    // SessionID?:string; // Update due to not allow client aware about its session ID for security reason
    status?:String;
    status_of_confirmed_order?:String;
    personal_shopping_bag?:string;
    isAdminRights?:boolean;
  }