/* ================================================================
   SPORTFLOW ADMIN — GESTIÓN DE USUARIOS
   Archivo: js/usuarios.js
   Descripción: Renderiza la tabla de usuarios, busca y elimina.
   ================================================================ */


document.addEventListener('DOMContentLoaded', () => {
  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function roleClass(role) {
    const normalized = String(role || 'user').toLowerCase();
    if (normalized === 'admin') return 'badge-role-admin';
    if (normalized === 'gestor') return 'badge-role-gestor';
    return 'badge-role-user';
  }

  function roleLabel(role) {
    return String(role || 'user');
  }

  function statusClass(state) {
    return state ? 'badge-active' : 'badge-inactive';
  }

  function statusLabel(state) {
    return state ? 'Activo' : 'Inactivo';
  }

  let deleteId = null;
  const delOverlay = document.getElementById('delOverlay');

  function askDelete(id, name) {
    deleteId = id;
    document.getElementById('delMsg').textContent = `¿Eliminar a "${name}"? Esta acción no se puede deshacer.`;
    delOverlay.classList.add('active');
  }

  async function renderTable(filter = '') {
    let users = [];

    try {
      users = await getUsers();
    } catch (error) {
      document.getElementById('tableBody').innerHTML = '';
      document.getElementById('tableFooter').textContent = 'No fue posible cargar los usuarios.';
      showToast('No se pudo cargar la lista de usuarios');
      return;
    }

    const q = filter.toLowerCase();
    const filtered = users.filter(user =>
      String(user.id || '').toLowerCase().includes(q) ||
      String(user.nombre || '').toLowerCase().includes(q) ||
      String(user.correo || '').toLowerCase().includes(q) ||
      String(user.rol || '').toLowerCase().includes(q) ||
      statusLabel(user.estado).toLowerCase().includes(q)
    );

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = filtered.map(user => `
      <tr>
        <td><strong>${escapeHtml(user.id)}</strong></td>
        <td>${escapeHtml(user.nombre)}</td>
        <td>${escapeHtml(user.correo)}</td>
        <td>${Number(user.edad || 0)}</td>
        <td><span class="badge ${roleClass(user.rol)}">${escapeHtml(roleLabel(user.rol))}</span></td>
        <td>
          <span class="badge ${statusClass(user.estado)}">
            <span class="status-dot"></span>${statusLabel(user.estado)}
          </span>
        </td>
        <td>
          <div class="actions">
            <button class="btn-icon btn-edit" data-id="${escapeHtml(user.id)}" title="Editar usuario">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon btn-del" data-id="${escapeHtml(user.id)}" data-name="${escapeHtml(user.nombre)}" title="Eliminar usuario">
              <svg viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    document.getElementById('tableFooter').textContent = `Mostrando ${filtered.length} de ${users.length} usuarios`;

    tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('sf_user_edit_id', btn.dataset.id);
        window.location.href = '7_editar_usuario.html';
      });
    });

    tbody.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', () => askDelete(btn.dataset.id, btn.dataset.name));
    });
  }

  document.getElementById('searchInput').addEventListener('input', e => {
    renderTable(e.target.value);
  });

  document.getElementById('cancelDel').addEventListener('click', () => {
    delOverlay.classList.remove('active');
  });

  document.getElementById('confirmDel').addEventListener('click', async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId);
      delOverlay.classList.remove('active');
      await renderTable(document.getElementById('searchInput').value);
      showToast('Usuario eliminado correctamente');
      deleteId = null;
    } catch (error) {
      showToast('No se pudo eliminar el usuario');
    }
  });

  delOverlay.addEventListener('click', e => {
    if (e.target === delOverlay) delOverlay.classList.remove('active');
  });

  renderTable();
});
