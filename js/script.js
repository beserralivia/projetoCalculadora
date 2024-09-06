

// unidades consumidoras
//dispositivos
function fetchDispositivos() {
    const unidadeConsumidoraId = 1; // Ajuste conforme necessário
    fetch(`http://localhost:8000/dispositivos/unidades-consumidoras/${unidadeConsumidoraId}`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('dispositivosList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.dispositivos.forEach(dispositivo => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${dispositivo.nome}</strong></div>
                            <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${dispositivo.id}, '${dispositivo.nome}', ${dispositivo.consumo}, ${dispositivo.uso_diario}, ${dispositivo.unidade_consumidora}, ${dispositivo.dependencia || 0})">Editar</button></div>
                            <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteDispositivo(${dispositivo.id})">Deletar</button></div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        });
}

function showAddForm() {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('dispositivoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('consumo').value = '';
    document.getElementById('uso_diario').value = '';
    document.getElementById('unidadeConsumidoraId').value = '';
    document.getElementById('dependenciaId').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Dispositivo';
}

function showEditForm(id, nome, consumo, uso_diario, unidadeConsumidoraId, dependenciaId) {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('dispositivoId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('consumo').value = consumo;
    document.getElementById('uso_diario').value = uso_diario;
    document.getElementById('unidadeConsumidoraId').value = unidadeConsumidoraId;
    document.getElementById('dependenciaId').value = dependenciaId || '';
    document.getElementById('formTitle').innerText = 'Editar Dispositivo';
}

function saveDispositivo() {
    const id = document.getElementById('dispositivoId').value;
    const nome = document.getElementById('nome').value;
    const consumo = document.getElementById('consumo').value;
    const uso_diario = document.getElementById('uso_diario').value;
    const unidadeConsumidoraId = document.getElementById('unidadeConsumidoraId').value;
    const dependenciaId = document.getElementById('dependenciaId').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dispositivos/${id}` : 'http://localhost:8000/dispositivos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, consumo, uso_diario, unidade_consumidora: unidadeConsumidoraId, dependencia: dependenciaId || null })
    })
        .then(response => response.json())
        .then(() => {
            fetchDispositivos();
            document.getElementById('dispositivoForm').classList.add('d-none');
        });
}

function deleteDispositivo(id) {
    fetch(`http://localhost:8000/dispositivos/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchDispositivos());
}
