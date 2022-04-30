export const verificationEmailTemplate = (vCode: string) => {
  return `
    <html>
     <h1>Bosta Task email verification</h1>
    
     <h2>
     Please use the below verification code to verify your account
     </h2>

     <h4>
     ${vCode}
     </h4>
    </html>
    
    `;
};

export const urlStatusEmailTemplate = (url: string, status: string) => {
  return `
    <html>
     <h1>Bosta Task URL status monitoring</h1>
    
     <h2>
     This is bosta task URL status monitoring notification
     </h2>

     <h3>
      Your url  ${url} is  <b> ${status} </b>
     </h3>
    </html>
    
    `;
};
