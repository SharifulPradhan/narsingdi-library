const apiUrl = 'https://gutendex.com/books/';
const mainContent = document.getElementById('main-content');
const loader = document.getElementById('loader');
let books = [];  // Store fetched books globally
let genres = [];  // Store available genres globally
let searchQuery = '';  // Store the current search query
let selectedGenre = '';  // Store the selected genre

// Fetch books
async function fetchBooks(page = 1) {
  try {
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();
    books = data.results;
    displayBooks(books);
    setupPagination(data.count, page);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

function displayBooks(books) {
  const bookList = books.map(book => `
      <div class="book">
          <div class="book-header">
          <p>ID: ${book.id} <p>
          <button class="wishlist-btn" data-id="${book.id}">
                ${wishlist.includes(book.id) ? '❤️' : '🤍'}
            </button>
          </div>
          <img src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="${book.title} cover" />
          <h3>${book.title}</h3>
          <p class="author"><b>Author</b>: ${book.authors.map(author => author.name).join(', ')}</p>
          <p class="genre"><b>Genre</b>: ${book.subjects.map(subject => subject).join(', ')}</p>
      </div>
  `).join('');
  document.getElementById('book-list').innerHTML = bookList;
}

// Pagination setup
function setupPagination(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / 32);
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.innerText = 'Previous';
      prevBtn.classList.add('page-btn');
      prevBtn.addEventListener('click', () => fetchBooks(currentPage - 1));
      paginationContainer.appendChild(prevBtn);
  }

  for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.innerText = i;
      pageBtn.classList.add('page-btn');
      if (i === currentPage) pageBtn.classList.add('active');
      pageBtn.addEventListener('click', () => fetchBooks(i));
      paginationContainer.appendChild(pageBtn);
  }

  if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.innerText = 'Next';
      nextBtn.classList.add('page-btn');
      nextBtn.addEventListener('click', () => fetchBooks(currentPage + 1));
      paginationContainer.appendChild(nextBtn);
  }
}

// Wishlist functionality
function updateWishlistIcons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const bookId = parseInt(btn.getAttribute('data-id'));
    btn.innerText = wishlist.includes(bookId) ? '❤️' : '🤍';  // Update icon based on wishlist state
  });
}

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(bookId) {
  const index = wishlist.indexOf(bookId);
  if (index === -1) {
    wishlist.push(bookId);
  } else {
    wishlist.splice(index, 1);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistIcons();
}

// Display wishlist books
function displayWishlistBooks() {
  const wishlistBooks = books.filter(book => wishlist.includes(book.id));
  const bookList = wishlistBooks.map(book => `
      <div class="book">
          <div class="book-header">
          <p>ID: ${book.id} <p>
          <button class="wishlist-btn" data-id="${book.id}">
                ${wishlist.includes(book.id) ? '❤️' : '🤍'}
            </button>
          </div>
          <img src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/150'}" alt="${book.title} cover" />
          <h3>${book.title}</h3>
          <p class="author"><b>Author</b>: ${book.authors.map(author => author.name).join(', ')}</p>
          <p class="genre"><b>Genre</b>: ${book.subjects.map(subject => subject).join(', ')}</p>
      </div>
  `).join('');
  document.getElementById('wishlist-books').innerHTML = bookList;
}


function loadHomePage() {
  mainContent.innerHTML = `
      <div id="book-list"></div>
      <div id="pagination"></div>
  `;
  fetchBooks();
}

function loadWishlistPage() {
  mainContent.innerHTML = '<h2 class="wishlist-heading">Wishlist</h2><div id="wishlist-books"></div>';
  displayWishlistBooks();  // Display wishlist books
}

// Handle navigation clicks for Home and Wishlist pages
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = e.target.getAttribute('data-page');
    if (page === 'home') {
      loadHomePage();
    } else if (page === 'wishlist') {
      loadWishlistPage();
    }
  });
});

// Event listener for wishlist button clicks
document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('wishlist-btn')) {
    const bookId = parseInt(e.target.getAttribute('data-id'));
    toggleWishlist(bookId);
  }
});

window.onload = loadHomePage;