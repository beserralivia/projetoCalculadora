document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidoras();

    document.getElementById('residenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveUnidadeConsumidora();
    });
});

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.detail || 'Erro desconhecido ao buscar unidades consumidoras.');
                });
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('residenciasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.unidades_consumidoras.forEach(unidade => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${unidade.nome}</strong></div>
                            <div class="col">
                                <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${unidade.id}, '${unidade.nome}', ${unidade.tipo_id})">Editar</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-danger btn-sm float-end" onclick="deleteUnidadeConsumidora(${unidade.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error('Erro ao buscar unidades consumidoras:', error);
            alert(`Erro ao buscar unidades consumidoras: ${error.message}`);
        });
}

function showAddForm() {
    document.getElementById('residenciaForm').classList.remove('d-none');
    document.getElementById('residenciaId').value = '';
    document.getElementById('proprietario').value = '';
    document.getElementById('tipo').value = ''; // Limpa o select
    document.getElementById('formTitle').innerText = 'Adicionar Unidade Consumidora';

    loadTiposConsumidores(); // Carrega os tipos de consumidores
}

function showEditForm(id, nome, tipoId) {
    document.getElementById('residenciaForm').classList.remove('d-none');
    document.getElementById('residenciaId').value = id;
    document.getElementById('proprietario').value = nome;
    document.getElementById('tipo').value = tipoId; // Seleciona o tipo
    document.getElementById('formTitle').innerText = 'Editar Unidade Consumidora';

    loadTiposConsumidores(); // Carrega os tipos de consumidores
}

function loadTiposConsumidores() {
    fetch('http://localhost:8000/tipos-consumidores')
        .then(response => response.json())
        .then(data => {
            const tipoSelect = document.getElementById('tipo');
            tipoSelect.innerHTML = '<option value="">Selecione o tipo</option>'; // Adiciona a opção padrão
            data.tipos_consumidores.forEach(tipo => {
                tipoSelect.innerHTML += `<option value="${tipo.id}">${tipo.nome}</option>`;
            });
        })
        .catch(error => {
            console.error('Erro ao carregar tipos de consumidores:', error);
            alert(`Erro ao carregar tipos de consumidores: ${error.message}`);
        });
}

function saveUnidadeConsumidora() {
    const id = document.getElementById('residenciaId').value;
    const nome = document.getElementById('proprietario').value;
    const tipoId = document.getElementById('tipo').value; // Obtém o valor do select
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/unidades-consumidoras/${id}` : 'http://localhost:8000/unidades-consumidoras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tipo_id: tipoId })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.detail || 'Erro desconhecido ao salvar unidade consumidora.');
            });
        }
        return response.json();
    })
    .then(() => {
        fetchUnidadesConsumidoras();
        document.getElementById('residenciaForm').classList.add('d-none');
    })
    .catch(error => {
        console.error('Erro ao salvar unidade consumidora:', error);
        alert(`Erro ao salvar unidade consumidora: ${error.message}`);
    });
}

function deleteUnidadeConsumidora(id) {
    fetch(`http://localhost:8000/unidades-consumidoras/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.detail || 'Erro desconhecido ao deletar unidade consumidora.');
            });
        }
        return response.json();
    })
    .then(() => fetchUnidadesConsumidoras())
    .catch(error => {
        console.error('Erro ao deletar unidade consumidora:', error);
        alert(`Erro ao deletar unidade consumidora: ${error.message}`);
    });
}
