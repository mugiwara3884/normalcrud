document.getElementById('createBtn').addEventListener('click', () => {
    document.getElementById('content').innerHTML = `
      <h2>Create New Entry</h2>
      <form id="createForm">
        <input type="text" id="newEntry" placeholder="Enter data" required />
        <button type="submit">Submit</button>
      </form>
    `;
    
    document.getElementById('createForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const entry = document.getElementById('newEntry').value;
  
      // Sending data to the server
      const response = await fetch('/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry }),
      });
  
      const result = await response.json();
      alert(result.message);
    });
  });
  
  document.getElementById('readBtn').addEventListener('click', async () => {
    const response = await fetch('/read');
    const data = await response.json();
  
    const content = data.map((item, index) => `<p>${index + 1}. ${item.entry}</p>`).join('');
    document.getElementById('content').innerHTML = `<h2>Entries</h2>${content}`;
  });
  