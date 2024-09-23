<template>
  <div class="login">
    <div class="login__container">
      <h1 class="login__title">Login</h1>
      <form @submit.prevent="login">
        <div class="login__field">
          <i class="login__icon fas fa-user"></i>
          <input v-model="username" type="text" id="username" class="login__input" placeholder="Username" required />
        </div>
        <div class="login__field">
          <i class="login__icon fas fa-lock"></i>
          <input v-model="password" type="password" id="password" class="login__input" placeholder="Password" required />
        </div>
        <button class="login__submit" type="submit">
          <span class="button__text">Login</span>
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      <a class="menu__item" href="/registratiAccedi">Registrati</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  /* created() {
    const token = localStorage.getItem('token'); 
    if (token) {
      // Puoi eventualmente fare una richiesta per verificare se il token è valido
      this.$router.push('/homePrincipale');
    }
  }, */
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        });
        // Salva il token nel localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', this.username);

        // Reindirizza l'utente alla home page
        this.$router.push('/homePrincipale'); 
      } catch (error) {
        // Mostra il messaggio di errore in caso di problemi con il login
        this.errorMessage = error.response?.data?.message || 'Errore durante il login';
      }
    }
  }
};
</script>


<style scoped>

/* Aggiungi uno sfondo sfumato */
.login {
  background: linear-gradient(90deg, #C7C5F4, #776BCC);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login__container {
  background: linear-gradient(90deg, #5D54A4, #7C78B8);
  border-radius: 20px;
  box-shadow: 0px 0px 24px #5C5696;
  width: 360px;
  padding: 30px;
  position: relative;
}

.login__title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
}

.login__field {
  margin-bottom: 20px;
  position: relative;
}

.login__icon {
  position: absolute;
  top: 15px;
  color: #7875B5;
}

.login__input {
  border: none;
  border-bottom: 2px solid #D1D1D4;
  background: none;
  padding: 10px;
  padding-left: 30px;
  font-weight: 700;
  width: 100%;
  transition: .2s;
}

.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6A679E;
}

.login__submit {
  background: #fff;
  font-size: 14px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #D4D3E8;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #4C489D;
  box-shadow: 0px 2px 2px #5C5696;
  cursor: pointer;
  transition: .2s;
}

.login__submit:focus,
.login__submit:hover {
  border-color: #6A679E;
  outline: none;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.menu__item {
  display: inline-block;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
}

</style>