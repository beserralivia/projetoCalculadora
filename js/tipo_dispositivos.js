let tiposDispositivos = [];

function fetchTiposDispositivos() {
    fetch('http://localhost:8000/tipos-dispositivos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.tipos_dispositivos && Array.isArray(data.tipos_dispositivos)) {
                tiposDispositivos = data.tipos_dispositivos;
                renderDispositivosList();
            } else {
                console.error('Erro: A estrutura de dados não é a esperada.', data);
            }
        })
        .catch(error => console.error('Erro ao buscar tipos de dispositivos:', error));
}


function renderDispositivosList() {
    const listContainer = document.getElementById('tiposDispositivosList');
    listContainer.innerHTML = '';

    if (tiposDispositivos.length === 0) {
        listContainer.innerHTML = '<p>Nenhum tipo de dispositivo cadastrado.</p>';
    } else {
        tiposDispositivos.forEach(dispositivo => {
            listContainer.innerHTML += `
                <div class="border p-3 mb-3 shadow">
                    <h5>${dispositivo.nome}</h5>
                    <button class="btn btn-info btn-sm" onclick="showEditForm(${dispositivo.id}, '${dispositivo.nome}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTipoDispositivo(${dispositivo.id})">Deletar</button>
                </div>
            `;
        });
    }
}

function showAddForm() {
    document.getElementById('formTitle').innerText = 'Cadastrar Novo Tipo de Dispositivo';
    document.getElementById('tipoDispositivoForm').classList.remove('d-none');
    document.getElementById('tipoDispositivoId').value = '';
    document.getElementById('nome').value = '';
}

function showEditForm(id, nome) {
    document.getElementById('formTitle').innerText = 'Editar Tipo de Dispositivo';
    document.getElementById('tipoDispositivoForm').classList.remove('d-none');
    document.getElementById('tipoDispositivoId').value = id;
    document.getElementById('nome').value = nome;
}

function hideForm() {
    document.getElementById('tipoDispositivoForm').classList.add('d-none');
}

function saveTipoDispositivo() {
    const id = document.getElementById('tipoDispositivoId').value;
    const nome = document.getElementById('nome').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-dispositivos/${id}` : 'http://localhost:8000/tipos-dispositivos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    })
    .then(response => response.json())
    .then(() => {
        fetchTiposDispositivos();
        hideForm();
    })
    .catch(error => console.error('Erro ao salvar tipo de dispositivo:', error));
}

function deleteTipoDispositivo(id) {
    fetch(`http://localhost:8000/tipos-dispositivos/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchTiposDispositivos())
    .catch(error => console.error('Erro ao deletar tipo de dispositivo:', error));
}

document.addEventListener("DOMContentLoaded", function() {
    fetchTiposDispositivos();
    document.getElementById('tipoDispositivoFormElement').addEventListener('submit', function(event) {
        event.preventDefault();
        saveTipoDispositivo();
    });
});
