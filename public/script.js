const form = document.getElementById('crudform');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const loadBtn = document.getElementById('loadbtn');
const tableBody = document.querySelector('#usersTable tbody');

const apiBase = 'http://localhost:3000';

// ---------- LOAD USERS ----------
loadBtn.addEventListener('click', loadUsers);

async function loadUsers() {
  const res = await fetch(`${apiBase}/users`);
  const users = await res.json();

  tableBody.innerHTML = '';

  users.forEach(user => {
    tableBody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${user.gender}</td>
        <td>
          <button onclick="editUser(${user.id})">Edit</button>
          <button onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ---------- CREATE / UPDATE ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById('user_name').value,
    phone: document.getElementById('number').value,
    email: document.getElementById('email').value,
    gender: document.getElementById('gender').value
  };

  const id = document.getElementById('userId').value;

  if (id) {
    // UPDATE
    await fetch(`${apiBase}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    alert('User Updated!');
  } else {
    // CREATE
    await fetch(`${apiBase}/add-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    alert('User Added!');
  }

  form.reset();
  document.getElementById('userId').value = '';
  submitBtn.textContent = 'Create';
  cancelBtn.style.display = 'none';

  loadUsers();
});

// ---------- EDIT ----------
async function editUser(id) {
  const res = await fetch(`${apiBase}/users/${id}`);
  const user = await res.json();

  document.getElementById('userId').value = user.id;
  document.getElementById('user_name').value = user.name;
  document.getElementById('number').value = user.phone;
  document.getElementById('email').value = user.email;
  document.getElementById('gender').value = user.gender;

  submitBtn.textContent = 'Update';
  cancelBtn.style.display = 'inline';
}

// ---------- DELETE ----------
async function deleteUser(id) {
  if (!confirm('Are you sure?')) return;

  await fetch(`${apiBase}/users/${id}`, {
    method: 'DELETE'
  });

  alert('User Deleted!');
  loadUsers();
}

// ---------- CANCEL ----------
cancelBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('userId').value = '';
  submitBtn.textContent = 'Create';
  cancelBtn.style.display = 'none';
});
