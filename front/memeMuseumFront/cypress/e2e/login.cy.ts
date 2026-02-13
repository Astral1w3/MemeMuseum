describe('MemeMuseum - Login Flow', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  
  it('Dovrebbe avere il bottone disabilitato all\'avvio', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Dovrebbe mostrare errore se l\'email non è valida', () => {
    cy.get('#login-email').type('utente-sbagliato');
    
    cy.get('body').click(0,0);
    
    cy.contains('Enter a valid email').should('be.visible');
    
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Dovrebbe abilitare il bottone se i dati sono formalmente corretti', () => {
    cy.get('#login-email').type('test@example.com');
    cy.get('#login-password').type('Password123!');
    
    cy.get('button[type="submit"]').should('not.be.disabled');
  });


  it('Dovrebbe navigare alla home se il login ha successo', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { message: 'Login success', token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.get('#login-email').type('test@example.com');
    cy.get('#login-password').type('Password123!');
    
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('Dovrebbe mostrare un messaggio di errore se le credenziali sono errate', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    }).as('failedLogin');

    cy.get('#login-email').type('sbagliata@example.com');
    cy.get('#login-password').type('PasswordErrata');
    cy.get('button[type="submit"]').click();

    cy.wait('@failedLogin');

    cy.contains('Email or password are wrong.').should('be.visible');
    
    cy.url().should('include', '/login');
  });


  it('Dovrebbe navigare alla pagina di registrazione cliccando Sign Up', () => {
    cy.contains('Sign Up').click();
    cy.url().should('include', '/register');
  });

});