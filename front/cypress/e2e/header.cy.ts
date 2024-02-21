describe('Header', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should navigate to home page when "Quizz d\'aujourd\'hui" button is clicked', () => {
    cy.get('.header button').contains('Quizz d\'aujourd\'hui').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('should navigate to cards page when "Liste des cartes" button is clicked', () => {
    cy.get('.header button').contains('Liste des cartes').click();
    cy.url().should('eq', 'http://localhost:3000/cards');
  });
});
