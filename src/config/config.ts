// src/config/config.ts
const config = {
    API_URL: import.meta.env.NODE_ENV === 'production' 
      ? 'https://tu-dominio.com/api' 
      : 'http://localhost:8080/api',
    TOKEN_KEY: 'annuar-token',
    USER_KEY: 'annuar-user',
  };
  
  export default config;