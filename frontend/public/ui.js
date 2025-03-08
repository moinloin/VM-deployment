import { deployVM, destroyVM } from './api.js';

function showResponse(message, isError = false) {
    const responseDiv = document.getElementById('response');
    responseDiv.innerText = message;  // Fix: Text wird jetzt angezeigt
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

    if (!name || !ip || !password) {
        showResponse('Please fill all fields!', true);
        return;
    }

    showResponse('⏳ Deployment running...');

    try {
        const result = await deployVM(name, ip, password);
        if (result.status === 'success') {
            showResponse(`✅ Successfully deployed: ${result.name} @ ${result.ip}`);
        } else {
            showResponse(`❌ Error: ${result.message}`, true);
        }
    } catch (error) {
        showResponse('❌ Connection failed', true);
    }
}

async function handleDestroy() {
    const name = document.getElementById('delete-name').value.trim();

    if (!name) {
        showResponse('Please enter VM name!', true);
        return;
    }

    showResponse('⏳ Deleting VM...');

    try {
        const result = await destroyVM(name);
        if (result.status === 'success') {
            showResponse(`✅ VM ${name} was deleted`);
        } else {
            showResponse(`❌ Error: ${result.message}`, true);
        }
    } catch (error) {
        showResponse('❌ Connection failed', true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('deployBtn').addEventListener('click', handleDeploy);
    document.getElementById('destroyBtn').addEventListener('click', handleDestroy);
});

window.handleDeploy = handleDeploy;
window.handleDestroy = handleDestroy;
