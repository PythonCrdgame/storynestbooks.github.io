// Enhanced KiddoBooks - More books, better UX

let books = [
    {
        id: 1,
        title: "The Brave Little Mouse",
        cover: "https://picsum.photos/id/1015/400/520",
        category: "animals",
        pages: [
            "Once upon a time in a cozy little house, there lived a tiny mouse named Milo.",
            "Milo was afraid of almost everything — loud noises, big cats, and even his own shadow!",
            "One sunny morning, Milo smelled something amazing... cheese! But it was on the highest shelf.",
            "With a deep breath, he started climbing. Step by step, paw by paw.",
            "He finally reached the top! 'I did it!' he squeaked proudly.",
            "From that day on, Milo became the bravest mouse in the whole neighborhood."
        ],
        age: "3-6",
        duration: "6 min"
    },
    {
        id: 2,
        title: "Luna and the Magic Forest",
        cover: "https://picsum.photos/id/201/400/520",
        category: "magic",
        pages: [
            "Luna loved looking at the stars every night.",
            "One evening, glowing fireflies led her into an enchanted forest full of wonders.",
            "The trees whispered stories, and colorful flowers danced in the moonlight.",
            "She met a wise old owl who taught her that true magic comes from kindness.",
            "Luna helped a lost baby deer find its family.",
            "When she returned home, she knew magic lived in every kind heart."
        ],
        age: "5-8",
        duration: "8 min"
    },
    {
        id: 3,
        title: "Ellie the Flying Elephant",
        cover: "https://picsum.photos/id/251/400/520",
        category: "adventure",
        pages: [
            "Ellie dreamed of flying like the birds she saw every day.",
            "She collected colorful balloons from the village fair.",
            "With a big jump from the tallest hill, Ellie soared into the sky!",
            "She waved at her friends below and saw the whole savanna from above.",
            "She even helped deliver messages across the river.",
            "Ellie learned that with imagination and courage, anything is possible."
        ],
        age: "4-7",
        duration: "7 min"
    },
    {
        id: 4,
        title: "The Rainbow Friends",
        cover: "https://picsum.photos/id/133/400/520",
        category: "learning",
        pages: [
            "In a magical paintbox lived Red, Blue, and Yellow.",
            "They were best friends but sometimes argued about who was the best color.",
            "One day they mixed together and created beautiful new colors!",
            "Purple, Green, and Orange joined the fun.",
            "They painted the most amazing rainbow the world had ever seen.",
            "They learned that working together makes everything more beautiful."
        ],
        age: "3-6",
        duration: "5 min"
    },
    {
        id: 5,
        title: "The Little Seed's Journey",
        cover: "https://picsum.photos/id/180/400/520",
        category: "learning",
        pages: [
            "A tiny seed dreamed of touching the sky.",
            "It waited patiently in the warm, dark soil.",
            "Rain came and gave it water. The sun gave it light.",
            "Slowly, a green sprout appeared, then strong branches.",
            "Birds made their home in its leaves.",
            "The little seed became a mighty tree that gave shade and joy to everyone."
        ],
        age: "4-7",
        duration: "6 min"
    }
];

let currentUser = null;
let currentBook = null;
let currentPageIndex = 0;
let favorites = [];
let readingProgress = {};

// Render books with enhanced cards
function renderBooks(containerId, bookList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    bookList.forEach(book => {
        const isFav = favorites.includes(book.id);
        const progress = readingProgress[book.id] || 0;
        
        const cardHTML = `
            <div class="book-card bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer group" onclick="openBook(${book.id})">
                <div class="relative">
                    <img src="${book.cover}" alt="${book.title}" class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700">
                    ${progress > 0 ? `
                    <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-pink-500" style="width: ${progress}%"></div>
                    </div>` : ''}
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-bold text-xl text-purple-700 leading-tight">${book.title}</h3>
                        <span onclick="event.stopImmediatePropagation(); toggleFavorite(${book.id});" 
                              class="text-3xl transition-all ${isFav ? 'text-pink-500 scale-110' : 'text-gray-300 hover:text-pink-400'}">❤️</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-pink-500">${book.age} yrs</span>
                        <span class="text-purple-400">${book.duration}</span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function openBook(bookId) {
    currentBook = books.find(b => b.id === bookId);
    if (!currentBook) return;
    
    currentPageIndex = 0;
    const readerModal = document.getElementById('reader-modal');
    if (readerModal) readerModal.classList.remove('hidden');
    const readerTitle = document.getElementById('reader-title');
    if (readerTitle) readerTitle.textContent = currentBook.title;
    updateReaderPage();
    
    const favBtn = document.getElementById('reader-fav-btn');
    if (favBtn) favBtn.textContent = favorites.includes(currentBook.id) ? '❤️' : '♡';
    
    // Mark as started
    if (!readingProgress[currentBook.id]) {
        readingProgress[currentBook.id] = 10;
        saveData();
    }
}

function updateReaderPage() {
    if (!currentBook) return;
    const contentEl = document.getElementById('reader-content');
    if (contentEl) contentEl.innerHTML = `<p class="mb-8">${currentBook.pages[currentPageIndex]}</p>`;
    
    const progress = Math.round(((currentPageIndex + 1) / currentBook.pages.length) * 100);
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) pageInfo.innerHTML = `
        Page <span class="font-bold">${currentPageIndex + 1}</span> of ${currentBook.pages.length}
        <span class="text-emerald-500 ml-3">• ${progress}% read</span>
    `;
    
    // Update global progress
    readingProgress[currentBook.id] = progress;
    saveData();
}

function nextPage() {
    if (!currentBook) return;
    if (currentPageIndex < currentBook.pages.length - 1) {
        currentPageIndex++;
        updateReaderPage();
    } else {
        showToast("🎉 You've finished the story! Great job!");
    }
}

function prevPage() {
    if (!currentBook) return;
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updateReaderPage();
    }
}

function closeReader() {
    const readerModal = document.getElementById('reader-modal');
    if (readerModal) readerModal.classList.add('hidden');
    if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function speakCurrentPage() {
    if (!('speechSynthesis' in window)) {
        showToast("Voice reading not supported in this browser.");
        return;
    }
    
    const text = currentBook.pages[currentPageIndex];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.1;
    utterance.rate = 0.92;
    utterance.volume = 0.95;
    speechSynthesis.speak(utterance);
}

function toggleFavorite(bookId) {
    if (typeof event !== 'undefined' && event.stopImmediatePropagation) event.stopImmediatePropagation();
    if (favorites.includes(bookId)) {
        favorites = favorites.filter(id => id !== bookId);
    } else {
        favorites.push(bookId);
        showToast("💖 Added to favorites!");
    }
    saveData();
    refreshCurrentView();
}

function toggleFavoriteInReader() {
    if (!currentBook) return;
    toggleFavorite(currentBook.id);
    const favBtn = document.getElementById('reader-fav-btn');
    if (favBtn) favBtn.textContent = favorites.includes(currentBook.id) ? '❤️' : '♡';
}

// Other functions (filter, search, nav, auth, etc.) remain similar but enhanced...

function filterCategory(category) {
    navigateTo('library');
    const filtered = books.filter(b => b.category === category);
    renderBooks('books-grid', filtered);
}

function searchBooks() {
    const input = document.getElementById('search-input');
    const term = input ? input.value.toLowerCase().trim() : '';
    if (!term) {
        renderBooks('books-grid', books);
        return;
    }
    const results = books.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.pages.some(p => p.toLowerCase().includes(term))
    );
    renderBooks('books-grid', results);
}

// Persistent storage helpers (fixes the undefined localData error)
function loadData() {
    try {
        const raw = localStorage.getItem('kiddoData');
        if (!raw) {
            favorites = [];
            readingProgress = {};
            currentUser = null;
            return;
        }
        const parsed = JSON.parse(raw);
        favorites = Array.isArray(parsed.favorites) ? parsed.favorites : [];
        readingProgress = typeof parsed.readingProgress === 'object' && parsed.readingProgress !== null ? parsed.readingProgress : {};
        currentUser = parsed.currentUser || null;
    } catch (err) {
        console.error('Failed to load saved data:', err);
        favorites = [];
        readingProgress = {};
        currentUser = null;
    }
}

function saveData() {
    try {
        const payload = { favorites, readingProgress, currentUser };
        localStorage.setItem('kiddoData', JSON.stringify(payload));
    } catch (err) {
        console.error('Failed to save data:', err);
    }
}

// Lightweight UI helpers to avoid additional runtime errors
function navigateTo(sectionId) {
    // Hide sections marked with data-section and show the requested one if present
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');
}

function refreshCurrentView() {
    // Re-render common lists if they exist
    if (document.getElementById('featured-books')) renderBooks('featured-books', books.slice(0, 4));
    if (document.getElementById('books-grid')) renderBooks('books-grid', books);
    if (document.getElementById('favorites-grid')) renderBooks('favorites-grid', books.filter(b => favorites.includes(b.id)));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.log('Toast:', message);
        return;
    }
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function init() {
    loadData();
    renderBooks('featured-books', books.slice(0, 4));
    navigateTo('home');
    
    console.log("%c🎨 KiddoBooks v2.0 - Enhanced Edition Ready!", "color:#a855f7; font-size:16px; font-weight:bold");
}

window.onload = init;
