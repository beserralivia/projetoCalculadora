
document.addEventListener("DOMContentLoaded", function () {
    fetchUnidadesConsumidoras();

    document.getElementById('residenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveUnidadeConsumidora();
    });
});

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('residenciasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.unidades_consumidoras.forEach(unidade => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${unidade.nome}</strong></div>
                            <div class="col">
                                <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${unidade.id}, '${unidade.nome}')">Editar</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-danger btn-sm float-end" onclick="deleteUnidadeConsumidora(${unidade.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar unidades consumidoras:', error));
}

function showAddForm() {
    document.getElementById('residenciaForm').classList.remove('d-none');
    document.getElementById('residenciaId').value = '';
    document.getElementById('proprietario').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Unidade Consumidora';
}

function showEditForm(id, nome) {
    document.getElementById('residenciaForm').classList.remove('d-none');
    document.getElementById('residenciaId').value = id;
    document.getElementById('proprietario').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Unidade Consumidora';
}

function saveUnidadeConsumidora() {
    const id = document.getElementById('residenciaId').value;
    const nome = document.getElementById('proprietario').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/unidades-consumidoras/${id}` : 'http://localhost:8000/unidades-consumidoras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    })
    .then(response => response.json())
    .then(() => {
        fetchUnidadesConsumidoras();
        document.getElementById('residenciaForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar unidade consumidora:', error));
}

function deleteUnidadeConsumidora(id) {
    fetch(`http://localhost:8000/unidades-consumidoras/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchUnidadesConsumidoras())
    .catch(error => console.error('Erro ao deletar unidade consumidora:', error));
}
