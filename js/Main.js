// Check internet connection
window.addEventListener('load', () => {

  if ( !navigator.onLine ) {

    alert('⚠️ No internet connection. Some features may not work.');

  };

  if ( ! ( window.location.pathname.includes( 'index.html' ) ) ) {

    if ( window.location.pathname.endsWith('/') ) {

      window.location.href = window.location.pathname + 'index.html'

    } else {

      window.location.href = window.location.pathname + '/index.html'

    };

  } else {

    if ( sessionStorage.getItem( 'Database_Users' ) == null ) {

      window.location.assign( './Loading.html' );

    };

  };
  
});

// Load and parse Database_Users (You will fill sessionStorage from Google Sheets)
let databaseUsers = [];
try {
  const data = sessionStorage.getItem('Database_Users');
  if (data) {
    databaseUsers = JSON.parse(data);
    if (!Array.isArray(databaseUsers)) throw new Error('Invalid format');
  }
} catch (err) {
  console.error('Failed to parse Database_Users:', err);
  databaseUsers = [];
}

// Example function to check login session
function checkSession() {
  const activeUser = sessionStorage.getItem('activeUser');
  if (activeUser) {
    // Redirect or show user dashboard
    window.location.href = './dashboard.html'; // Change as needed
  }
}

// Run on page load
checkSession();
