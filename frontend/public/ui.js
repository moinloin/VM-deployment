import { deployVM, destroyVM } from './api.js';

function showResponse(message, isError = false) {
    const responseDiv = document.getElementById('response');
    responseDiv.innerText = message;
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
        showResponse('Bitte alle Felder ausfüllen!', true);
        return;
    }

    showResponse('⏳ Deployment läuft...');

    try {
        const result = await deployVM(name, ip, password);
        if (result.status === 'success') {
            showResponse(`✅ Erfolgreich deployed: ${result.name} @ ${result.ip}`);
        } else {
            showResponse(`❌ Fehler: ${result.message}`, true);
        }
    } catch (error) {
        showResponse('❌ Verbindung fehlgeschlagen', true);
    }
}

async function handleDestroy() {
    const name = document.getElementById('delete-name').value.trim();

    if (!name) {
        showResponse('Bitte VM-Name eingeben!', true);
        return;
    }

    showResponse('⏳ VM wird gelöscht...');

    try {
        const result = await destroyVM(name);
        if (result.status === 'success') {
            showResponse(`✅ VM ${name} wurde gelöscht`);
        } else {
            showResponse(`❌ Fehler: ${result.message}`, true);
        }
    } catch (error) {
        showResponse('❌ Verbindung fehlgeschlagen', true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('deployBtn').addEventListener('click', handleDeploy);
    document.getElementById('destroyBtn').addEventListener('click', handleDestroy);
});

window.handleDeploy = handleDeploy;
window.handleDestroy = handleDestroy;
