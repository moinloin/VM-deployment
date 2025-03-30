import { deployVM, destroyVM, listVMs } from './api.js';

function showResponse(message, isError = false) {
    const responseDiv = document.getElementById('response');
    responseDiv.textContent = message;
    responseDiv.className = `response ${isError ? 'error' : 'success'}`;
    responseDiv.style.display = 'block';
    setTimeout(() => {
        responseDiv.style.display = 'none';
    }, 5000);
}

async function handleDeploy() {
    const name = document.getElementById('name').value.trim();
    const ip = document.getElementById('ip').value.trim();
    const password = document.getElementById('password').value.trim();
    const cores = document.getElementById('cores').value;
    const memory = document.getElementById('memory').value;
    const disk_size = document.getElementById('disk_size').value;

    if (!name || !ip || !password) {
        showResponse('Please fill all fields!', true);
        return;
    }

    showResponse('⏳ Deploying...');

    try {
        const result = await deployVM(name, ip, password, cores, memory, disk_size);
        if (result.status === 'success') {
            showResponse(`✅ Created: ${result.name}`);
            closeModal();
            fetchVMs();
        } else {
            showResponse(`❌ Error: ${result.message}`, true);
        }
    } catch {
        showResponse('❌ Deployment failed.', true);
    }
}

function closeModal() {
    document.getElementById('vmModal').classList.add('hidden');
}
function openModal() {
    document.getElementById('vmModal').classList.remove('hidden');
}

async function fetchVMs() {
    const container = document.getElementById('vmList');
    container.innerHTML = '';

    try {
        const data = await listVMs();
        const vms = data.vms;

        if (!vms.length) {
            container.innerHTML = '<p>No VMs found.</p>';
            return;
        }

        vms.forEach(vm => {
            const row = document.createElement('div');
            row.className = 'flex justify-between items-center py-3 px-4 hover:bg-slate-700';

            const label = document.createElement('div');
            label.textContent = `${vm.name} (${vm.status})`;

            const btn = document.createElement('button');
            btn.textContent = 'Delete';
            btn.className = 'btn destroy w-auto px-4 py-1';
            btn.onclick = async () => {
                const confirmed = confirm(`Delete VM "${vm.name}"?`);
                if (!confirmed) return;

                try {
                    const result = await destroyVM(vm.name);
                    if (result.status === 'success') {
                        showResponse(`✅ Deleted: ${vm.name}`);
                        fetchVMs();
                    } else {
                        showResponse(`❌ Error: ${result.message}`, true);
                    }
                } catch {
                    showResponse('❌ Delete failed', true);
                }
            };

            row.appendChild(label);
            row.appendChild(btn);
            container.appendChild(row);
        });
    } catch {
        container.innerHTML = '<p class="text-red-500">Error loading VMs</p>';
    }
}

document.getElementById('refreshBtn').addEventListener('click', fetchVMs);
document.getElementById('openModalBtn').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('deployBtn').addEventListener('click', handleDeploy);
window.onload = fetchVMs;
