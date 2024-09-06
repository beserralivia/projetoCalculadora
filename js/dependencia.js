document.addEventListener("DOMContentLoaded", function () {
    fetchDependencias();
    fetchUnidadesConsumidoras();

    document.getElementById('dependenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDependencia();
    });
});

function fetchDependencias() {
    fetch('http://localhost:8000/dependencias/unidade-consumidora/1') // Substitua 1 pelo ID real da unidade consumidora se necessário
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('dependenciasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.dependencias.forEach(dependencia => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${dependencia.nome}</strong></div>
                            <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${dependencia.id}, '${dependencia.nome}', ${dependencia.unidade_consumidora_id})">Editar</button></div>
                            <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteDependencia(${dependencia.id})">Deletar</button></div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar dependências:', error));
}

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras') // Ajuste a URL conforme necessário
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('unidadeConsumidoraSelect');
            select.innerHTML = '<option value="" disabled selected>Selecione uma Unidade Consumidora</option>';
            data.unidades_consumidoras.forEach(unidade => {
                select.innerHTML += `<option value="${unidade.id}">${unidade.nome}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function showAddForm() {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('dependenciaId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('unidadeConsumidoraSelect').value = '';
    document.getElementById('formTitle').innerText = 'Cadastrar nova Dependência';
}

function showEditForm(id, nome, unidadeConsumidoraId) {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('dependenciaId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('unidadeConsumidoraSelect').value = unidadeConsumidoraId;
    document.getElementById('formTitle').innerText = 'Editar Dependência';
}

function saveDependencia() {
    const id = document.getElementById('dependenciaId').value;
    const nome = document.getElementById('nome').value;
    const unidadeConsumidoraId = parseInt(document.getElementById('unidadeConsumidoraSelect').value);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dependencias/${id}` : 'http://localhost:8000/dependencias';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, unidade_consumidora_id: unidadeConsumidoraId })
    })
        .then(response => response.json())
        .then(() => {
            fetchDependencias();
            document.getElementById('dependenciaForm').classList.add('d-none');
        })
        .catch(error => console.error('Erro ao salvar dependência:', error));
}

function deleteDependencia(id) {
    fetch(`http://localhost:8000/dependencias/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchDependencias())
        .catch(error => console.error('Erro ao deletar dependência:', error));
}
