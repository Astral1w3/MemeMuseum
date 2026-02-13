describe('MemeMuseum - Post Detail Page', () => {

  
  const mockImagePost = {
    status: 'success',
    data: {
      id: 1,
      title: 'Quando il codice compila al primo colpo',
      username: 'dev_hero',
      image_path: '/uploads/success.jpg',
      tags: '["Programmazione", "Miracoli"]',
      created_at: '2026-02-13T10:30:00Z',
      vote_sum: 150,
      user_vote: 1
    }
  };

  const mockVideoPost = {
    status: 'success',
    data: {
      id: 2,
      title: 'Gatto che suona la tastiera',
      username: 'cat_lover',
      image_path: '/uploads/keyboard_cat.mp4',
      tags: '["Gatti", "Musica"]',
      created_at: '2026-02-12T15:00:00Z',
      vote_sum: 300,
      user_vote: 0
    }
  };


  it('Dovrebbe mostrare il loading spinner e poi renderizzare un post IMMAGINE', () => {
    cy.intercept('GET', '**/posts/1', {
      delay: 1000,
      body: mockImagePost
    }).as('getImagePost');

    cy.visit('http://localhost:4200/post/1');

    cy.get('.loading-spinner').should('be.visible');

    cy.wait('@getImagePost');

    cy.get('.post-title').should('contain', 'Quando il codice compila al primo colpo');
    cy.get('.author').should('contain', 'u/dev_hero');
    cy.get('.date').should('contain', '2026');

    cy.get('.tag-pill').should('have.length', 2);
    cy.get('.tag-pill').first().should('contain', '#Programmazione');

    cy.get('img.media-full').should('be.visible')
      .and('have.attr', 'src', 'http://localhost:3000/uploads/success.jpg');
    cy.get('video.media-full').should('not.exist');

    cy.get('app-vote').should('exist');
    cy.get('app-comments').should('exist');
  });


  it('Dovrebbe renderizzare il tag <video> se il post è un .mp4', () => {
    cy.intercept('GET', '**/posts/2', mockVideoPost).as('getVideoPost');
    
    cy.visit('http://localhost:4200/post/2');
    cy.wait('@getVideoPost');

    cy.get('.post-title').should('contain', 'Gatto che suona la tastiera');

    cy.get('video.media-full').should('be.visible')
      .and('have.attr', 'src', 'http://localhost:3000/uploads/keyboard_cat.mp4');
    cy.get('img.media-full').should('not.exist');
  });

  
  it('Dovrebbe copiare il link negli appunti quando si clicca Share', () => {
    cy.intercept('GET', '**/posts/1', mockImagePost).as('getPost');
    
    cy.visit('http://localhost:4200/post/1');
    cy.wait('@getPost');

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').callsFake(() => Promise.resolve()).as('clipboardCopy');
      cy.stub(win, 'alert').as('browserAlert');
    });

    cy.get('.share').click();

    cy.get('@clipboardCopy').should('have.been.calledWith', 'http://localhost:4200/post/1');

    cy.get('@browserAlert').should('have.been.calledWith', 'Copied!');
  });

});