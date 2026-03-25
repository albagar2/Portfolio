const axios = require('axios');

async function checkApi() {
  try {
    const { data } = await axios.get('http://localhost:4001/api/projects');
    console.log('API_RESPONSE_LENGTH:', data.data.length);
    data.data.forEach((p: any) => console.log(`- [${p.status}] ${p.title}`));
  } catch (err) {
    console.error('API_ERROR:', err.message);
  }
}

checkApi();
