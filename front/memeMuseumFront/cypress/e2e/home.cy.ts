describe('MemeMuseum - Home Page & Feed', () => {

  const mockPosts = {
    status: 'success',
    data: [
      {
        id: 1,
        title: 'Meme sui programmatori',
        username: 'coder_99',
        image_path: '/uploads/meme1.jpg',
        tags: '["Programming", "Funny"]',
        vote_sum: 42
      },
      {
        id: 2,
        title: 'Video Epico',
        username: 'video_maker',
        image_path: '/uploads/video1.mp4',
        tags: '["Epic"]',
        vote_sum: 10
      }
    ]
  };

  const emptyResponse = {
    status: 'success',
    data: []
  };

  beforeEach(() => {
    cy.intercept('GET', '**/posts*', mockPosts).as('getPosts');
  });


  it('Dovrebbe caricare il layout principale e chiamare l\'API dei post', () => {
    cy.visit('http://localhost:4200/');
    cy.wait('@getPosts');

    cy.get('.main-layout').should('be.visible');
    cy.get('.feed-container').should('be.visible');
  });

  it('Dovrebbe mostrare il messaggio "No memes found" se il database è vuoto', () => {
    cy.intercept('GET', '**/posts*', emptyResponse).as('getEmptyPosts');
    cy.visit('http://localhost:4200/');
    
    cy.wait('@getEmptyPosts');

    cy.get('.empty-message').should('be.visible').and('contain', 'No memes found');
    
    cy.get('app-post-card').should('not.exist');
  });


  it('Dovrebbe renderizzare correttamente le post cards con i dati ricevuti', () => {
    cy.visit('http://localhost:4200/');
    cy.wait('@getPosts');

    cy.get('app-post-card').should('have.length', 2);

    cy.get('app-post-card').eq(0).within(() => {
      cy.get('.title').should('contain', 'Meme sui programmatori');
      cy.get('.author').should('contain', '@coder_99');
      cy.get('.tag-chip').should('contain', '#Programming');
      cy.get('img.media-content').should('be.visible');
      cy.get('video.media-content').should('not.exist');
    });

    cy.get('app-post-card').eq(1).within(() => {
      cy.get('.title').should('contain', 'Video Epico');
      cy.get('video.media-content').should('exist');
      cy.get('img.media-content').should('not.exist');
    });
  });


  it('Dovrebbe aprire il dettaglio del post quando si clicca sulla card', () => {
    cy.visit('http://localhost:4200/');
    cy.wait('@getPosts');

    cy.get('.card').eq(0).click();

    cy.url().should('include', '/post/1');
  });

  it('Dovrebbe far comparire l\'overlay "Open Post" passando col mouse sulla media', () => {
    cy.visit('http://localhost:4200/');
    cy.wait('@getPosts');

    cy.get('.card-media').first().trigger('mouseover');
    cy.get('.card-media').first().find('.overlay span').should('contain', 'Open Post');
  });

  it('Dovrebbe innescare una nuova chiamata API quando si scrolla fino all\'ancora', () => {
    const tenPosts = Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      title: `Meme ${i}`,
      username: 'user',
      image_path: '/uploads/fake_image.jpg',
      tags: '[]'
    }));
    
    cy.intercept('GET', '**/posts?page=1*', { status: 'success', data: tenPosts }).as('getPage1');
    cy.intercept('GET', '**/posts?page=2*', { status: 'success', data: [{ id: 11, title: 'Pagina 2 Meme', tags: '[]' }] }).as('getPage2');

    cy.visit('http://localhost:4200/');
    cy.wait('@getPage1');

    cy.wait(500);

    cy.scrollTo('bottom');

    cy.wait('@getPage2');
  });

});