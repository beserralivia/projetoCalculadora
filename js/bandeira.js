document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();

    document.getElementById('bandeiraFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveBandeira();
    });
});

function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('bandeirasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.bandeiras.forEach(bandeira => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"> <strong>${bandeira.nome}</strong> - R$ ${bandeira.tarifa}</div>
                            <div class="col text-end"> 
                                <button class="btn btn-info btn-sm ms-2" onclick="showEditForm(${bandeira.id}, '${bandeira.nome}', ${bandeira.tarifa})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteBandeira(${bandeira.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar bandeiras:', error));
}

function showAddBandeiraForm() {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = '';
    document.getElementById('bandeiraNome').value = '';
    document.getElementById('bandeiraTarifa').value = '';
    document.getElementById('bandeiraFormTitle').innerText = 'Adicionar Bandeira';
}

function showEditForm(id, nome, tarifa) {
    // Verificar se o elemento existe antes de manipular
    const bandeiraForm = document.getElementById('bandeiraForm');
    if (bandeiraForm) {
        bandeiraForm.classList.remove('d-none');
        document.getElementById('bandeiraId').value = id;
        document.getElementById('bandeiraNome').value = nome;
        document.getElementById('bandeiraTarifa').value = tarifa;
        document.getElementById('bandeiraFormTitle').innerText = 'Editar Bandeira';
    } else {
        console.error('Elemento com ID "bandeiraForm" não encontrado.');
    }
}

function saveBandeira() {
    const id = document.getElementById('bandeiraId').value;
    const nome = document.getElementById('bandeiraNome').value;
    const tarifa = parseFloat(document.getElementById('bandeiraTarifa').value);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/bandeiras/${id}` : 'http://localhost:8000/bandeiras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tarifa: tarifa })
    })
        .then(response => response.json())
        .then(() => {
            fetchBandeiras();
            document.getElementById('bandeiraForm').classList.add('d-none');
        })
        .catch(error => console.error('Erro ao salvar bandeira:', error));
}

function deleteBandeira(id) {
    fetch(`http://localhost:8000/bandeiras/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchBandeiras())
        .catch(error => console.error('Erro ao deletar bandeira:', error));
}

