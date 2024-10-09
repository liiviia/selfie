<template>
    <footer class="footer">
      <div class="container">
        <div class="text-center mt-4">
          <p>&copy; {{ currentYear }} Selfie App. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'AppFooter',
    data() {
      return {
        currentYear: new Date().getFullYear()
      };
    }
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #343a40;
    color: white;
    padding: 20px 0;
  }
  
  .footer h5 {
    font-size: 18px;
    color: #ffffff;
  }
  
  .footer p,
  .footer ul,
  .footer li,
  .footer a {
    font-size: 14px;
    color: #dcdcdc;
    text-decoration: none;
  }
  
  .footer a:hover {
    color: #ffffff;
  }
  
  .social-links {
    list-style: none;
    padding: 0;
  }
  
  .social-links li {
    display: inline;
    margin-right: 10px;
  }
  
  .social-links a {
    color: #dcdcdc;
  }
  </style>
  