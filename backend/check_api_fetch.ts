async function checkApi() {
  try {
    const res = await fetch('http://localhost:4001/api/projects');
    const data = await res.json();
    console.log('API_RESPONSE_LENGTH:', data.data.length);
    data.data.forEach((p) => console.log(`- [${p.status}] ${p.title}`));
  } catch (err) {
    console.error('API_ERROR:', err.message);
  }
}

checkApi();
