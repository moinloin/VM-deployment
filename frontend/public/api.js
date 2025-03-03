const API_BASE = 'http://192.168.15.6:5000';

export async function deployVM(name, ip, password) {
    const response = await fetch(`${API_BASE}/deploy`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, ip, password })
    });
    return response.json();
}

export async function destroyVM(name) {
    const response = await fetch(`${API_BASE}/destroy`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name })
    });
    return response.json();
}
