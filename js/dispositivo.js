document.addEventListener("DOMContentLoaded", function () {
    fetchDispositivos();
    fetchUnidadesConsumidoras();
    fetchDependencias();
    fetchTiposDispositivos();
    document.getElementById('dispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDispositivo();
    });
});

function fetchDispositivos() {
    fetch('http://localhost:8000/dispositivos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('dispositivosList');
            if (data.dispositivos && data.dispositivos.length) {
                list.innerHTML = '<ul class="list-group border border-danger">';
                data.dispositivos.forEach(dispositivo => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"><strong>${dispositivo.nome}</strong></div>
                                <div class="col">
                                    <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${dispositivo.id}, '${dispositivo.nome}', ${dispositivo.consumo}, ${dispositivo.uso_diario}, ${dispositivo.unidade_consumidora_id}, ${dispositivo.dependencia_id})">Editar</button>
                                </div>
                                <div class="col">
                                    <button class="btn btn-danger btn-sm float-end" onclick="deleteDispositivo(${dispositivo.id})">Deletar</button>
                                </div>
                            </div>
                        </li>`;
                });
                list.innerHTML += '</ul>';
            } else {
                list.innerHTML = '<p>Nenhum dispositivo encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dispositivos:', error);
            alert(`Erro ao buscar dispositivos: ${error.message}`);
        });
}

function fetchUnidadesConsumidoras() {
    fetch('http://localhost:8000/unidades-consumidoras')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('unidadeConsumidoraSelect');
            if (data.unidades_consumidoras && data.unidades_consumidoras.length) {
                data.unidades_consumidoras.forEach(unidade => {
                    select.innerHTML += `<option value="${unidade.id}">${unidade.nome}</option>`;
                });
            } else {
                select.innerHTML = '<option value="">Nenhuma unidade consumidora encontrada.</option>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar unidades consumidoras:', error);
            alert(`Erro ao buscar unidades consumidoras: ${error.message}`);
        });
}

function fetchDependencias() {
    fetch('http://localhost:8000/dependencias')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('dependenciaSelect');
            if (data.dependencias && data.dependencias.length) {
                data.dependencias.forEach(dependencia => {
                    select.innerHTML += `<option value="${dependencia.id}">${dependencia.nome}</option>`;
                });
            } else {
                select.innerHTML = '<option value="">Nenhuma dependência encontrada.</option>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dependências:', error);
            alert(`Erro ao buscar dependências: ${error.message}`);
        });
}
function fetchTiposDispositivos() {
    fetch('http://localhost:8000/tipos-dispositivos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('tipoDispositivoSelect');
            if (data.tipos_dispositivos && data.tipos_dispositivos.length) {
                data.tipos_dispositivos.forEach(tipo => {
                    select.innerHTML += `<option value="${tipo.id}">${tipo.nome}</option>`;
                });
            } else {
                select.innerHTML = '<option value="">Nenhum tipo de dispositivo encontrado.</option>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar tipos de dispositivos:', error);
            alert(`Erro ao buscar tipos de dispositivos: ${error.message}`);
        });
}

function showAddForm() {
    console.log('Exibindo formulário de adicionar dispositivo');
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('dispositivoFormElement').classList.remove('d-none'); // Remover a classe d-none do formulário
    document.getElementById('dispositivoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('consumo').value = '';
    document.getElementById('uso_diario').value = '';
    document.getElementById('unidadeConsumidoraSelect').value = '';
    document.getElementById('dependenciaSelect').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Dispositivo';
}



function showEditForm(id, nome, consumo, uso_diario, unidadeConsumidoraId, dependenciaId, tipoId) {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('dispositivoId').value = id || '';
    document.getElementById('nome').value = nome || '';
    document.getElementById('consumo').value = consumo || '';
    document.getElementById('uso_diario').value = uso_diario || '';
    document.getElementById('unidadeConsumidoraSelect').value = unidadeConsumidoraId || '';
    document.getElementById('dependenciaSelect').value = dependenciaId || '';
    document.getElementById('tipoDispositivoSelect').value = tipoId || ''; // Adicione este campo
    document.getElementById('formTitle').innerText = 'Editar Dispositivo';
}


function saveDispositivo() {
    const id = document.getElementById('dispositivoId').value;
    const nome = document.getElementById('nome').value;
    const consumo = document.getElementById('consumo').value;
    const uso_diario = document.getElementById('uso_diario').value;
    const unidadeConsumidoraId = document.getElementById('unidadeConsumidoraSelect').value;
    const dependenciaId = document.getElementById('dependenciaSelect').value;
    const tipoId = document.getElementById('tipoDispositivoSelect').value; // Adicione este campo
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dispositivos/${id}` : 'http://localhost:8000/dispositivos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            consumo: consumo,
            uso_diario: uso_diario,
            unidade_consumidora_id: unidadeConsumidoraId,
            dependencia_id: dependenciaId,
            tipo_id: tipoId // Adicione este campo
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.detail || 'Erro desconhecido ao salvar dispositivo.');
            });
        }
        return response.json();
    })
    .then(() => {
        fetchDispositivos();
        hideForm();
    })
    .catch(error => {
        console.error('Erro ao salvar dispositivo:', error);
        alert(`Erro ao salvar dispositivo: ${error.message}`);
    });
}


function deleteDispositivo(id) {
    if (!confirm('Você tem certeza que deseja excluir este dispositivo?')) return;

    fetch(`http://localhost:8000/dispositivos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.detail || 'Erro desconhecido ao excluir dispositivo.');
            });
        }
        return response.json();
    })
    .then(() => {
        fetchDispositivos();
    })
    .catch(error => {
        console.error('Erro ao excluir dispositivo:', error);
        alert(`Erro ao excluir dispositivo: ${error.message}`);
    });
}

function hideForm() {
    document.getElementById('dispositivoForm').classList.add('d-none');
}
