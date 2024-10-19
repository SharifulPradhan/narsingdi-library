const apiUrl = 'https://gutendex.com/books/';
const mainContent = document.getElementById('main-content');
const loader = document.getElementById('loader');
let books = [];  // Store fetched books globally
let genres = [];  // Store available genres globally
let searchQuery = '';  // Store the current search query
let selectedGenre = '';  // Store the selected genre

// Fetch books
async function fetchBooks(page = 1) {
  console.log('calling')
  try {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();
    books = data.results;
    displayBooks(books)
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

function displayBooks(books) {
  const bookList = books.map(book => `
      <div class="book">
          <img src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="${book.title} cover" />
          <h3>${book.title}</h3>
          <p>Author: ${book.authors.map(author => author.name).join(', ')}</p>
      </div>
  `).join('');
  document.getElementById('book-list').innerHTML = bookList;
}

function loadHomePage() {
  mainContent.innerHTML = `
      <div id="book-list"></div>
      <div id="pagination"></div>
  `;
  fetchBooks();
}

window.onload = loadHomePage;